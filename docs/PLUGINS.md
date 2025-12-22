# TSiJUKEBOX Plugin System

## Overview

TSiJUKEBOX supports a modular plugin architecture for extending functionality.

## Available Plugins

### Core Plugins
- **Lyrics Search**: Genius API integration for lyrics
- **GitHub Sync**: Automatic repository synchronization
- **Health Monitor**: System health and performance tracking

### Community Plugins
- Spicetify themes and customizations
- Custom visualizations
- Audio effects

## Creating Plugins

Plugins follow the standard hook pattern:

```typescript
export function useMyPlugin() {
  // Plugin logic
  return { ... };
}
```

## Installation

Plugins are automatically loaded from the `src/hooks` directory.
