import { ReactNode } from 'react';

interface LauncherTransitionProps {
  isVisible: boolean;
  children: ReactNode;
}

export function LauncherTransition({
  isVisible,
  children,
}: LauncherTransitionProps) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center transition-all duration-200 ease-out ${
        isVisible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'translate-y-2 scale-95 opacity-0'
      }`}
    >
      {children}
    </div>
  );
}
