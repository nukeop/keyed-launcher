export namespace Keyboard {
  export type Key =
    | 'a'
    | 'b'
    | 'c'
    | 'd'
    | 'e'
    | 'f'
    | 'g'
    | 'h'
    | 'i'
    | 'j'
    | 'k'
    | 'l'
    | 'm'
    | 'n'
    | 'o'
    | 'p'
    | 'q'
    | 'r'
    | 's'
    | 't'
    | 'u'
    | 'v'
    | 'w'
    | 'x'
    | 'y'
    | 'z'
    | '0'
    | '1'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | 'return'
    | 'escape'
    | 'space'
    | 'tab'
    | 'backspace'
    | 'delete'
    | 'arrowUp'
    | 'arrowDown'
    | 'arrowLeft'
    | 'arrowRight'
    | 'f1'
    | 'f2'
    | 'f3'
    | 'f4'
    | 'f5'
    | 'f6'
    | 'f7'
    | 'f8'
    | 'f9'
    | 'f10'
    | 'f11'
    | 'f12';

  export type Modifier = 'cmd' | 'ctrl' | 'alt' | 'shift';

  export interface KeyCombination {
    key: Key;
    modifiers: Modifier[];
  }

  export type Shortcut =
    | KeyCombination
    | {
        linux?: KeyCombination;
        macOS?: KeyCombination;
        windows?: KeyCombination;
      };

  export namespace Shortcut {
    export enum Common {
      Copy = 'copy',
      Paste = 'paste',
      Cut = 'cut',
      SelectAll = 'selectAll',
      Undo = 'undo',
    }
  }
}
