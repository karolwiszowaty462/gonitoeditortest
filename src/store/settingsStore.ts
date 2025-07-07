import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppSettings {
  // Profile settings
  name: string;
  email: string;
  
  // Notification settings
  emailNotifications: boolean;
  pushNotifications: boolean;
  templateUpdates: boolean;
  ebayIntegration: boolean;
  
  // Appearance settings
  theme: 'dark' | 'light';
  language: 'pl' | 'en';
  fontSize: 'small' | 'medium' | 'large';
  
  // Editor settings
  autoSave: boolean;
  codeHighlighting: boolean;
  livePreview: boolean;
  showLineNumbers: boolean;
  
  // Security settings
  twoFactorAuth: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
}

interface SettingsState {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
  applyTheme: () => void;
  requestNotificationPermission: () => Promise<boolean>;
  showNotification: (title: string, message: string) => void;
}

const defaultSettings: AppSettings = {
  name: '',
  email: '',
  emailNotifications: true,
  pushNotifications: false,
  templateUpdates: true,
  ebayIntegration: true,
  theme: 'dark',
  language: 'pl',
  fontSize: 'medium',
  autoSave: true,
  codeHighlighting: true,
  livePreview: true,
  showLineNumbers: true,
  twoFactorAuth: false,
  sessionTimeout: 30,
  loginNotifications: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      
      updateSettings: (updates) => {
        const newSettings = { ...get().settings, ...updates };
        set({ settings: newSettings });
        
        // Apply theme immediately if theme was updated
        if (updates.theme) {
          setTimeout(() => get().applyTheme(), 0);
        }
        
        // Apply font size immediately
        if (updates.fontSize) {
          const fontSizes = {
            small: '14px',
            medium: '16px',
            large: '18px'
          };
          document.documentElement.style.fontSize = fontSizes[updates.fontSize];
        }
        
        // Show notification if notifications are enabled and permission granted
        if (newSettings.pushNotifications && 'Notification' in window && Notification.permission === 'granted') {
          get().showNotification(
            'Ustawienia zaktualizowane',
            'Twoje preferencje zostały pomyślnie zapisane.'
          );
        }
      },
      
      resetSettings: () => {
        set({ settings: defaultSettings });
        get().applyTheme();
      },
      
      applyTheme: () => {
        const { theme, fontSize } = get().settings;
        const root = document.documentElement;
        const body = document.body;
        
        // Remove existing theme classes
        root.classList.remove('dark', 'light');
        body.classList.remove('dark-theme', 'light-theme');
        
        // Apply new theme
        if (theme === 'light') {
          root.classList.add('light');
          body.classList.add('light-theme');
          body.style.backgroundColor = '#f8fafc';
          body.style.color = '#1e293b';
          
          // Update CSS custom properties for light theme
          root.style.setProperty('--bg-primary', '#ffffff');
          root.style.setProperty('--bg-secondary', '#f8fafc');
          root.style.setProperty('--bg-tertiary', '#f1f5f9');
          root.style.setProperty('--text-primary', '#1e293b');
          root.style.setProperty('--text-secondary', '#475569');
          root.style.setProperty('--border-color', '#e2e8f0');
        } else {
          root.classList.add('dark');
          body.classList.add('dark-theme');
          body.style.backgroundColor = '#0f172a';
          body.style.color = '#f8fafc';
          
          // Update CSS custom properties for dark theme
          root.style.setProperty('--bg-primary', '#1e293b');
          root.style.setProperty('--bg-secondary', '#0f172a');
          root.style.setProperty('--bg-tertiary', '#334155');
          root.style.setProperty('--text-primary', '#f8fafc');
          root.style.setProperty('--text-secondary', '#cbd5e1');
          root.style.setProperty('--border-color', '#475569');
        }
        
        // Apply font size
        const fontSizes = {
          small: '14px',
          medium: '16px',
          large: '18px'
        };
        root.style.fontSize = fontSizes[fontSize];
      },
      
      requestNotificationPermission: async () => {
        if (!('Notification' in window)) {
          console.log('This browser does not support notifications');
          return false;
        }
        
        if (Notification.permission === 'granted') {
          return true;
        }
        
        if (Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission();
          return permission === 'granted';
        }
        
        return false;
      },
      
      showNotification: (title: string, message: string) => {
        const { pushNotifications } = get().settings;
        
        if (pushNotifications && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(title, {
            body: message,
            icon: '/vite.svg',
            badge: '/vite.svg'
          });
        }
      },
    }),
    {
      name: 'app-settings',
      version: 1,
    }
  )
);