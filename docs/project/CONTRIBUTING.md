# Contributing to Lux Story

Thank you for your interest in contributing to Lux Story! We welcome contributions that align with our mission of creating contemplative, anxiety-reducing career exploration experiences.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful, constructive, and patient in all interactions.

## How to Contribute

### Reporting Issues

1. Check existing issues to avoid duplicates
2. Use clear, descriptive titles
3. Include steps to reproduce bugs
4. Mention your browser and OS

### Suggesting Features

1. Check if it aligns with our contemplative philosophy
2. Explain the user benefit
3. Consider performance impact
4. Suggest implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run build && npm run type-check`)
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/lux-story.git
cd lux-story

# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run type-check

# Build for production
npm run build
```

## Code Style Guidelines

### TypeScript
- Use strict mode
- Define types for all parameters and returns
- Prefer interfaces over types for objects
- Use enums for fixed sets of values

### React
- Use functional components with hooks
- Wrap expensive calculations in `useMemo`
- Wrap callbacks in `useCallback` with proper deps
- Keep components under 200 lines

### CSS
- Use Tailwind utilities first
- Create semantic CSS variables for theming
- Follow BEM naming for custom classes
- Keep animations GPU-optimized

### Performance
- Lazy load large components
- Debounce localStorage writes
- Minimize re-renders
- Keep bundle size under 200KB

## Commit Message Format

```
type: subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Tests
- `chore`: Maintenance

Example:
```
feat: add calming animations for anxious players

Implemented breathing cycle animations that activate
when high anxiety is detected through rapid clicking

Closes #123
```

## Design Philosophy

When contributing, please keep in mind:

1. **No Gamification**: Avoid scores, achievements, or competitive elements
2. **Reduce Anxiety**: Features should calm, not pressure
3. **Natural Discovery**: Let patterns emerge, don't force them
4. **Invisible Metrics**: Track behavior without showing numbers
5. **Contemplative Pace**: Encourage reflection over speed

## Testing

### Manual Testing Scenarios

1. **Anxious Player Path**
   - Click choices quickly
   - Verify calming interventions appear
   - Check UI spacing increases

2. **Patient Explorer Path**
   - Wait 15+ seconds per choice
   - Verify exploration encouragement
   - Check pattern revelations

3. **Save/Load Flow**
   - Make progress
   - Refresh browser
   - Verify state persists

### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Documentation

- Update README.md for user-facing changes
- Update ARCHITECTURE.md for technical changes
- Add JSDoc comments for new functions
- Include inline comments for complex logic

## Questions?

Feel free to:
- Open an issue for discussion
- Join our community chat (coming soon)
- Email the maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make career exploration more contemplative and accessible! 🦥