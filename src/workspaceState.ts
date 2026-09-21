import type { Resource } from './model';

export function resourcesForWorkspace(resources: Resource[], workspace: string): Resource[] {
  return resources.filter((resource) => resource.workspace === workspace);
}

export function nextActiveResourceAfterClose(
  tabs: Resource[],
  closingId: string,
  activeId: string,
): Resource | null {
  if (tabs.length === 0) return null;

  const active = tabs.find((tab) => tab.id === activeId) ?? null;
  if (closingId !== activeId) return active;

  const closingIndex = tabs.findIndex((tab) => tab.id === closingId);
  if (closingIndex === -1) return active;

  return tabs[closingIndex + 1] ?? tabs[closingIndex - 1] ?? null;
}


export function preferredResourceForWorkspace(
  openTabs: Resource[],
  allResources: Resource[],
  workspace: string,
): Resource | null {
  return openTabs.find((resource) => resource.workspace === workspace)
    ?? allResources.find((resource) => resource.workspace === workspace)
    ?? null;
}


export function workspaceNames(resources: Resource[]): string[] {
  return [...new Set(resources.map((resource) => resource.workspace))];
}


function foldSearch(value: string): string {
  return value
    .toLocaleLowerCase('nb-NO')
    .replaceAll('æ', 'ae')
    .replaceAll('ø', 'o')
    .replaceAll('å', 'a')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function searchResources(resources: Resource[], query: string): Resource[] {
  const needle = foldSearch(query);
  if (!needle) return [];

  return resources
    .map((resource, index) => {
      const title = foldSearch(resource.title);
      const haystack = foldSearch([
        resource.title,
        resource.type,
        resource.workspace,
        resource.category ?? '',
        resource.level ?? '',
      ].join(' '));

      let score = 0;
      if (title === needle) score += 100;
      else if (title.startsWith(needle)) score += 60;
      else if (title.includes(needle)) score += 40;
      if (haystack.includes(needle)) score += 10;

      return { resource, score, index };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.resource);
}
