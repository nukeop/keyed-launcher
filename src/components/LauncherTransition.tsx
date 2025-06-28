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
      className={`w-full h-full flex justify-center items-center transition-all duration-200 ease-out ${
        isVisible
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-2'
      }`}
    >
      {children}
    </div>
  );
}
