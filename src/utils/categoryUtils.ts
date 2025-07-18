import { LauncherEntry } from '../components/ResultsList';

export interface CategoryGroup {
  category: string;
  icon?: string;
  entries: LauncherEntry[];
}

export function groupEntriesByCategory(
  entries: LauncherEntry[],
): CategoryGroup[] {
  const groups = new Map<string, LauncherEntry[]>();

  entries.forEach((entry) => {
    const category = entry.category || 'Other';
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push(entry);
  });

  return Array.from(groups.entries()).map(([category, entries]) => ({
    category,
    entries,
  }));
}
