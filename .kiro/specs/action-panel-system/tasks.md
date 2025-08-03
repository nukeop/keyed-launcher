# Implementation Plan

- [-] 1. Create keyboard system types and utilities
  - Define Keyboard namespace with Key, Modifier, KeyCombination, and Shortcut types
  - Implement Keyboard.Shortcut.Common enum with predefined shortcuts
  - Create platform detection utility for resolving platform-specific shortcuts (use the Tauri `os-info` plugin)
  - _Requirements: 3.4, 6.1, 6.2, 6.3, 6.4_

- [ ] 2. Implement ActionContext for managing actions and shortcuts
  - Create ActionContext with state for current item actions and action panel visibility
  - Implement action registration/unregistration for selected list items
  - Add keyboard shortcut mapping and event listener management
  - Create shortcut-to-action execution system
  - _Requirements: 1.1, 1.4, 3.1, 3.2, 3.3_

- [ ] 3. Create base Action component
  - Implement Action component with title, onAction, autoFocus, icon, shortcut, and style props
  - Add action registration with ActionContext on mount
  - Implement shortcut cleanup on unmount
  - Add visual styling for different action styles (default, warning, danger, success, info)
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 4. Implement ActionPanel container component
  - Create ActionPanel component that accepts children and optional title
  - Provide ActionContext to child Action components
  - Handle action collection and registration with parent context
  - Add visual rendering of action panel with title and action list
  - _Requirements: 1.1, 2.3_

- [ ] 5. Create Action.CopyToClipboard built-in component
  - Implement CopyToClipboard with content, title, concealed, icon, onCopy, and shortcut props
  - Integrate with Tauri clipboard commands for copying content
  - Add HUD notification display after successful copy
  - Implement main window closing after copy operation
  - Handle concealed content for clipboard history
  - _Requirements: 4.1, 4.2_

- [ ] 6. Enhance List.Item component to support actions
  - Add actions prop to List.Item interface accepting ActionPanel element
  - Integrate with ActionContext to register item actions when selected
  - Update item selection logic to communicate with ActionContext
  - Ensure actions are unregistered when item is deselected or unmounted
  - _Requirements: 1.1, 1.2, 1.3, 7.1, 7.2_

- [ ] 7. Enhance ActionBar component for action display
  - Update ActionBar to display primary action title when available
  - Add ⌘K/Ctrl+K shortcut display for opening action panel
  - Integrate with ActionContext to get current item actions
  - Handle action panel toggle functionality
  - Update ActionBar styling to accommodate action information
  - _Requirements: 2.1, 2.2, 2.4_

- [ ] 8. Implement action panel UI and keyboard navigation
  - Create action panel overlay/modal component
  - Add keyboard navigation within action panel (arrow keys, enter)
  - Implement action panel opening/closing with ⌘K/Ctrl+K
  - Add visual feedback for focused actions in panel
  - Handle action execution from panel and panel closing
  - _Requirements: 2.2, 2.3, 3.1, 3.2, 3.3_

- [ ] 9. Add default keyboard shortcuts for primary and secondary actions
  - Implement ↵ (Enter) shortcut for primary action execution
  - Add ⌘↵/Ctrl+↵ shortcut for secondary action execution
  - Integrate default shortcuts with existing action shortcut system
  - Ensure default shortcuts work when no custom shortcuts are defined
  - _Requirements: 1.2, 3.1, 3.2_

- [ ] 10. Integrate ActionPanel system with plugin SDK exports
  - Export ActionPanel and Action components from plugin SDK
  - Export Keyboard namespace and types for plugin developers
  - Update plugin SDK index to include new action components
  - Add ActionPanel system to existing List component exports
  - _Requirements: 1.1, 5.1, 5.2, 5.3_

- [ ] 11. Create example plugin demonstrating ActionPanel usage
  - Build sample plugin showing ActionPanel with multiple actions
  - Demonstrate custom actions with keyboard shortcuts
  - Show Action.CopyToClipboard usage with different content types
  - Include examples of platform-specific shortcuts and action styles
  - _Requirements: 1.1, 4.1, 5.1, 6.1, 6.2, 6.3_