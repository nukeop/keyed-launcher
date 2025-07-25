import { PerformanceDashboard } from '../PerformanceDashboard';
import { KeyCombo, useActionContext } from '@keyed-launcher/plugin-sdk';
import { FC, ReactNode } from 'react';

export type ActionBarProps = {
  icon?: string | ReactNode;
  children?: ReactNode;
};

export const ActionBar: FC<ActionBarProps> = ({ icon, children }) => {
  const { currentActions } = useActionContext();

  return (
    <div
      className="flex w-full items-center justify-start border-t border-white/20 bg-zinc-600/80 py-2 px-3 text-white"
      data-testid="action-bar"
    >
      <span>{icon}</span>
      <span className="flex-1"></span>
      {children}
      {currentActions && (
        <div data-testid="current-actions" className="flex items-center gap-2">
          {currentActions}
        </div>
      )}
      <div className="h-3 mx-4 w-px bg-white/20"></div>
      <span className="flex flex-row items-center gap-2">
        <label className="text-white/60 text-sm">Actions</label>
        <KeyCombo
          combo={{
            modifiers: ['cmd'],
            key: 'k',
          }}
        />
      </span>
      <PerformanceDashboard />
    </div>
  );
};
