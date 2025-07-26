import { PerformanceDashboard } from '../PerformanceDashboard';
import { KeyCombo, useActionContext } from '@keyed-launcher/plugin-sdk';
import { FC, ReactNode } from 'react';

export type ActionBarProps = {
  icon?: string | ReactNode;
  children?: ReactNode;
};

export const ActionBar: FC<ActionBarProps> = ({ icon, children }) => {
  const { currentActions, isActionPanelOpen } = useActionContext();

  return (
    <div
      className="flex w-full items-center justify-start border-t border-white/20 bg-zinc-600/80 py-2 px-3 gap-2 text-white"
      data-testid="action-bar"
    >
      <span>{icon}</span>
      <span className="flex-1"></span>
      <PerformanceDashboard />
      {children}
      {currentActions && (
        <div data-testid="current-actions" className="flex items-center gap-2">
          {currentActions}
        </div>
      )}
      <div
        className={`h-3 mx-2 w-px bg-white/20 transition-opacity duration-200 ${
          isActionPanelOpen ? 'opacity-0' : 'opacity-100'
        }`}
      ></div>
      <span
        className={`flex flex-row items-center gap-2 rounded px-2 py-1 transition-colors duration-200 ${
          isActionPanelOpen ? 'bg-white/10' : 'bg-transparent'
        }`}
      >
        <label className="text-white/60 text-sm">Actions</label>
        <KeyCombo combo={{ modifiers: ['cmd'], key: 'k' }} />
      </span>
    </div>
  );
};
