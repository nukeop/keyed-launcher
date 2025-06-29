import { FC } from 'react';

type AppContainerProps = {
  children: React.ReactNode;
};

export const AppContainer: FC<AppContainerProps> = ({ children }) => {
  return (
    <div className="w-full flex-col h-full px-2 rounded-lg relative flex border border-white/20 bg-black/60">
      {children}
    </div>
  );
};
