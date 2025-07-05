import {
  writeText as writeTextTauri,
  readText as readTextTauri,
} from '@tauri-apps/plugin-clipboard-manager';

export const readText = async () => await readTextTauri();
export const writeText = async (text: string) => await writeTextTauri(text);
