import { describe, expect, it } from 'vitest';
import { resources } from './data';
import { nextActiveResourceAfterClose, resourcesForWorkspace } from './workspaceState';

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
});
