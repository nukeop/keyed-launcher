import { describe, it, expect } from 'vitest';
import { validatePluginManifest, createDefaultManifest } from '../manifest';
import { PluginManifest } from '../types';

describe('manifest validation', () => {
  const validManifest: PluginManifest = {
    id: 'com.test.valid-plugin',
    name: 'Test Plugin',
    version: '1.0.0',
    apiVersion: '1.0.0',
    description: 'A test plugin',
    author: 'Test Author',
    permissions: {
      filesystem: 'read',
      network: 'local',
      shell: 'restricted',
      system: 'read',
    },
    commands: [
      {
        name: 'test-command',
        title: 'Test Command',
        description: 'A test command',
        mode: 'no-view',
        handler: 'commands/test.js',
      },
    ],
  };

  describe('validatePluginManifest', () => {
    it('should validate a correct manifest', () => {
      expect(() => validatePluginManifest(validManifest, 'test')).not.toThrow();
    });

    it('should reject null or undefined data', () => {
      expect(() => validatePluginManifest(null, 'test')).toThrow(
        'Invalid manifest format',
      );
      expect(() => validatePluginManifest(undefined, 'test')).toThrow(
        'Invalid manifest format',
      );
    });

    it('should reject non-object data', () => {
      expect(() => validatePluginManifest('string', 'test')).toThrow(
        'Invalid manifest format',
      );
      expect(() => validatePluginManifest(123, 'test')).toThrow(
        'Invalid manifest format',
      );
    });

    describe('id validation', () => {
      it('should reject missing id', () => {
        const manifest: Partial<PluginManifest> = { ...validManifest };
        delete manifest.id;
        expect(() => validatePluginManifest(manifest, 'test')).toThrow(
          'Missing or invalid "id" field',
        );
      });

      it('should reject invalid id format', () => {
        const manifest = { ...validManifest, id: 'invalid-id' };
        expect(() => validatePluginManifest(manifest, 'test')).toThrow(
          'Invalid plugin ID format',
        );
      });

      it('should accept valid id formats', () => {
        const validIds = [
          'com.author.plugin',
          'io.github.user.my-plugin',
          'org.company.product.feature',
        ];

        validIds.forEach((id) => {
          const manifest = { ...validManifest, id };
          expect(() => validatePluginManifest(manifest, 'test')).not.toThrow();
        });
      });
    });

    describe('version validation', () => {
      it('should reject missing version', () => {
        const manifest: Partial<PluginManifest> = { ...validManifest };
        delete manifest.version;
        expect(() => validatePluginManifest(manifest, 'test')).toThrow(
          'Missing or invalid "version" field',
        );
      });

      it('should reject invalid version formats', () => {
        const invalidVersions = ['1.0', '1', 'v1.0.0', '1.0.0.0'];

        invalidVersions.forEach((version) => {
          const manifest = { ...validManifest, version };
          expect(() => validatePluginManifest(manifest, 'test')).toThrow(
            'Invalid version format',
          );
        });
      });

      it('should accept valid semantic versions', () => {
        const validVersions = ['1.0.0', '2.1.3', '1.0.0-alpha', '1.0.0-beta.1'];

        validVersions.forEach((version) => {
          const manifest = { ...validManifest, version };
          expect(() => validatePluginManifest(manifest, 'test')).not.toThrow();
        });
      });
    });

    describe('apiVersion validation', () => {
      it('should reject missing apiVersion', () => {
        const manifest: Partial<PluginManifest> = { ...validManifest };
        delete manifest.apiVersion;
        expect(() => validatePluginManifest(manifest, 'test')).toThrow(
          'Missing or invalid "apiVersion" field',
        );
      });

      it('should reject incompatible API versions', () => {
        const manifest = { ...validManifest, apiVersion: '2.0.0' };
        expect(() => validatePluginManifest(manifest, 'test')).toThrow(
          'Incompatible API version',
        );
      });

      it('should accept compatible API version', () => {
        const manifest = { ...validManifest, apiVersion: '1.0.0' };
        expect(() => validatePluginManifest(manifest, 'test')).not.toThrow();
      });
    });

    describe('permissions validation', () => {
      it('should reject missing permissions', () => {
        const manifest: Partial<PluginManifest> = { ...validManifest };
        delete manifest.permissions;
        expect(() => validatePluginManifest(manifest, 'test')).toThrow(
          'Missing or invalid "permissions" field',
        );
      });

      it('should reject invalid filesystem permissions', () => {
        const manifest = {
          ...validManifest,
          permissions: { filesystem: 'invalid' },
        };
        expect(() => validatePluginManifest(manifest, 'test')).toThrow(
          'Invalid filesystem permission',
        );
      });

      it('should reject invalid network permissions', () => {
        const manifest = {
          ...validManifest,
          permissions: { network: 'invalid' },
        };
        expect(() => validatePluginManifest(manifest, 'test')).toThrow(
          'Invalid network permission',
        );
      });

      it('should reject invalid shell permissions', () => {
        const manifest = {
          ...validManifest,
          permissions: { shell: 'invalid' },
        };
        expect(() => validatePluginManifest(manifest, 'test')).toThrow(
          'Invalid shell permission',
        );
      });

      it('should reject invalid system permissions', () => {
        const manifest = {
          ...validManifest,
          permissions: { system: 'invalid' },
        };
        expect(() => validatePluginManifest(manifest, 'test')).toThrow(
          'Invalid system permission',
        );
      });
    });

    describe('commands validation', () => {
      it('should reject missing commands', () => {
        const manifest: Partial<PluginManifest> = { ...validManifest };
        delete manifest.commands;
        expect(() => validatePluginManifest(manifest, 'test')).toThrow(
          'Missing or invalid "commands" field',
        );
      });

      it('should reject non-array commands', () => {
        const manifest = {
          ...validManifest,
          commands: 'invalid' as unknown as typeof validManifest.commands,
        };
        expect(() => validatePluginManifest(manifest, 'test')).toThrow(
          'Missing or invalid "commands" field',
        );
      });

      it('should reject invalid command names', () => {
        const manifest = {
          ...validManifest,
          commands: [{ ...validManifest.commands[0], name: 'invalid name!' }],
        };
        expect(() => validatePluginManifest(manifest, 'test')).toThrow(
          'invalid name format',
        );
      });

      it('should reject missing command fields', () => {
        const requiredFields = [
          'name',
          'title',
          'description',
          'mode',
          'handler',
        ];

        requiredFields.forEach((field) => {
          const command = { ...validManifest.commands[0] };
          delete command[field as keyof typeof command];
          const manifest = { ...validManifest, commands: [command] };
          expect(() => validatePluginManifest(manifest, 'test')).toThrow(
            `missing or invalid "${field}" field`,
          );
        });
      });

      it('should reject invalid command modes', () => {
        const manifest = {
          ...validManifest,
          commands: [
            { ...validManifest.commands[0], mode: 'invalid' as 'view' },
          ],
        };
        expect(() => validatePluginManifest(manifest, 'test')).toThrow(
          'missing or invalid "mode" field',
        );
      });
    });
  });

  describe('createDefaultManifest', () => {
    it('should create a valid default manifest', () => {
      const manifest = createDefaultManifest('com.test.plugin');
      expect(() => validatePluginManifest(manifest, 'test')).not.toThrow();
    });

    it('should use the provided plugin ID', () => {
      const pluginId = 'com.example.my-plugin';
      const manifest = createDefaultManifest(pluginId);
      expect(manifest.id).toBe(pluginId);
    });

    it('should have safe default permissions', () => {
      const manifest = createDefaultManifest('com.test.plugin');
      expect(manifest.permissions.filesystem).toBe('none');
      expect(manifest.permissions.network).toBe('none');
      expect(manifest.permissions.shell).toBe('none');
      expect(manifest.permissions.system).toBe('none');
    });

    it('should have empty commands array', () => {
      const manifest = createDefaultManifest('com.test.plugin');
      expect(manifest.commands).toEqual([]);
    });
  });
});
