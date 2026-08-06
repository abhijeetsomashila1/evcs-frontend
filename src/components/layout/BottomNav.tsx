import { NavLink } from 'react-router-dom';
import { Home, Zap, Activity, Clock, Settings } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Chargers', path: '/chargers', icon: Zap },
    { name: 'Control', path: '/control', icon: Activity },
    { name: 'History', path: '/history', icon: Clock },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="absolute bottom-0 w-full bg-surface border-t border-gray-200 py-2 px-4 pb-safe flex justify-between items-center z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center p-2 rounded-lg transition-colors ${
              isActive ? 'text-primary' : 'text-textMuted hover:text-textMain'
            }`
          }
        >
          <item.icon size={24} className="mb-1" />
          <span className="text-xs font-medium">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}
