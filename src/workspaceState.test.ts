import { describe, expect, it } from 'vitest';
import { resources } from './data';
import { nextActiveResourceAfterClose, preferredResourceForWorkspace, resourcesForWorkspace, searchResources, workspaceNames } from './workspaceState';

describe('workspace state', () => {
  it('scopes library resources to the selected workspace', () => {
    const daily = resourcesForWorkspace(resources, 'Daily Norwegian');
    expect(daily.length).toBeGreaterThan(0);
    expect(daily.every((resource) => resource.workspace === 'Daily Norwegian')).toBe(true);
    expect(daily.some((resource) => resource.id === 'news-daily')).toBe(true);
  });

  it('keeps the current active resource when closing a background tab', () => {
    const tabs = [resources[0], resources[3], resources[9]];
    const next = nextActiveResourceAfterClose(tabs, resources[9].id, resources[3].id);
    expect(next?.id).toBe(resources[3].id);
  });

  it('prefers the tab to the right when closing the active tab', () => {
    const tabs = [resources[0], resources[3], resources[9]];
    const next = nextActiveResourceAfterClose(tabs, resources[3].id, resources[3].id);
    expect(next?.id).toBe(resources[9].id);
    expect(next?.workspace).toBe('Work Norwegian');
  });

  it('falls back to the tab on the left when closing the last active tab', () => {
    const tabs = [resources[0], resources[3], resources[9]];
    const next = nextActiveResourceAfterClose(tabs, resources[9].id, resources[9].id);
    expect(next?.id).toBe(resources[3].id);
    expect(next?.workspace).toBe('B2 Preparation');
  });

  it('prefers an already-open tab when switching workspaces', () => {
    const tabs = [resources[0], resources[4], resources[9]];
    const next = preferredResourceForWorkspace(tabs, resources, 'B2 Preparation');
    expect(next?.id).toBe(resources[4].id);
  });

  it('falls back to the first catalog resource when a workspace has no open tab', () => {
    const tabs = [resources[0], resources[1], resources[2]];
    const next = preferredResourceForWorkspace(tabs, resources, 'Her på berget');
    expect(next?.id).toBe('course-hpb-07');
  });

  it('derives the workspace switcher from catalog data without duplicates', () => {
    expect(workspaceNames(resources)).toEqual([
      'Daily Norwegian',
      'B2 Preparation',
      'Work Norwegian',
      'Her på berget',
    ]);
  });

  it('searches resources across title, type and workspace', () => {
    expect(searchResources(resources, 'grammar')[0]?.id).toBe('grammar-hub');
    expect(searchResources(resources, 'work norwegian')[0]?.id).toBe('phrases-work');
  });

  it('folds Norwegian accents for resource search', () => {
    expect(searchResources(resources, 'her pa berget')[0]?.id).toBe('course-hpb-07');
  });

  it('returns no launcher results for a blank query', () => {
    expect(searchResources(resources, '   ')).toEqual([]);
  });
});
