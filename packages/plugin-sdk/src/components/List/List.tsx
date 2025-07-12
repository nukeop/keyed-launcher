import { Item } from './Item/Item';
import { FC } from 'react';

export type ListProps = {};

interface ListComponent extends FC<ListProps> {
  Item: typeof Item;
}

const ListBase: FC<ListProps> = ({}) => <div data-testid="plugin-list"></div>;

export const List = ListBase as ListComponent;
List.Item = Item;
