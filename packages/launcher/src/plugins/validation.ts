import { PluginManifest } from '@keyed-launcher/plugin-sdk';

interface UnvalidatedCommand {
  name?: unknown;
  title?: unknown;
  description?: unknown;
  mode?: unknown;
  handler?: unknown;
}

export function validatePluginSchema(manifest: PluginManifest): string[] {
  const errors: string[] = [];

  if (!manifest.id) {
    errors.push('Plugin ID is required');
  }

  if (!manifest.name) {
    errors.push('Plugin name is required');
  }

  if (!manifest.version) {
    errors.push('Plugin version is required');
  }

  if (!manifest.apiVersion) {
    errors.push('API version is required');
  }

  return errors;
}

export function validateCommandSchema(command: UnvalidatedCommand): string[] {
  const errors: string[] = [];

  if (!command.name) {
    errors.push('Command name is required');
  }

  if (!command.title) {
    errors.push('Command title is required');
  }

  if (!command.description) {
    errors.push('Command description is required');
  }

  if (!command.mode || !['view', 'no-view'].includes(command.mode as string)) {
    errors.push('Command mode must be "view" or "no-view"');
  }

  if (!command.handler) {
    errors.push('Command handler is required');
  }

  return errors;
}

export function checkApiVersionCompatibility(apiVersion: string): boolean {
  const supportedVersions = ['1.0.0'];
  return supportedVersions.includes(apiVersion);
}
