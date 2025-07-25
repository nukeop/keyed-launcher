import { Keyboard } from '../types/keyboard';
import { formatKeyOrModifier } from '../utils/keyboardUtils';

type KeyProps = {
  content: Keyboard.Modifier | Keyboard.Key;
};
export const Key = ({ content }: KeyProps) => {
  return (
    <kbd
      className="rounded bg-white/10 text-zinc-200 text-md  px-2 leading-6 [font-variant:small-caps]"
      data-testid="key"
    >
      {formatKeyOrModifier(content)}
    </kbd>
  );
};
