import { useActionContext } from '../../providers';
import { resolveShortcut } from '../../utils/keyboardUtils';
import { ActionProps } from '../Action/Action';
import { KeyCombo } from '../KeyCombo';
import { FC, isValidElement, ReactNode, useEffect, useState } from 'react';

export type ActionPanelProps = {
  children: ReactNode;
  title: string;
};

export const ActionPanel: FC<ActionPanelProps> = ({ children, title }) => {
  const { isActionPanelOpen } = useActionContext();
  const [firstChildProps, setFirstChildProps] = useState<ActionProps | null>(
    null,
  );

  useEffect(() => {
    if (Array.isArray(children) && isValidElement(children[0])) {
      setFirstChildProps(children[0].props as ActionProps);
    }

    if (isValidElement(children)) {
      setFirstChildProps(children.props as ActionProps);
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
      {isActionPanelOpen && (
        <div className="absolute right-2 flex bottom-12 rounded border border-white/20 px-4 py-2 bg-zinc-600 shadow-lg flex-col min-w-64">
          <label className="text-white/60 text-xs mt-2 mb-1 font-bold">
            {title}
          </label>
          {children}
        </div>
      )}
    </>
  );
};
