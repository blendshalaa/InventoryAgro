import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  FileText,
  FolderTree,
  Database,
} from 'lucide-react';
import { t } from '../lib/i18n';
import InstallButton from './InstallButton';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: t.nav.dashboard },
  { to: '/products', icon: Package, label: t.nav.products },
  { to: '/products/add', icon: PlusCircle, label: t.nav.addProduct },
  { to: '/stock-in', icon: ArrowDownCircle, label: t.nav.stockIn },
  { to: '/stock-out', icon: ArrowUpCircle, label: t.nav.stockOut },
  { to: '/history', icon: History, label: t.nav.history },
  { to: '/reports', icon: FileText, label: t.nav.reports },
  { to: '/categories', icon: FolderTree, label: t.nav.categories },
  { to: '/backup', icon: Database, label: t.nav.backup },
];

export default function Sidebar({ onNavigate }) {
  return (
    <aside className="w-64 min-h-screen bg-[var(--color-sidebar)] text-white flex flex-col shrink-0">
      <div className="p-5 border-b border-slate-600/50">
        <h1 className="text-lg font-semibold tracking-tight truncate">
          {t.appName}
        </h1>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 transition-colors ${
                isActive
                  ? 'bg-[var(--color-sidebar-active)] text-white font-medium'
                  : 'hover:bg-[var(--color-sidebar-hover)]'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>
      <InstallButton />
    </aside>
  );
}
