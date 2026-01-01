import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface TodontContextType {
  globalError: string | null;
  setGlobalError: (error: string | null) => void;
}

const TodontContext = createContext<TodontContextType | undefined>(undefined);

export function TodontProvider({ children }: { children: ReactNode }) {
  const [globalError, setGlobalError] = useState<string | null>(null);

  return (
    <TodontContext.Provider value={{ globalError, setGlobalError }}>
      {children}
    </TodontContext.Provider>
  );
}

export function useTodont() {
  const context = useContext(TodontContext);
  if (context === undefined) {
    throw new Error('useTodont must be used within a TodontProvider');
  }
  return context;
}
