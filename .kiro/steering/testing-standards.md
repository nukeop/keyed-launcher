---
inclusion: fileMatch
fileMatchPattern: "*.test.{ts,tsx}"
---

- We use vite and vitest.
- Write integration tests as much as possible. Unit tests are to be used only in very specific cases, where there's complex, isolated logic.
- Mock as little as possible. Ensure you don't mock anything that's not an external dependency.
  - Examples of things you *should* mock: external API requests, HTTP requests, filesystem operations, shell commands.
   - Examples of things you *shouldn't* mock: internal logic, zustand stores, components, context providers, utility functions.