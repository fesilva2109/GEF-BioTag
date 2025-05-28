import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { UserPlus, ClipboardList, Wifi, WifiOff, ArrowUpFromLine, RefreshCw, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useVictims } from '@/hooks/useVictims';
import { useConnectivity } from '@/hooks/useConnectivity';
import EmergencyCard from '@/components/EmergencyCard';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const router = useRouter();
  const { victims, syncWithServer, isLoading, lastSyncTime } = useVictims();
  const { isConnected } = useConnectivity();
  
  const pendingSyncCount = victims.filter(v => v.needsSync).length;
  const criticalCount = victims.filter(v => v.status === 'critical').length;
  
  const formatLastSyncTime = () => {
    if (!lastSyncTime) return 'Nunca';
    return new Date(lastSyncTime).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>GEF - BioTag</Text>
        <Text style={styles.subtitle}>Sistema de Monitoramento</Text>
        <View style={styles.connectionIndicator}>
          {isConnected ? (
            <Wifi size={18} color="#4CAF50" style={styles.connectionIcon} />
          ) : (
            <WifiOff size={18} color="#FDD835" style={styles.connectionIcon} />
          )}
          <Text style={[
            styles.connectionText,
            { color: isConnected ? '#4CAF50' : '#FDD835' }
          ]}>
            {isConnected ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{victims.length}</Text>
            <Text style={styles.statLabel}>Total Registrado</Text>
          </View>
          
          <View style={[styles.statCard, criticalCount > 0 ? styles.criticalCard : {}]}>
            <Text style={styles.statNumber}>{criticalCount}</Text>
            <Text style={styles.statLabel}>Casos Críticos</Text>
          </View>
          
          <View style={[styles.statCard, pendingSyncCount > 0 ? styles.pendingCard : {}]}>
            <Text style={styles.statNumber}>{pendingSyncCount}</Text>
            <Text style={styles.statLabel}>Aguardando Sincronização</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.mainActionButton}
            onPress={() => router.push('/register')}
          >
            <UserPlus size={24} color="#FFFFFF" />
            <Text style={styles.mainActionText}>Novo Registro</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryActionButton}
            onPress={() => router.push('/victims')}
          >
            <ClipboardList size={24} color="#FFFFFF" />
            <Text style={styles.secondaryActionText}>Lista de Registrados</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.syncContainer}>
          <View style={styles.syncInfoRow}>
            <Text style={styles.syncInfoText}>
              Última sincronização: {formatLastSyncTime()}
            </Text>
            {pendingSyncCount > 0 && (
              <Text style={styles.pendingSyncText}>
                {pendingSyncCount} registros pendentes
              </Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.syncButton, 
              !isConnected && styles.syncButtonDisabled
            ]}
            onPress={syncWithServer}
            disabled={!isConnected || isLoading}
          >
            {isLoading ? (
              <RefreshCw size={20} color="#FFFFFF" style={styles.rotatingIcon} />
            ) : (
              <ArrowUpFromLine size={20} color="#FFFFFF" />
            )}
            <Text style={styles.syncButtonText}>
              {isLoading ? 'Sincronizando...' : 'Sincronizar Agora'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emergencySection}>
          <Text style={styles.sectionTitle}>Alertas de Emergência</Text>
          
          <EmergencyCard 
            title="Alerta de Enchente" 
            location="Região Sul - RS"
            description="Áreas próximas ao rio Gravataí em alerta máximo. Equipes de resgate priorizem região."
            severity="high"
          />
          
          <EmergencyCard 
            title="Deslizamento de Terra" 
            location="Serra Gaúcha - Gramado"
            description="Possível deslizamento na área de encostas. Monitoramento intensificado necessário."
            severity="medium"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#303030',
  },
  header: {
    backgroundColor: '#424242',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#505050',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#CCCCCC',
    marginTop: 4,
  },
  connectionIndicator: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  connectionIcon: {
    marginRight: 4,
  },
  connectionText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#424242',
    borderRadius: 8,
    padding: 12,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  criticalCard: {
    backgroundColor: '#C62828',
  },
  pendingCard: {
    backgroundColor: '#F57F17',
  },
  statNumber: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
  },
  actionsContainer: {
    marginBottom: 20,
  },
  mainActionButton: {
    backgroundColor: '#E53935',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  mainActionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 12,
  },
  secondaryActionButton: {
    backgroundColor: '#424242',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 12,
  },
  syncContainer: {
    backgroundColor: '#424242',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  syncInfoRow: {
    marginBottom: 12,
  },
  syncInfoText: {
    color: '#CCCCCC',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  pendingSyncText: {
    color: '#FDD835',
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 4,
  },
  syncButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncButtonDisabled: {
    backgroundColor: '#757575',
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
  rotatingIcon: {
    // Animation would be added in component
  },
  emergencySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
});