import { PluginManifest } from './types';

type UnknownRecord = Record<string, unknown>;

interface UnvalidatedManifest extends UnknownRecord {
  id?: unknown;
  name?: unknown;
  version?: unknown;
  apiVersion?: unknown;
  description?: unknown;
  author?: unknown;
  permissions?: unknown;
  commands?: unknown;
}

interface UnvalidatedCommand extends UnknownRecord {
  name?: unknown;
  title?: unknown;
  description?: unknown;
  mode?: unknown;
  handler?: unknown;
}

interface UnvalidatedPermissions extends UnknownRecord {
  filesystem?: unknown;
  network?: unknown;
  shell?: unknown;
  system?: unknown;
}

export async function loadPluginManifest(
  manifestPath: string,
): Promise<PluginManifest> {
  try {
    const response = await fetch(manifestPath);
    if (!response.ok) {
      throw new Error(
        `Failed to load manifest from ${manifestPath}: ${response.statusText}`,
      );
    }

    const manifestData = await response.json();
    return validatePluginManifest(manifestData, manifestPath);
  } catch (error) {
    throw new Error(
      `Error loading plugin manifest from ${manifestPath}: ${error}`,
    );
  }
}

export function validatePluginManifest(
  data: unknown,
  source: string,
): PluginManifest {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    throw new Error(
      `Invalid manifest format in ${source}: must be a JSON object`,
    );
  }

  const manifest = data as UnvalidatedManifest;

  if (!manifest.id || typeof manifest.id !== 'string') {
    errors.push('Missing or invalid "id" field');
  } else if (!isValidPluginId(manifest.id)) {
    errors.push(
      'Invalid plugin ID format (should be like "com.author.plugin-name")',
    );
  }

  if (!manifest.name || typeof manifest.name !== 'string') {
    errors.push('Missing or invalid "name" field');
  }

  if (!manifest.version || typeof manifest.version !== 'string') {
    errors.push('Missing or invalid "version" field');
  } else if (!isValidVersion(manifest.version)) {
    errors.push(
      'Invalid version format (should be semantic version like "1.0.0")',
    );
  }

  if (!manifest.apiVersion || typeof manifest.apiVersion !== 'string') {
    errors.push('Missing or invalid "apiVersion" field');
  } else if (!isCompatibleApiVersion(manifest.apiVersion)) {
    errors.push(
      `Incompatible API version "${manifest.apiVersion}" (supported: 1.0.0)`,
    );
  }

  if (!manifest.description || typeof manifest.description !== 'string') {
    errors.push('Missing or invalid "description" field');
  }

  if (!manifest.author || typeof manifest.author !== 'string') {
    errors.push('Missing or invalid "author" field');
  }

  if (!manifest.permissions || typeof manifest.permissions !== 'object') {
    errors.push('Missing or invalid "permissions" field');
  } else {
    const permissionErrors = validatePermissions(
      manifest.permissions as UnvalidatedPermissions,
    );
    errors.push(...permissionErrors);
  }

  if (!manifest.commands || !Array.isArray(manifest.commands)) {
    errors.push('Missing or invalid "commands" field (must be an array)');
  } else {
    manifest.commands.forEach((command: unknown, index: number) => {
      const commandErrors = validateCommand(
        command as UnvalidatedCommand,
        index,
      );
      errors.push(...commandErrors);
    });
  }

  if (errors.length > 0) {
    throw new Error(
      `Invalid plugin manifest in ${source}:\n${errors.map((e) => `  - ${e}`).join('\n')}`,
    );
  }

  return manifest as PluginManifest;
}

function isValidPluginId(id: string): boolean {
  return /^[a-z0-9]+(\.[a-z0-9\-]+)+$/.test(id);
}

function isValidVersion(version: string): boolean {
  return /^\d+\.\d+\.\d+(-[a-zA-Z0-9\-\.]+)?$/.test(version);
}

function isCompatibleApiVersion(apiVersion: string): boolean {
  return apiVersion === '1.0.0';
}

function validatePermissions(permissions: UnvalidatedPermissions): string[] {
  const errors: string[] = [];
  const validPermissionValues = ['read', 'write', 'none'];
  const validNetworkValues = ['local', 'internet', 'none'];
  const validShellValues = ['restricted', 'full', 'none'];

  if (
    permissions.filesystem &&
    typeof permissions.filesystem === 'string' &&
    !validPermissionValues.includes(permissions.filesystem)
  ) {
    errors.push(`Invalid filesystem permission: "${permissions.filesystem}"`);
  }

  if (
    permissions.network &&
    typeof permissions.network === 'string' &&
    !validNetworkValues.includes(permissions.network)
  ) {
    errors.push(`Invalid network permission: "${permissions.network}"`);
  }

  if (
    permissions.shell &&
    typeof permissions.shell === 'string' &&
    !validShellValues.includes(permissions.shell)
  ) {
    errors.push(`Invalid shell permission: "${permissions.shell}"`);
  }

  if (
    permissions.system &&
    typeof permissions.system === 'string' &&
    !validPermissionValues.includes(permissions.system)
  ) {
    errors.push(`Invalid system permission: "${permissions.system}"`);
  }

  return errors;
}

function validateCommand(command: UnvalidatedCommand, index: number): string[] {
  const errors: string[] = [];

  if (!command || typeof command !== 'object') {
    errors.push(`Command ${index}: must be an object`);
    return errors;
  }

  if (!command.name || typeof command.name !== 'string') {
    errors.push(`Command ${index}: missing or invalid "name" field`);
  } else if (!/^[a-zA-Z0-9\-_]+$/.test(command.name)) {
    errors.push(
      `Command ${index}: invalid name format (only alphanumeric, hyphens, and underscores allowed)`,
    );
  }

  if (!command.title || typeof command.title !== 'string') {
    errors.push(`Command ${index}: missing or invalid "title" field`);
  }

  if (!command.description || typeof command.description !== 'string') {
    errors.push(`Command ${index}: missing or invalid "description" field`);
  }

  if (
    !command.mode ||
    typeof command.mode !== 'string' ||
    !['view', 'no-view'].includes(command.mode)
  ) {
    errors.push(
      `Command ${index}: missing or invalid "mode" field (must be "view" or "no-view")`,
    );
  }

  if (!command.handler || typeof command.handler !== 'string') {
    errors.push(`Command ${index}: missing or invalid "handler" field`);
  }

  return errors;
}

export function createDefaultManifest(pluginId: string): PluginManifest {
  return {
    id: pluginId,
    name: 'New Plugin',
    version: '1.0.0',
    apiVersion: '1.0.0',
    description: 'A new plugin for Keyed Launcher',
    author: 'Plugin Author',
    permissions: {
      filesystem: 'none',
      network: 'none',
      shell: 'none',
      system: 'none',
    },
    commands: [],
  };
}
