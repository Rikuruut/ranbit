import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../src/theme';

export default function RecordScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 記録</Text>
      <Text style={styles.sub}>実装予定</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite, alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { fontSize: 32, fontWeight: '900', color: COLORS.accent },
  sub: { fontSize: 14, color: COLORS.blueGrey },
});