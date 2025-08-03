import { useActionContext } from '../../providers';
import { resolveShortcut } from '../../utils/keyboardUtils';
import { Action, ActionProps } from '../Action/Action';
import { KeyCombo } from '../KeyCombo';
import { Transition } from '../Transition';
import { FC, isValidElement, ReactElement, useEffect, useState } from 'react';

export type ActionPanelProps = {
  children: ReactElement<typeof Action> | Array<ReactElement<typeof Action>>;
  title: string;
};

export const ActionPanel: FC<ActionPanelProps> = ({ children, title }) => {
  const { isActionPanelOpen } = useActionContext();
  const [firstChildProps, setFirstChildProps] = useState<ActionProps | null>(
    null,
  );

  useEffect(() => {
    if (Array.isArray(children) && isValidElement(children)) {
      // This cast is required as Typescript sees this as FC<ActionProps> instead of just ActionProps
      setFirstChildProps(children[0].props as unknown as ActionProps);
    }

    if (isValidElement(children)) {
      setFirstChildProps(children.props as unknown as ActionProps);
    }
  }, [children]);

  return (
    <>
      {firstChildProps && (
        <span className="flex-row relative flex items-center gap-2">
          <label className="text-white/60 text-sm">
            {firstChildProps.title}
          </label>
          <KeyCombo combo={resolveShortcut(firstChildProps.shortcut)} />
        </span>
      )}
      <Transition
        show={isActionPanelOpen}
        className="absolute right-2 flex bottom-12 rounded border border-white/20 px-4 py-2 bg-zinc-600 shadow-lg flex-col min-w-64 origin-bottom-right"
        enter="transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
        enterFrom="opacity-0 scale-80 translate-y-4"
        enterTo="opacity-100 scale-100 translate-y-0"
        leave="transition-all duration-200 ease-in"
        leaveFrom="opacity-100 scale-100 translate-y-0"
        leaveTo="opacity-0 scale-80 translate-y-2"
        as="div"
      >
        <label className="text-white/60 text-xs mt-2 mb-1 font-bold">
          {title}
        </label>
        {children}
      </Transition>
    </>
  );
};
