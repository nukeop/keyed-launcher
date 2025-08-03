import { Transition as HeadlessTransition } from '@headlessui/react';
import { ComponentProps, FC } from 'react';

type HeadlessTransitionProps = ComponentProps<typeof HeadlessTransition>;

export type TransitionProps = HeadlessTransitionProps & {
  className?: string;
};

export const Transition: FC<TransitionProps> = ({
  show,
  children,
  enter = 'transition-opacity duration-200',
  enterFrom = 'opacity-0 scale-95',
  enterTo = 'opacity-100 scale-100',
  leave = 'transition-opacity duration-150',
  leaveFrom = 'opacity-100',
  leaveTo = 'opacity-0 scale-95',
  as,
  className,
  ...rest
}) => (
  <HeadlessTransition
    {...rest}
    show={show}
    enter={enter}
    enterFrom={enterFrom}
    enterTo={enterTo}
    leave={leave}
    leaveFrom={leaveFrom}
    leaveTo={leaveTo}
    className={className}
    as={as}
  >
    {children}
  </HeadlessTransition>
);
