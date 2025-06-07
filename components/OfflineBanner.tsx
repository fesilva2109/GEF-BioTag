import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import React from 'react';

export function OfflineBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>Modo Offline: Dados serão salvos localmente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.warning,
    padding: 8,
    alignItems: 'center',
  },
  text: {
    color: Colors.darkGray,
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
});