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
