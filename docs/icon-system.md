# Icon System Documentation

The launcher supports a flexible icon system with three icon types:

## 1. Emoji Icons 🎉

The simplest way to add icons to your commands. Just use any emoji!

```json
{
  "icon": {
    "type": "emoji",
    "emoji": "🚀"
  }
}
```

## 2. Named Icons ⚡

Use any icon from the [Lucide icon library](https://lucide.dev/icons) (1000+ professionally designed icons).

### Basic Named Icon

```json
{
  "icon": {
    "type": "named",
    "name": "Settings"
  }
}
```

### Named Icon with Gradient

Add gradients using Tailwind color names:

```json
{
  "icon": {
    "type": "named",
    "name": "Zap",
    "gradient": {
      "from": "blue-500",
      "to": "purple-600"
    }
  }
}
```

## 3. Base64 Icons 📷

For dynamic icons (like app icons), use base64-encoded images:

```json
{
  "icon": {
    "type": "base64",
    "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  }
}
```

## Usage Examples

Check out the example manifest at `packages/launcher/src/plugins/examples/icon-demo-manifest.json` for complete examples of all icon types.