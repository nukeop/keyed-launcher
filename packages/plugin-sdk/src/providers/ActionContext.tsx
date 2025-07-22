import { createContext, FC, ReactNode, useContext, useState } from 'react';

export type ActionContextType = {
  currentActions: ReactNode | null;
  setCurrentActions: (actions: ReactNode | null) => void;
};

export const ActionContext = createContext<ActionContextType | null>(null);

export const useActionContext = () => {
  const context = useContext(ActionContext);
  if (!context) {
    throw new Error('useActionContext must be used within an ActionProvider');
  }
  return context;
};

export type ActionProviderProps = {
  children: ReactNode;
};

export const ActionProvider: FC<ActionProviderProps> = ({ children }) => {
  const [currentActions, setCurrentActions] = useState<ReactNode | null>(null);

  const value: ActionContextType = {
    currentActions,
    setCurrentActions,
  };

  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  );
};
