import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

// Simulated user database (in production, this would be a real backend)
const users: Array<{ email: string; password: string; name: string; id: string; createdAt: Date }> = [];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          set({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              createdAt: user.createdAt,
            },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      signup: async (email: string, password: string, name: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if user already exists
        if (users.find(u => u.email === email)) {
          return false;
        }

        const newUser = {
          id: `user-${Date.now()}`,
          email,
          password, // In production, this should be hashed
          name,
          createdAt: new Date(),
        };

        users.push(newUser);

        set({
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            createdAt: newUser.createdAt,
          },
          isAuthenticated: true,
        });

        return true;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
