import React from 'react';
import { CommandContext } from '../types';

export interface NoViewCommand {
  mode: 'no-view';
  execute: (context: CommandContext) => Promise<void>;
}

export interface ViewCommand {
  mode: 'view';
  execute: (context: CommandContext) => Promise<React.ReactElement>;
}

export namespace Action {
  export interface OpenInBrowser {
    type: 'open-in-browser';
    url: string;
  }

  export interface CopyToClipboard {
    type: 'copy-to-clipboard';
    text: string;
  }

  export interface Close {
    type: 'close';
  }
}

export type BasicAction =
  | Action.OpenInBrowser
  | Action.CopyToClipboard
  | Action.Close;
