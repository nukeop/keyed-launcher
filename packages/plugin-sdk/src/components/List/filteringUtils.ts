import { List } from '.';
import { ItemProps } from './Item/Item';
import { ListChildren } from './List';
import { SectionProps } from './Section/Section';
import { Children, isValidElement, ReactNode } from 'react';

export function filterListChildren(
  children: ListChildren,
  searchQuery: string | null,
): ReactNode[] {
  if (!searchQuery) return Children.toArray(children);

  const query = searchQuery.toLowerCase();

  return Children.toArray(children)
    .filter(isValidElement)
    .filter((child) => {
      if (child.type === List.Item) {
        const props = child.props as ItemProps;
        return (
          props.title.toLowerCase().includes(query) ||
          props.subtitle?.toLowerCase().includes(query)
        );
      }

      return child.type === List.Section;
    })
    .map((child) => {
      if (child.type === List.Section) {
        const filteredChildren = filterListChildren(
          (child.props as SectionProps).children as ListChildren,
          searchQuery,
        );

        return (
          filteredChildren.length > 0 && {
            ...child,
            props: {
              ...(child.props as SectionProps),
              children: filteredChildren,
            },
          }
        );
      } else {
        return child;
      }
    })
    .filter(Boolean);
}
