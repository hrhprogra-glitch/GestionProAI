import type { ReactNode } from 'react';

/**
 * MainLayout: Contenedor base de GestiónProAI
 * Organiza la barra lateral, la barra superior y el contenido dinámico.
 */
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col">
        {/* <Topbar /> */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}