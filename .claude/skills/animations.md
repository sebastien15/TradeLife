# Animations (Reanimated v3)

## Guidelines

- Use Reanimated v3 wherever motion makes sense: `useSharedValue`, `useAnimatedStyle`, `withTiming`, `withSpring`, `withRepeat`, `interpolateColor`.
- **Add animations to every component where they enhance UX** — press feedback, mount transitions, state changes, loading states.

## Standard Animation Patterns

| Interaction | Animation Pattern |
|-------------|-------------------|
| Button press | `withSpring(0.98)` scale |
| Toggle | `interpolateColor` track + `translateX` thumb |
| List item press | subtle scale or opacity fade |
| Screen/modal mount | slide-up or fade-in |
| Tab bar icon | spring bounce on active |
| Error shake | `withSequence` translateX |
| Success pulse | `withSequence` scale |
| Skeleton | `withRepeat(withTiming)` opacity pulse |
| Number counters | `useAnimatedProps` with custom Text |

## Code Examples

```tsx
// Press feedback
const scale = useSharedValue(1);
const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
// onPressIn: scale.value = withSpring(0.96)
// onPressOut: scale.value = withSpring(1)

// Fade/slide on mount
const opacity = useSharedValue(0);
const translateY = useSharedValue(20);
useEffect(() => {
  opacity.value = withTiming(1, { duration: 300 });
  translateY.value = withSpring(0, { damping: 18 });
}, []);

// Error shake
const shakeX = useSharedValue(0);
// shakeX.value = withSequence(withTiming(-8), withTiming(8), withTiming(-4), withTiming(0))

// Success pulse
const successScale = useSharedValue(0);
// successScale.value = withSpring(1, { damping: 8, stiffness: 200 })
```
