import { FC } from 'react';

type AppContainerProps = {
  children: React.ReactNode;
};

export const AppContainer: FC<AppContainerProps> = ({ children }) => {
  return (
    <div className="w-full flex-col h-full px-2 rounded-lg relative flex m-2 border border-white/20">
      {children}
    </div>
  );
};
