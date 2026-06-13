import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Carousel } from './components/Carousel';
import { supabase } from '../../supabase'; 
import Dashboard from '../dashboard'; // Importamos tu nuevo Dashboard

export default function LoginModule() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState<'login' | 'register'>('login');
  
  // Estados para cuando ingrese con éxito
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('remembered_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUserName(parsed.nombre);
      setEmail(parsed.correo);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    
    // BÚSQUEDA EN TU TABLA SIMULADA
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
      // Si encuentra los datos, guardamos el nombre y lo dejamos pasar
      setUserName(data.nombre);
      setIsLoggedIn(true);
      if (rememberMe) {
        localStorage.setItem('remembered_user', JSON.stringify({ nombre: data.nombre, correo: data.correo }));
      }
    }
  };

  // ==========================================
  // VISTA DE ÉXITO (Muestra tu nuevo Dashboard)
  // ==========================================
  if (isLoggedIn) {
    return (
      <Dashboard 
        userName={userName} 
        email={email} 
        onLogout={() => {
          setIsLoggedIn(false);
          setEmail('');
          setPassword('');
          setUserName('');
          localStorage.removeItem('remembered_user');
        }} 
      />
    );
  }

  // ==========================================
  // VISTA NORMAL DE LOGIN / REGISTRO
  // ==========================================
  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-gradient-to-br from-amber-50 via-pink-50 to-cyan-50 dark:from-[#0f172a] dark:via-[#31102f] dark:to-[#083344] m-0 p-0 relative">
      
      {/* Columna Izquierda: Formularios */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center relative z-10">
        {view === 'login' ? (
          <LoginForm 
            email={email} 
            setEmail={setEmail} 
            password={password} 
            setPassword={setPassword} 
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            onSubmit={handleLogin}
            onSwitchToRegister={() => setView('register')} 
          />
        ) : (
          <RegisterForm onSwitchToLogin={() => setView('login')} />
        )}
      </div>

      {/* Columna Derecha: Carrusel */}
      <div className="hidden lg:block lg:w-1/2 h-full relative z-10">
        <Carousel />
      </div>
      
    </div>
  );
}