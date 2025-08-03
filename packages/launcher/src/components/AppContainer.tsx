import { FC } from 'react';

type AppContainerProps = {
  children: React.ReactNode;
};

export const AppContainer: FC<AppContainerProps> = ({ children }) => {
  return (
    <div className="relative flex h-full w-full flex-col rounded-lg border border-white/20 bg-black/80">
      {children}
    </div>
  );
};
