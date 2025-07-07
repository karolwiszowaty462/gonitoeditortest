import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  ebayConnected: boolean;
  createdAt: string;
  lastLogin?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  phone?: string;
  company?: string;
}

interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  // Admin functions
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => Promise<boolean>;
  updateUserById: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  getAllUsers: () => User[];
  resetUserPassword: (id: string, newPassword: string) => Promise<boolean>;
}

// Predefined admin account
const ADMIN_CREDENTIALS = {
  email: 'admin@gonito.pl',
  password: 'gonito123',
  userData: {
    id: 'admin-001',
    email: 'admin@gonito.pl',
    name: 'Administrator',
    ebayConnected: true,
    role: 'admin' as const,
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString(),
    isActive: true,
    company: 'Gonito Editor'
  }
};

// Default users for demonstration
const defaultUsers: User[] = [
  ADMIN_CREDENTIALS.userData,
  {
    id: 'user-001',
    email: 'jan.kowalski@example.com',
    name: 'Jan Kowalski',
    ebayConnected: false,
    role: 'user',
    createdAt: '2024-01-15T14:20:00Z',
    lastLogin: '2024-01-19T16:45:00Z',
    isActive: true,
    phone: '+48 123 456 789',
    company: 'Sklep Online'
  },
  {
    id: 'user-002',
    email: 'anna.nowak@example.com',
    name: 'Anna Nowak',
    ebayConnected: true,
    role: 'user',
    createdAt: '2024-01-18T09:15:00Z',
    lastLogin: '2024-01-20T08:30:00Z',
    isActive: true,
    phone: '+48 987 654 321',
    company: 'Fashion Store'
  },
  {
    id: 'user-003',
    email: 'piotr.wisniewski@example.com',
    name: 'Piotr Wiśniewski',
    ebayConnected: false,
    role: 'user',
    createdAt: '2024-01-10T11:30:00Z',
    lastLogin: '2024-01-18T14:20:00Z',
    isActive: false,
    phone: '+48 555 123 456',
    company: 'Tech Solutions'
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: defaultUsers,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        const { users } = get();
        
        // Check for admin credentials
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          const updatedAdmin = { ...ADMIN_CREDENTIALS.userData, lastLogin: new Date().toISOString() };
          set({ 
            user: updatedAdmin, 
            isAuthenticated: true,
            users: users.map(u => u.id === 'admin-001' ? updatedAdmin : u)
          });
          return true;
        }
        
        // Check for regular user
        const user = users.find(u => u.email === email && u.isActive);
        if (user && password && password.length >= 6) {
          const updatedUser = { ...user, lastLogin: new Date().toISOString() };
          set({ 
            user: updatedUser, 
            isAuthenticated: true,
            users: users.map(u => u.id === user.id ? updatedUser : u)
          });
          return true;
        }
        
        return false;
      },
      
      register: async (name: string, email: string, password: string) => {
        const { users } = get();
        
        // Check if email already exists
        if (users.find(u => u.email === email)) {
          return false;
        }
        
        if (name && email && password && password.length >= 6) {
          const newUser: User = {
            id: `user-${Date.now()}`,
            email,
            name,
            ebayConnected: false,
            role: 'user',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isActive: true,
          };
          
          set({ 
            user: newUser, 
            isAuthenticated: true,
            users: [...users, newUser]
          });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateUser: (updates) => {
        const { user, users } = get();
        if (user) {
          const updatedUser = { ...user, ...updates };
          set({ 
            user: updatedUser,
            users: users.map(u => u.id === user.id ? updatedUser : u)
          });
        }
      },

      // Admin functions
      addUser: async (userData) => {
        const { users } = get();
        
        // Check if email already exists
        if (users.find(u => u.email === userData.email)) {
          return false;
        }
        
        const newUser: User = {
          ...userData,
          id: `user-${Date.now()}`,
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        
        set({ users: [...users, newUser] });
        return true;
      },

      updateUserById: (id, updates) => {
        const { users, user } = get();
        const updatedUsers = users.map(u => 
          u.id === id ? { ...u, ...updates } : u
        );
        
        set({ 
          users: updatedUsers,
          // Update current user if it's the same user being updated
          user: user?.id === id ? { ...user, ...updates } : user
        });
      },

      deleteUser: (id) => {
        const { users } = get();
        // Don't allow deleting admin
        if (id === 'admin-001') return;
        
        set({ users: users.filter(u => u.id !== id) });
      },

      toggleUserStatus: (id) => {
        const { users } = get();
        // Don't allow deactivating admin
        if (id === 'admin-001') return;
        
        const updatedUsers = users.map(u => 
          u.id === id ? { ...u, isActive: !u.isActive } : u
        );
        
        set({ users: updatedUsers });
      },

      getAllUsers: () => {
        return get().users;
      },

      resetUserPassword: async (id, newPassword) => {
        // In a real app, this would make an API call
        // For demo purposes, we'll just return success
        if (newPassword.length >= 6) {
          console.log(`Password reset for user ${id}`);
          return true;
        }
        return false;
      },
    }),
    {
      name: 'auth-storage',
      version: 0,
    }
  )
);