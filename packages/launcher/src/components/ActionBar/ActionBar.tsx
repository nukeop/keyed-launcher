import { PerformanceDashboard } from '../PerformanceDashboard';
import { KeyCombo } from './KeyCombo';
import { useActionContext } from '@keyed-launcher/plugin-sdk';
import { FC, ReactNode } from 'react';

export type ActionBarProps = {
  icon?: string | ReactNode;
  children?: ReactNode;
};

export const ActionBar: FC<ActionBarProps> = ({ icon, children }) => {
  const { currentActions } = useActionContext();

  return (
    <div
      className="flex w-full items-center justify-between border-t border-white/20 bg-black/20 py-2 px-3 text-white"
      data-testid="action-bar"
    >
      <div>{icon}</div>
      {children}
      {currentActions && (
        <div className="flex items-center gap-2">{currentActions}</div>
      )}
      <KeyCombo
        combo={{
          modifiers: ['cmd'],
          key: 'k',
        }}
      />
      <KeyCombo
        combo={{ modifiers: ['alt', 'ctrl', 'shift'], key: 'arrowUp' }}
      />
      <PerformanceDashboard />
    </div>
  );
};
