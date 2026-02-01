Perform a full repository code review:

1. Inspect structure and history with safe commands (ls, ls -R, git status, git diff as needed).
2. Iteratively open all important source, config, and test files across the repo (not just the current folder) until you have a complete understanding of the project.
3. Build a mental map of modules, responsibilities, and data flow.
4. Report:
  - Overall architecture and main components
  - Problems or code smells by file/path
  - performance, and maintainability concerns
  - Suggested refactors and missing tests/docs, with specific file paths.
Ask for confirmation before any destructive or state-changing command.
