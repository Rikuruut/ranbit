import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../src/theme';

export default function GoalSettingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 目標設定</Text>
      <Text style={styles.sub}>実装予定</Text>
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>とじる</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite, alignItems: 'center', justifyContent: 'center', gap: 16 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.primary },
  sub: { fontSize: 14, color: COLORS.blueGrey },
  button: { backgroundColor: COLORS.accent, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24 },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: COLORS.offWhite },
});