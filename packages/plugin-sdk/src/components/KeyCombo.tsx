import { Keyboard } from '../types/keyboard';
import { Key } from './Key';
import { FC } from 'react';

type KeyComboProps = {
  combo: Keyboard.KeyCombination;
};

export const KeyCombo: FC<KeyComboProps> = ({ combo }) => {
  return (
    <span className="flex flex-row gap-1">
      {combo.modifiers.map((modifier) => (
        <Key key={modifier} content={modifier} />
      ))}
      <Key content={combo.key} />
    </span>
  );
};
