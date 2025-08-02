import { Action, ActionPanel, ActionProps } from '../components';
import { ActionPanelProps } from '../components/ActionPanel/ActionPanel';
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
  currentActionPanel: ReactNode | null;
  setCurrentActionPanel: (actions: ReactNode | null) => void;
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
  const [currentActionPanel, setCurrentActionPanel] =
    useState<ReactNode | null>(null);

  const { keyboardShortcuts, actionCallbacks } = useMemo(() => {
    const shortcuts: Keyboard.Shortcut[] = [];
    const callbacks: (() => void)[] = [];

    if (
      isValidElement(currentActionPanel) &&
      currentActionPanel.type === ActionPanel
    ) {
      const actions = (currentActionPanel.props as ActionPanelProps).children;
      const actionComponents = Array.isArray(actions) ? actions : [actions];
      actionComponents.forEach((action) => {
        if (isValidElement(action) && action.type === Action) {
          const props = action.props as unknown as ActionProps;
          shortcuts.push(props.shortcut);
          callbacks.push(props.onAction);
        }
      });
    }
    return { keyboardShortcuts: shortcuts, actionCallbacks: callbacks };
  }, [currentActionPanel]);

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
    currentActionPanel,
    setCurrentActionPanel,
    isActionPanelOpen,
    setIsActionPanelOpen,
    keyboardShortcuts,
    actionCallbacks,
  };

  return (
    <ActionContext.Provider value={value}>{children}</ActionContext.Provider>
  );
};
