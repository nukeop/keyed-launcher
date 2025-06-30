import { FC, ReactNode } from 'react';

export type ActionBarProps = {
  icon?: string | ReactNode;
};

export const ActionBar: FC<ActionBarProps> = ({ icon }) => {
  return (
    <div className="flex w-full items-center justify-between border-t border-white/20 bg-black/20 p-2 text-white">
      <div>{icon}</div>
      <div className="text-xs">Test</div>
    </div>
  );
};
