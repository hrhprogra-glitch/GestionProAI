import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Carousel } from './components/Carousel';
import { supabase } from '../../supabase'; 
import Dashboard from '../dashboard'; 

export default function LoginModule() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState<'login' | 'register'>('login');
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // NUEVO: Estado para almacenar la meta-data incluyendo el ciclo (semester)
  const [userMetadata, setUserMetadata] = useState<{university?: string, career?: string, semester?: string, role?: string}>({});

  useEffect(() => {
    const savedUser = localStorage.getItem('remembered_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUserName(parsed.nombre);
      setEmail(parsed.correo);
      setUserMetadata({
        university: parsed.universidad,
        career: parsed.carrera,
        semester: parsed.ciclo, // NUEVO
        role: parsed.objetivo
      });
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    
    const { data, error } = await supabase
      .from('usuarios_simulados')
      .select('*')
      .eq('correo', email)
      .eq('contrasena', password)
      .single(); 

    if (error || !data) {
      alert("Error: Correo o contraseña incorrectos. Verifica que te hayas registrado primero.");
      console.error(error);
    } else {
      setUserName(data.nombre);
      
      // Guardamos en memoria los datos adicionales que vienen de la BD
      const meta = {
        university: data.universidad,
        career: data.carrera,
        semester: data.ciclo, // NUEVO
        role: data.objetivo
      };
      setUserMetadata(meta);
      setIsLoggedIn(true);

      if (rememberMe) {
        localStorage.setItem('remembered_user', JSON.stringify({ 
          nombre: data.nombre, 
          correo: data.correo,
          universidad: data.universidad,
          carrera: data.carrera,
          ciclo: data.ciclo, // NUEVO
          objetivo: data.objetivo
        }));
      }
    }
  };

  if (isLoggedIn) {
    return (
      <Dashboard 
        userName={userName} 
        email={email} 
        userMetadata={userMetadata} 
        onLogout={() => {
          setIsLoggedIn(false);
          setEmail('');
          setPassword('');
          setUserName('');
          setUserMetadata({});
          localStorage.removeItem('remembered_user');
        }} 
      />
    );
  }

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-gradient-to-br from-amber-50 via-pink-50 to-cyan-50 dark:from-[#0f172a] dark:via-[#31102f] dark:to-[#083344] m-0 p-0 relative">
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center relative z-10">
        {view === 'login' ? (
          <LoginForm 
            email={email} setEmail={setEmail} 
            password={password} setPassword={setPassword} 
            rememberMe={rememberMe} setRememberMe={setRememberMe}
            onSubmit={handleLogin} onSwitchToRegister={() => setView('register')} 
          />
        ) : (
          <RegisterForm onSwitchToLogin={() => setView('login')} />
        )}
      </div>
      <div className="hidden lg:block lg:w-1/2 h-full relative z-10">
        <Carousel />
      </div>
    </div>
  );
}