import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useData } from '@/hooks/useData';
import React from 'react';

export function ConnectionStatusBar() {
  const { connectionStatus } = useData();
  
  if (connectionStatus.online) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <WifiOff size={16} color={Colors.white} />
      <Text style={styles.text}>Modo offline - Os dados serão sincronizados quando houver conexão</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.danger,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.white,
    marginLeft: 8,
  },
});