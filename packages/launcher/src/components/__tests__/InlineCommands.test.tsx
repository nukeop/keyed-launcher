import { useCommandRegistry } from '../../stores/commands';
import { useLauncherStore } from '../../stores/launcher';
import { MockPluginBuilder } from '../../test/mockPluginBuilder';
import { mockPerformance } from '../../test/performanceHelpers';
import { clear, withPlugin } from '../../test/pluginHelpers';
import { CommandPalette } from '../CommandPalette';
import { ThemeProvider } from '@keyed-launcher/plugin-sdk';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

mockPerformance();

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('Inline Commands', () => {
  const renderCommandPalette = () => {
    return render(
      <MemoryRouter>
        <ThemeProvider>
          <CommandPalette />
        </ThemeProvider>
      </MemoryRouter>,
    );
  };

  const createInlinePlugin = () => {
    return new MockPluginBuilder()
      .withId('com.test.calculator')
      .withName('Calculator')
      .withCommand({
        name: 'calculate',
        displayName: 'Calculator',
        mode: 'inline',
        handler: 'commands/calculate',
      })
      .build();
  };

  const setupInlineCommand = (
    shouldActivatePattern: RegExp,
    resultElement: React.ReactElement,
  ) => {
    const commandRegistry = useCommandRegistry.getState();
    const registeredCommand = commandRegistry.getRegisteredCommand(
      'com.test.calculator.calculate',
    );

    if (
      registeredCommand &&
      registeredCommand.entry.execute.mode === 'inline'
    ) {
      registeredCommand.entry.execute.shouldActivate = async (
        input: string,
      ) => {
        return shouldActivatePattern.test(input);
      };

      registeredCommand.entry.execute.execute = async () => {
        return resultElement;
      };
    }
  };

  const setSearchQuery = (query: string) => {
    const launcherStore = useLauncherStore.getState();
    launcherStore.setSearchQuery(query);
  };

  beforeEach(() => {
    clear();
  });

  it('should render inline command when shouldActivate returns true', async () => {
    withPlugin(createInlinePlugin());
    setupInlineCommand(
      /^\d+[\+\-\*\/]\d+$/,
      <div data-testid="calculator-result">
        <span>4</span>
      </div>,
    );
    setSearchQuery('2+2');

    renderCommandPalette();

    await waitFor(() => {
      expect(screen.getByTestId('calculator-result')).toBeInTheDocument();
    });

    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('should not render inline command when shouldActivate returns false', async () => {
    withPlugin(createInlinePlugin());
    setupInlineCommand(/^\d+[\+\-\*\/]\d+$/, React.createElement('div'));
    setSearchQuery('not a calculation');

    renderCommandPalette();

    await waitFor(() => {
      expect(screen.queryByTestId('calculator-result')).not.toBeInTheDocument();
    });
  });
});
