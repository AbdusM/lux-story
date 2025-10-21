# Troubleshooting Guide - Grand Central Terminus

This guide helps resolve common issues when developing or using Grand Central Terminus.

## Table of Contents

- [Development Issues](#development-issues)
- [Build Issues](#build-issues)
- [Runtime Issues](#runtime-issues)
- [Mobile Issues](#mobile-issues)
- [Performance Issues](#performance-issues)
- [Browser Compatibility](#browser-compatibility)
- [Getting Help](#getting-help)

## Development Issues

### TypeScript Errors

**Problem:** TypeScript compilation errors

**Solutions:**
1. Check type definitions in `/lib` and `/hooks`
2. Ensure proper imports
3. Run `npm run type-check` to identify issues
4. Update type definitions if needed

```bash
# Check TypeScript errors
npm run type-check

# Fix common issues
npm run lint --fix
```

### Hook Dependencies

**Problem:** Hooks not updating or causing infinite loops

**Solutions:**
1. Check dependency arrays in `useEffect` and `useCallback`
2. Ensure proper memoization with `useMemo`
3. Use `useCallback` for functions passed as props

```typescript
// Correct usage
const handleClick = useCallback(() => {
  // Handle click
}, [dependency])

// Incorrect usage
const handleClick = () => {
  // Handle click - will recreate on every render
}
```

### State Management

**Problem:** State not updating or components not re-rendering

**Solutions:**
1. Check if state updates are properly triggered
2. Ensure state is immutable
3. Use proper state setters

```typescript
// Correct usage
setState(prevState => ({ ...prevState, newValue: value }))

// Incorrect usage
state.newValue = value // Mutating state directly
```

## Build Issues

### Build Failures

**Problem:** `npm run build` fails

**Solutions:**
1. Check for TypeScript errors
2. Ensure all imports are correct
3. Check for missing dependencies
4. Clear build cache

```bash
# Clear build cache
npm run clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

### Bundle Size Issues

**Problem:** Bundle size too large

**Solutions:**
1. Check for unused imports
2. Use dynamic imports for large components
3. Optimize images and assets
4. Use code splitting

```typescript
// Dynamic import example
const HeavyComponent = lazy(() => import('./HeavyComponent'))
```

### ESLint Errors

**Problem:** ESLint errors preventing build

**Solutions:**
1. Fix linting errors
2. Use `--fix` flag for auto-fixing
3. Disable specific rules if necessary

```bash
# Fix linting errors
npm run lint --fix

# Check specific files
npm run lint -- src/components/GameInterface.tsx
```

## Runtime Issues

### Game Not Loading

**Problem:** Game interface not appearing

**Solutions:**
1. Check browser console for errors
2. Ensure all required components are imported
3. Check for missing dependencies
4. Verify service worker registration

```javascript
// Check console for errors
console.error('Error details:', error)

// Check if components are loaded
console.log('GameInterface loaded:', typeof GameInterface)
```

### Messages Not Displaying

**Problem:** Story messages not showing

**Solutions:**
1. Check `useMessageManager` hook
2. Verify message data structure
3. Check for CSS display issues
4. Ensure proper state updates

```typescript
// Debug message manager
const { messages, addMessage } = useMessageManager()
console.log('Messages:', messages)
```

### Choices Not Working

**Problem:** Choice buttons not responding

**Solutions:**
1. Check event handlers
2. Verify choice data structure
3. Check for JavaScript errors
4. Ensure proper state management

```typescript
// Debug choice handling
const handleChoice = (choice) => {
  console.log('Choice selected:', choice)
  // Handle choice logic
}
```

## Mobile Issues

### Touch Events

**Problem:** Touch events not working properly

**Solutions:**
1. Check touch event handlers
2. Ensure proper touch targets (44px minimum)
3. Test on actual devices
4. Check for CSS touch-action properties

```css
/* Ensure proper touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;
}
```

### Safe Area Issues

**Problem:** Content hidden behind notches or home indicators

**Solutions:**
1. Use safe area CSS properties
2. Check viewport meta tag
3. Test on various devices
4. Use proper padding/margins

```css
/* Safe area support */
.container {
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(16px, env(safe-area-inset-right));
  padding-top: max(16px, env(safe-area-inset-top));
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}
```

### Haptic Feedback

**Problem:** Haptic feedback not working

**Solutions:**
1. Check device support
2. Ensure proper permissions
3. Test on actual devices
4. Check browser compatibility

```typescript
// Check haptic support
import { hapticFeedback } from '@/lib/haptic-feedback'

if (hapticFeedback.getSupported()) {
  hapticFeedback.light()
} else {
  console.log('Haptic feedback not supported')
}
```

## Performance Issues

### Slow Loading

**Problem:** Game loads slowly

**Solutions:**
1. Check bundle size
2. Use code splitting
3. Optimize images
4. Enable compression
5. Use CDN for assets

```bash
# Analyze bundle size
npm run build
# Check the output for bundle sizes
```

### Memory Leaks

**Problem:** Memory usage increases over time

**Solutions:**
1. Clean up event listeners
2. Remove unused state
3. Use proper cleanup in useEffect
4. Avoid memory leaks in closures

```typescript
// Proper cleanup
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  }
  
  window.addEventListener('resize', handleResize)
  
  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])
```

### Slow Rendering

**Problem:** UI updates slowly

**Solutions:**
1. Use React.memo for components
2. Optimize re-renders
3. Use useMemo for expensive calculations
4. Check for unnecessary re-renders

```typescript
// Optimize with React.memo
const OptimizedComponent = React.memo(({ data }) => {
  return <div>{data}</div>
})

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data)
}, [data])
```

## Browser Compatibility

### Safari Issues

**Problem:** Features not working in Safari

**Solutions:**
1. Check for Safari-specific CSS properties
2. Use vendor prefixes
3. Test on actual Safari
4. Check for JavaScript compatibility

```css
/* Safari-specific fixes */
-webkit-appearance: none;
-webkit-touch-callout: none;
-webkit-user-select: none;
```

### Chrome Issues

**Problem:** Features not working in Chrome

**Solutions:**
1. Check for Chrome-specific bugs
2. Update to latest version
3. Check for extension conflicts
4. Test in incognito mode

### Firefox Issues

**Problem:** Features not working in Firefox

**Solutions:**
1. Check for Firefox-specific CSS
2. Test in latest version
3. Check for JavaScript compatibility
4. Verify CSS Grid/Flexbox support

## Getting Help

### Debugging Steps

1. **Check browser console** for errors
2. **Test in different browsers** to isolate issues
3. **Check network tab** for failed requests
4. **Use React DevTools** for component debugging
5. **Check mobile device logs** for mobile issues

### Common Debug Commands

```bash
# Check for TypeScript errors
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test

# Build and check for errors
npm run build

# Start development server
npm run dev
```

### Reporting Issues

When reporting issues, include:

1. **Browser and version**
2. **Device information** (for mobile issues)
3. **Steps to reproduce**
4. **Expected vs actual behavior**
5. **Console errors** (if any)
6. **Screenshots** (if applicable)

### Getting Support

- Check existing issues on GitHub
- Join our Discord community
- Contact the development team
- Review documentation in `/docs`

### Useful Resources

- [React Documentation](https://reactjs.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Web Share API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)

## Prevention

### Best Practices

1. **Test early and often** on various devices
2. **Use TypeScript** to catch errors early
3. **Follow coding standards** and conventions
4. **Write tests** for new functionality
5. **Document changes** and new features
6. **Review code** before merging
7. **Monitor performance** regularly

### Code Quality

1. **Use ESLint** to catch common issues
2. **Run tests** before committing
3. **Check bundle size** regularly
4. **Optimize images** and assets
5. **Use proper error handling**
6. **Follow accessibility guidelines**
7. **Test on real devices**

Remember: Most issues can be resolved by checking the browser console, testing on different devices, and following the debugging steps outlined above.
