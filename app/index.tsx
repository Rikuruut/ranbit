import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../src/theme';

export default function StartScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Ranbit</Text>
      <Pressable style={styles.button} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.buttonText}>はじめる</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite, alignItems: 'center', justifyContent: 'center', gap: 40 },
  logo: { fontSize: 72, fontWeight: '900', color: COLORS.primary },
  button: { backgroundColor: COLORS.accent, paddingHorizontal: 48, paddingVertical: 16, borderRadius: 32 },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: COLORS.offWhite },
});