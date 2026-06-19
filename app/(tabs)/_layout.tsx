import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../src/theme';

const TABS = [
  { name: 'index',    label: 'ホーム',   icon: '🏠', color: COLORS.primary  },
  { name: 'record',   label: '記録',     icon: '📊', color: COLORS.accent   },
  { name: 'shop',     label: 'ショップ', icon: '🛒', color: COLORS.orange   },
  { name: 'settings', label: '設定',     icon: '⚙️', color: COLORS.blueGrey },
] as const;

function TabBarItem({ tab, isFocused, onPress }: {
  tab: typeof TABS[number];
  isFocused: boolean;
  onPress: () => void;
}) {
  const pressScale = useSharedValue(1);
  const highlightProgress = useSharedValue(isFocused ? 1 : 0);
  const animatedPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));
  const animatedPillStyle = useAnimatedStyle(() => ({
    width: 52 + highlightProgress.value * 16,
  }));
  const animatedHighlightStyle = useAnimatedStyle(() => ({
    opacity: highlightProgress.value,
    transform: [{ scaleX: highlightProgress.value }],
  }));

  useEffect(() => {
    highlightProgress.value = isFocused
      ? withTiming(1, {
          duration: 180,
          easing: Easing.out(Easing.cubic),
        })
      : withTiming(0, {
          duration: 120,
          easing: Easing.in(Easing.cubic),
        });
  }, [isFocused]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        pressScale.value = withTiming(0.9, { duration: 90 });
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, {
          damping: 8,
          stiffness: 260,
          mass: 0.7,
        });
      }}
      style={styles.tabItem}
      android_ripple={null}
    >
      <Animated.View style={[styles.tabContent, animatedPressStyle]}>
        <Animated.View style={[styles.pill, animatedPillStyle]}>
          <Animated.View style={[styles.pillHighlight, animatedHighlightStyle]} />
          <Text style={styles.icon}>{tab.icon}</Text>
        </Animated.View>
        <Text style={[
          styles.label,
          { color: tab.color, fontWeight: isFocused ? '900' : 'bold' },
        ]}>
          {tab.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

function TabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'ios'
    ? insets.bottom + 10
    : Platform.OS === 'web'
      ? 12
      : 10;

  return (
    <View style={[styles.tabBarArea, { paddingBottom: bottomPadding }]}>
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const isFocused = state.routes[state.index]?.name === tab.name;

          return (
            <TabBarItem
              key={tab.name}
              tab={tab}
              isFocused={isFocused}
              onPress={() => navigation.navigate(tab.name)}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarArea: {
    backgroundColor: COLORS.offWhite,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(91, 74, 56, 0.18)',
    paddingTop: 10,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabContent: {
    alignItems: 'center',
    gap: 4,
  },
  pill: {
    width: 52,
    height: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pillHighlight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(91, 74, 56, 0.16)',
    borderRadius: 20,
  },
  icon: {
    fontSize: 22,
    zIndex: 1,
  },
  label: {
    fontSize: 10,
  },
});
