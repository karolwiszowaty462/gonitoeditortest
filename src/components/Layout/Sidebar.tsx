import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingBag, 
  Settings, 
  LogOut,
  Palette,
  Users,
  UserPlus
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar: React.FC = () => {
  const { user, logout, users } = useAuthStore();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Panel główny', path: '/dashboard' },
    { icon: FileText, label: 'Szablony', path: '/templates' },
    { icon: Palette, label: 'Edytor', path: '/editor' },
    { icon: ShoppingBag, label: 'eBay', path: '/ebay' },
    ...(user?.role === 'admin' ? [
      { 
        icon: Users, 
        label: 'Użytkownicy', 
        path: '/users',
        badge: users.filter(u => !u.isActive).length > 0 ? users.filter(u => !u.isActive).length : undefined
      }
    ] : []),
    { icon: Settings, label: 'Ustawienia', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Gonito Editor</h1>
            <p className="text-xs text-slate-400">Szablony eBay</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Admin Quick Actions */}
        {user?.role === 'admin' && (
          <div className="mt-8 pt-4 border-t border-slate-700">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-3 px-4">
              Szybkie akcje
            </p>
            <NavLink
              to="/users"
              className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Dodaj użytkownika</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{user?.name}</p>
            <p className="text-slate-400 text-sm truncate">{user?.email}</p>
            {user?.role === 'admin' && (
              <span className="inline-block px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full mt-1">
                Administrator
              </span>
            )}
          </div>
        </div>
        
        {/* Admin Stats */}
        {user?.role === 'admin' && (
          <div className="mb-4 p-3 bg-slate-800 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Użytkownicy:</span>
              <span className="text-white font-medium">{users.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-slate-400">Aktywni:</span>
              <span className="text-green-400 font-medium">{users.filter(u => u.isActive).length}</span>
            </div>
            {users.filter(u => !u.isActive).length > 0 && (
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-slate-400">Nieaktywni:</span>
                <span className="text-red-400 font-medium">{users.filter(u => !u.isActive).length}</span>
              </div>
            )}
          </div>
        )}
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Wyloguj</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;