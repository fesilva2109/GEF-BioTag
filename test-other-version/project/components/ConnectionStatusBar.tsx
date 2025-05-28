import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react-native';
import { useConnectivity } from '@/hooks/useConnectivity';
import { useVictims } from '@/hooks/useVictims';

export default function ConnectionStatusBar() {
  const { isConnected, checkConnection } = useConnectivity();
  const { victims, syncWithServer, isLoading } = useVictims();
  
  const pendingSyncCount = victims.filter(v => v.needsSync).length;
  
  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        {isConnected ? (
          <Wifi size={14} color="#4CAF50" style={styles.icon} />
        ) : (
          <WifiOff size={14} color="#FDD835" style={styles.icon} />
        )}
        <Text style={[
          styles.statusText, 
          { color: isConnected ? '#4CAF50' : '#FDD835' }
        ]}>
          {isConnected ? 'Online' : 'Offline'}
        </Text>
      </View>
      
      {isConnected && pendingSyncCount > 0 && (
        <TouchableOpacity 
          style={styles.syncButton}
          onPress={syncWithServer}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw size={14} color="#FFFFFF" style={styles.rotatingIcon} />
          ) : (
            <RefreshCw size={14} color="#FFFFFF" />
          )}
          <Text style={styles.syncText}>
            Sincronizar {pendingSyncCount} {pendingSyncCount === 1 ? 'item' : 'itens'}
          </Text>
        </TouchableOpacity>
      )}
      
      {!isConnected && (
        <TouchableOpacity 
          style={styles.checkButton}
          onPress={checkConnection}
        >
          <RefreshCw size={14} color="#FFFFFF" />
          <Text style={styles.checkText}>Verificar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  syncText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555555',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  checkText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  rotatingIcon: {
    // Animation would be implemented with Animated
  },
});