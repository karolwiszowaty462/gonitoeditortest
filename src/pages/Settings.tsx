import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import { 
  Save, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Monitor,
  Eye,
  EyeOff,
  AlertTriangle,
  Info,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';

const Settings: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { settings, updateSettings, resetSettings, applyTheme, requestNotificationPermission } = useSettingsStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize settings with user data
  useEffect(() => {
    if (user && (!settings.name || !settings.email)) {
      updateSettings({
        name: user.name,
        email: user.email
      });
    }
  }, [user, settings.name, settings.email, updateSettings]);

  // Apply theme on component mount and when settings change
  useEffect(() => {
    applyTheme();
  }, [applyTheme, settings.theme, settings.fontSize]);

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Powiadomienia', icon: Bell },
    { id: 'appearance', label: 'Wygląd', icon: Palette },
    { id: 'editor', label: 'Edytor', icon: Monitor },
    { id: 'security', label: 'Bezpieczeństwo', icon: Shield }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update user profile if changed
      if (settings.name !== user?.name || settings.email !== user?.email) {
        updateUser({
          name: settings.name,
          email: settings.email
        });
      }
      
      // Handle password change
      if (passwordData.newPassword && passwordData.confirmPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          setSaveMessage('Hasła nie są identyczne!');
          setIsSaving(false);
          return;
        }
        
        if (passwordData.newPassword.length < 6) {
          setSaveMessage('Hasło musi mieć co najmniej 6 znaków!');
          setIsSaving(false);
          return;
        }
        
        // Here you would normally validate current password and update
        console.log('Password would be updated');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
      
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage('Ustawienia zostały pomyślnie zapisane!');
      
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000);
      
    } catch (error) {
      setSaveMessage('Wystąpił błąd podczas zapisywania ustawień.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationToggle = async (key: keyof typeof settings, value: boolean) => {
    if (key === 'pushNotifications' && value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        setSaveMessage('Nie udało się uzyskać uprawnień do powiadomień.');
        return;
      }
    }
    
    updateSettings({ [key]: value });
    setSaveMessage('Ustawienie zostało zaktualizowane!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleThemeChange = (theme: 'dark' | 'light') => {
    updateSettings({ theme });
    setSaveMessage(`Motyw zmieniony na ${theme === 'dark' ? 'ciemny' : 'jasny'}!`);
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleFontSizeChange = (fontSize: 'small' | 'medium' | 'large') => {
    updateSettings({ fontSize });
    setSaveMessage(`Rozmiar czcionki zmieniony na ${fontSize === 'small' ? 'mały' : fontSize === 'medium' ? 'średni' : 'duży'}!`);
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Informacje podstawowe</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Imię i nazwisko
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => updateSettings({ name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Adres email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => updateSettings({ email: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Zmiana hasła</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Obecne hasło
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 pr-10 text-white focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nowe hasło
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Potwierdź hasło
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Powiadomienia email</h3>
        
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Powiadomienia email', desc: 'Otrzymuj powiadomienia na adres email' },
            { key: 'templateUpdates', label: 'Aktualizacje szablonów', desc: 'Informacje o nowych szablonach i aktualizacjach' },
            { key: 'ebayIntegration', label: 'Integracja eBay', desc: 'Powiadomienia o statusie aukcji i synchronizacji' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{item.label}</p>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
              <button
                onClick={() => handleNotificationToggle(item.key as keyof typeof settings, !settings[item.key as keyof typeof settings])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Powiadomienia push</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Powiadomienia push</p>
            <p className="text-slate-400 text-sm">Otrzymuj powiadomienia w przeglądarce</p>
          </div>
          <button
            onClick={() => handleNotificationToggle('pushNotifications', !settings.pushNotifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.pushNotifications ? 'bg-blue-600' : 'bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {settings.pushNotifications && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">Powiadomienia push są włączone</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Motyw</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: 'dark', label: 'Ciemny', desc: 'Ciemny motyw (zalecany)' },
            { value: 'light', label: 'Jasny', desc: 'Jasny motyw' }
          ].map((theme) => (
            <button
              key={theme.value}
              onClick={() => handleThemeChange(theme.value as 'dark' | 'light')}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                settings.theme === theme.value
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <p className="text-white font-medium">{theme.label}</p>
              <p className="text-slate-400 text-sm">{theme.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Język</h3>
        
        <select
          value={settings.language}
          onChange={(e) => {
            updateSettings({ language: e.target.value as 'pl' | 'en' });
            setSaveMessage('Język został zmieniony!');
            setTimeout(() => setSaveMessage(''), 2000);
          }}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="pl">Polski</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Rozmiar czcionki</h3>
        
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'small', label: 'Mała' },
            { value: 'medium', label: 'Średnia' },
            { value: 'large', label: 'Duża' }
          ].map((size) => (
            <button
              key={size.value}
              onClick={() => handleFontSizeChange(size.value as 'small' | 'medium' | 'large')}
              className={`p-3 border rounded-lg transition-colors ${
                settings.fontSize === size.value
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-600 text-slate-300 hover:border-slate-500'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEditorTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Ustawienia edytora</h3>
        
        <div className="space-y-4">
          {[
            { key: 'autoSave', label: 'Automatyczne zapisywanie', desc: 'Zapisuj zmiany automatycznie co 30 sekund' },
            { key: 'codeHighlighting', label: 'Podświetlanie składni', desc: 'Kolorowanie składni HTML i CSS' },
            { key: 'livePreview', label: 'Podgląd na żywo', desc: 'Aktualizuj podgląd podczas pisania' },
            { key: 'showLineNumbers', label: 'Numerowanie linii', desc: 'Pokaż numery linii w edytorze kodu' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{item.label}</p>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
              <button
                onClick={() => {
                  updateSettings({ [item.key]: !settings[item.key as keyof typeof settings] });
                  setSaveMessage(`${item.label} ${!settings[item.key as keyof typeof settings] ? 'włączony' : 'wyłączony'}!`);
                  setTimeout(() => setSaveMessage(''), 2000);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[item.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Uwierzytelnianie dwuskładnikowe</h3>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white font-medium">2FA</p>
            <p className="text-slate-400 text-sm">Dodatkowa warstwa bezpieczeństwa dla Twojego konta</p>
          </div>
          <button
            onClick={() => {
              updateSettings({ twoFactorAuth: !settings.twoFactorAuth });
              setSaveMessage(`2FA ${!settings.twoFactorAuth ? 'włączone' : 'wyłączone'}!`);
              setTimeout(() => setSaveMessage(''), 2000);
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.twoFactorAuth ? 'bg-blue-600' : 'bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {settings.twoFactorAuth && (
          <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
            <p className="text-slate-300 text-sm">
              Skonfiguruj aplikację uwierzytelniającą (Google Authenticator, Authy) aby włączyć 2FA.
            </p>
            <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Konfiguruj 2FA
            </button>
          </div>
        )}
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Sesja</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Timeout sesji (minuty)
            </label>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => {
                updateSettings({ sessionTimeout: parseInt(e.target.value) });
                setSaveMessage('Timeout sesji został zmieniony!');
                setTimeout(() => setSaveMessage(''), 2000);
              }}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value={15}>15 minut</option>
              <option value={30}>30 minut</option>
              <option value={60}>1 godzina</option>
              <option value={120}>2 godziny</option>
              <option value={0}>Bez limitu</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Powiadomienia o logowaniu</p>
              <p className="text-slate-400 text-sm">Otrzymuj email przy każdym logowaniu</p>
            </div>
            <button
              onClick={() => {
                updateSettings({ loginNotifications: !settings.loginNotifications });
                setSaveMessage(`Powiadomienia o logowaniu ${!settings.loginNotifications ? 'włączone' : 'wyłączone'}!`);
                setTimeout(() => setSaveMessage(''), 2000);
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.loginNotifications ? 'bg-blue-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.loginNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div>
            <p className="text-yellow-400 font-medium">Bezpieczeństwo konta</p>
            <p className="text-yellow-300 text-sm mt-1">
              Regularnie zmieniaj hasło i używaj silnych, unikalnych haseł dla każdego konta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'notifications': return renderNotificationsTab();
      case 'appearance': return renderAppearanceTab();
      case 'editor': return renderEditorTab();
      case 'security': return renderSecurityTab();
      default: return renderProfileTab();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header 
        title="Ustawienia"
        subtitle="Zarządzaj swoimi preferencjami i konfiguracją"
      />
      
      <div className="flex-1 p-6 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-64 bg-slate-800 border border-slate-700 rounded-xl p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
              
              {/* Reset Settings Button */}
              <div className="mt-6 pt-4 border-t border-slate-700">
                <button
                  onClick={() => {
                    resetSettings();
                    setSaveMessage('Ustawienia zostały zresetowane!');
                    setTimeout(() => setSaveMessage(''), 3000);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:bg-slate-700 hover:text-white rounded-lg transition-colors text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Resetuj ustawienia</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              {renderTabContent()}
              
              {/* Save Button and Messages */}
              <div className="mt-8 flex items-center justify-between">
                <div className="flex-1">
                  {saveMessage && (
                    <div className={`flex items-center gap-2 text-sm ${
                      saveMessage.includes('błąd') || saveMessage.includes('nie są identyczne') || saveMessage.includes('co najmniej')
                        ? 'text-red-400' 
                        : 'text-green-400'
                    }`}>
                      {saveMessage.includes('błąd') || saveMessage.includes('nie są identyczne') || saveMessage.includes('co najmniej') ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>{saveMessage}</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Zapisywanie...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Zapisz ustawienia</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;