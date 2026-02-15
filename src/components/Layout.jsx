import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <div
        className={`fixed inset-0 z-40 bg-black/50 md:hidden ${
          sidebarOpen ? '' : 'hidden'
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden
      />
      <div
        className={`fixed md:relative z-50 md:z-0 transform transition-transform duration-200 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-200"
            aria-label="Hap menunë"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-slate-800">Menaxhimi i Inventarit</span>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
