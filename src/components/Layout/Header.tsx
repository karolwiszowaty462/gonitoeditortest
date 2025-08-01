import React, { useState } from 'react';
import { Bell, Search, Plus } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  onCreateNew?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  showSearch = false, 
  onCreateNew 
}) => {
  const { settings, showNotification } = useSettingsStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    {
      id: 1,
      title: 'Szablon zapisany',
      message: 'Twój szablon "eBay Premium" został pomyślnie zapisany',
      time: '5 min temu',
      read: false
    },
    {
      id: 2,
      title: 'Nowa aktualizacja',
      message: 'Dostępne są nowe bloki szablonów',
      time: '1 godz. temu',
      read: false
    },
    {
      id: 3,
      title: 'eBay synchronizacja',
      message: 'Pomyślnie zsynchronizowano 3 aukcje',
      time: '2 godz. temu',
      read: true
    }
  ];

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    
    if (settings.pushNotifications) {
      showNotification('Test powiadomienia', 'Powiadomienia działają poprawnie!');
    }
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Szukaj szablonów..."
                className="bg-slate-900 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
              />
            </div>
          )}

          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nowy szablon</span>
            </button>
          )}

          <div className="relative">
            <button 
              onClick={handleNotificationClick}
              className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-slate-700">
                  <h3 className="text-white font-semibold">Powiadomienia</h3>
                  <p className="text-slate-400 text-sm">{unreadCount} nieprzeczytanych</p>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {mockNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 border-b border-slate-700 hover:bg-slate-700 transition-colors ${
                        !notification.read ? 'bg-slate-900/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`font-medium ${!notification.read ? 'text-white' : 'text-slate-300'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-slate-400 text-sm mt-1">{notification.message}</p>
                          <p className="text-slate-500 text-xs mt-2">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 border-t border-slate-700">
                  <button className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Oznacz wszystkie jako przeczytane
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;