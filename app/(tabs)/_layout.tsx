import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { COLORS } from '../../src/theme';

const TABS = [
  { name: 'index',    label: 'ホーム',   icon: '🏠', color: COLORS.primary  },
  { name: 'record',   label: '記録',     icon: '📊', color: COLORS.accent   },
  { name: 'shop',     label: 'ショップ', icon: '🛒', color: COLORS.orange   },
  { name: 'settings', label: '設定',     icon: '⚙️', color: COLORS.blueGrey },
] as const;

function TabBar({ state, navigation }: any) {
  return (
    <View style={styles.bar}>
      {TABS.map((tab, index) => {
        const isFocused = state.index === index;

        const pillStyle = useAnimatedStyle(() => ({
          backgroundColor: withSpring(
            isFocused ? tab.color + '26' : 'transparent',
            { damping: 20, stiffness: 200 }
          ),
          paddingHorizontal: withSpring(isFocused ? 20 : 12, { damping: 20, stiffness: 200 }),
        }));

        return (
          <Pressable
            key={tab.name}
            onPress={() => navigation.navigate(tab.name)}
            style={styles.tabItem}
            android_ripple={null}
          >
            <Animated.View style={[styles.pill, pillStyle]}>
              <Text style={{ fontSize: 22 }}>{tab.icon}</Text>
            </Animated.View>
            <Text style={[
              styles.label,
              { color: tab.color, fontWeight: isFocused ? '900' : 'bold' },
            ]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
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
  bar: {
    flexDirection: 'row',
    backgroundColor: COLORS.offWhite,
    paddingVertical: 8,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  pill: {
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
  },
});