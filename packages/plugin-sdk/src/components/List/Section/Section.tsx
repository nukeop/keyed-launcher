import { CommandIcon, IconRenderer } from '../../..';
import { Item } from '../Item/Item';
import { FC, ReactElement } from 'react';

export type SectionProps = {
  children?: ReactElement<typeof Item> | Array<ReactElement<typeof Item>>;
  title: string;
  icon?: CommandIcon;
  'data-testid'?: string;
};

interface SectionComponent extends FC<SectionProps> {}

const SectionBase: FC<SectionProps> = ({
  children,
  title,
  icon,
  'data-testid': testId,
}) => {
  return (
    <div>
      <div
        className="px-2 py-2 text-sm font-medium tracking-wide text-gray-400"
        data-testid={testId ?? 'plugin-list-section'}
      >
        <div className="flex items-center">
          {icon && (
            <div className="mr-2 flex h-4 w-4 items-center justify-center">
              <IconRenderer icon={icon} className="h-4 w-4" size={16} />
            </div>
          )}
          {title}
        </div>
      </div>
      {children}
    </div>
  );
};

export const Section = SectionBase as SectionComponent;
