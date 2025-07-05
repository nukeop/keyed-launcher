import { PluginManifest } from './types';

interface UnvalidatedPermissions {
  filesystem?: unknown;
  network?: unknown;
  shell?: unknown;
  system?: unknown;
}

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

export function validatePermissions(
  permissions: UnvalidatedPermissions,
): string[] {
  const errors: string[] = [];

  const validFilesystemValues = ['read', 'write', 'none'];
  const validNetworkValues = ['local', 'internet', 'none'];
  const validShellValues = ['restricted', 'full', 'none'];
  const validSystemValues = ['read', 'write', 'none'];

  if (
    permissions.filesystem &&
    typeof permissions.filesystem === 'string' &&
    !validFilesystemValues.includes(permissions.filesystem)
  ) {
    errors.push(`Invalid filesystem permission: ${permissions.filesystem}`);
  }

  if (
    permissions.network &&
    typeof permissions.network === 'string' &&
    !validNetworkValues.includes(permissions.network)
  ) {
    errors.push(`Invalid network permission: ${permissions.network}`);
  }

  if (
    permissions.shell &&
    typeof permissions.shell === 'string' &&
    !validShellValues.includes(permissions.shell)
  ) {
    errors.push(`Invalid shell permission: ${permissions.shell}`);
  }

  if (
    permissions.system &&
    typeof permissions.system === 'string' &&
    !validSystemValues.includes(permissions.system)
  ) {
    errors.push(`Invalid system permission: ${permissions.system}`);
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
