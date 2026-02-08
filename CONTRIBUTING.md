# Contributing to Grand Central Terminus

Thank you for your interest in contributing to Grand Central Terminus! This document provides guidelines for contributing to our Birmingham youth career exploration game.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- Be respectful and constructive in all interactions
- Focus on what is best for the Birmingham youth community
- Show empathy towards other contributors
- Respect different viewpoints and experiences

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/30_lux-story.git
   cd 30_lux-story
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/add-haptic-feedback`
- `fix/mobile-safe-area-support`
- `docs/update-api-documentation`

### Commit Messages

Follow conventional commit format:
```
type(scope): description

feat(hooks): add haptic feedback for mobile interactions
fix(ui): resolve safe area issues on iPhone X+
docs(api): document useEmotionalRegulation hook
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Development Process

1. Create a feature branch from `main`
2. Make your changes
3. Write tests for new functionality
4. Ensure all tests pass: `npm run test`
5. Run linting: `npm run lint`
6. Build successfully: `npm run build`
7. Create a pull request

## Code Standards

### TypeScript

- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use proper type annotations
- Avoid `any` types when possible

### React

- Use functional components with hooks
- Implement proper error boundaries
- Use `useCallback` and `useMemo` for performance
- Follow Apple design principles

### CSS

- Use the Apple Design System (`styles/apple-design-system.css`)
- Follow mobile-first responsive design
- Use CSS custom properties for theming
- Ensure accessibility compliance

### File Organization

```
components/          # React components
hooks/              # Custom React hooks
lib/                # Utility functions and systems
styles/             # CSS and styling
public/             # Static assets
docs/               # Documentation
```

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Writing Tests

- Test user interactions and behavior
- Mock external dependencies
- Test error scenarios
- Ensure accessibility compliance

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  })
  
  it('should handle user interactions', () => {
    // Test implementation
  })
})
```

## Pull Request Process

### Before Submitting

1. Ensure your branch is up to date with `main`
2. Run all tests and ensure they pass
3. Run linting and fix any issues
4. Build the project successfully
5. Test on mobile devices if applicable

### PR Description

Include:
- Description of changes
- Screenshots for UI changes
- Testing instructions
- Any breaking changes
- Related issues

For changes that affect flags/experiments/telemetry, also include:
- `ADR` (see `docs/03_PROCESS/ADR_TEMPLATE.md`)
- `DoD` checklist (see `docs/03_PROCESS/PR_DEFINITION_OF_DONE.md`)

### Review Process

- All PRs require at least one review
- Address feedback promptly
- Keep PRs focused and small when possible
- Update documentation as needed

## Issue Reporting

### Bug Reports

Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser/device information
- Screenshots if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use case and benefits
- Mockups or examples if applicable
- Consideration of Birmingham youth needs

## Project-Specific Guidelines

### Birmingham Youth Focus

- Always consider the target audience (Birmingham youth, ages 11-22)
- Ensure content is culturally relevant and accessible
- Test on mobile devices (primary platform)
- Consider career development impact

### Apple Design Principles

- Follow Apple Human Interface Guidelines
- Maintain simplicity and clarity
- Ensure accessibility compliance
- Use appropriate haptic feedback

### Performance

- Optimize for mobile performance
- Minimize bundle size
- Use code splitting appropriately
- Test on slower devices

## Getting Help

- Check existing issues and discussions
- Join our Discord community (link in README)
- Contact maintainers for urgent issues
- Review documentation in `/docs` folder

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Grand Central Terminus and helping Birmingham youth explore their career paths!
