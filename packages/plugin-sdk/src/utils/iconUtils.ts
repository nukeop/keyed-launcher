import { Base64Icon, CommandIcon, EmojiIcon, NamedIcon } from '..';

export function isEmojiIcon(icon: CommandIcon): icon is EmojiIcon {
  return typeof icon === 'object' && icon.type === 'emoji';
}

export function isBase64Icon(icon: CommandIcon): icon is Base64Icon {
  return typeof icon === 'object' && icon.type === 'base64';
}

export function isNamedIcon(icon: CommandIcon): icon is NamedIcon {
  return typeof icon === 'object' && icon.type === 'named';
}
