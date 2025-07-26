import { Action, ActionProps } from '../components';
import { Keyboard } from '../types/keyboard';
import {
  createContext,
  FC,
  isValidElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type ActionContextType = {
  currentActions: ReactNode | null;
  setCurrentActions: (actions: ReactNode | null) => void;
  isActionPanelOpen: boolean;
  setIsActionPanelOpen: (isOpen: boolean) => void;
  keyboardShortcuts: Keyboard.Shortcut[];
  actionCallbacks: (() => void)[];
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
  const [isActionPanelOpen, setIsActionPanelOpen] = useState(false);
  const [currentActions, setCurrentActions] = useState<ReactNode | null>(null);

  const { keyboardShortcuts, actionCallbacks } = useMemo(() => {
    const shortcuts: Keyboard.Shortcut[] = [];
    const callbacks: (() => void)[] = [];

    if (Array.isArray(currentActions)) {
      currentActions.forEach((action) => {
        if (isValidElement(action) && action.type === Action) {
          const props = action.props as ActionProps;
          shortcuts.push(props.shortcut);
          callbacks.push(props.onAction);
        }
      });
    } else if (
      isValidElement(currentActions) &&
      currentActions.type === Action
    ) {
      const props = currentActions.props as ActionProps;
      shortcuts.push(props.shortcut);
      callbacks.push(props.onAction);
    }

    return { keyboardShortcuts: shortcuts, actionCallbacks: callbacks };
  }, [currentActions]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'k':
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            setIsActionPanelOpen(!isActionPanelOpen);
          }
          break;
        case 'Escape':
          if (isActionPanelOpen) {
            event.preventDefault();
            event.stopPropagation();
            setIsActionPanelOpen(false);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isActionPanelOpen, setIsActionPanelOpen]);

  const value: ActionContextType = {
    currentActions,
    setCurrentActions,
    isActionPanelOpen,
    setIsActionPanelOpen,
    keyboardShortcuts,
    actionCallbacks,
  };

  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  );
};
