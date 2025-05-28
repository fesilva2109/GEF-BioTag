import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FolderSync as SyncIcon, CloudOff, Check, CircleArrowDown as ArrowDownCircle, Info, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Header } from '@/components/Header';
import { useData } from '@/hooks/useData';

export default function SyncScreen() {
  const { 
    connectionStatus, 
    patients, 
    syncData, 
    lastSyncTime,
    unsyncedPatientsCount
  } = useData();
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  
  const handleSync = async () => {
    if (!connectionStatus.online) return;
    
    setIsSyncing(true);
    setSyncComplete(false);
    
    try {
      await syncData();
      setSyncComplete(true);
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSyncTime = () => {
    if (!lastSyncTime) return 'Nunca';
    
    const date = new Date(lastSyncTime);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Sincronização" showBack={false} />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            {connectionStatus.online ? (
              <View style={[styles.statusIndicator, styles.onlineIndicator]} />
            ) : (
              <View style={[styles.statusIndicator, styles.offlineIndicator]} />
            )}
            <Text style={styles.statusText}>
              {connectionStatus.online ? 'Online' : 'Offline'}
            </Text>
          </View>
          
          <View style={styles.statusInfo}>
            <Text style={styles.lastSyncLabel}>Última sincronização:</Text>
            <Text style={styles.lastSyncValue}>{formatLastSyncTime()}</Text>
          </View>

          <View style={styles.pendingSyncContainer}>
            {unsyncedPatientsCount > 0 ? (
              <>
                <AlertTriangle size={20} color={Colors.warning} />
                <Text style={styles.pendingSyncText}>
                  {unsyncedPatientsCount} {unsyncedPatientsCount === 1 ? 'registro pendente' : 'registros pendentes'} de sincronização
                </Text>
              </>
            ) : (
              <>
                <Check size={20} color={Colors.success} />
                <Text style={styles.syncedText}>Todos os dados estão sincronizados</Text>
              </>
            )}
          </View>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.syncButton, 
            !connectionStatus.online && styles.disabledSyncButton
          ]}
          onPress={handleSync}
          disabled={!connectionStatus.online || isSyncing}
        >
          {isSyncing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              {connectionStatus.online ? (
                <SyncIcon size={24} color="#FFFFFF" />
              ) : (
                <CloudOff size={24} color="#FFFFFF" />
              )}
              <Text style={styles.syncButtonText}>
                {connectionStatus.online ? 'Sincronizar Agora' : 'Sem Conexão'}
              </Text>
            </>
          )}
        </TouchableOpacity>
        
        {syncComplete && (
          <View style={styles.syncCompleteContainer}>
            <Check size={20} color={Colors.success} />
            <Text style={styles.syncCompleteText}>
              Sincronização concluída com sucesso!
            </Text>
          </View>
        )}
        
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Info size={20} color={Colors.white} />
            <Text style={styles.infoTitle}>Sobre a Sincronização</Text>
          </View>
          
          <Text style={styles.infoText}>
            • O aplicativo funciona normalmente em modo offline
          </Text>
          <Text style={styles.infoText}>
            • Quando online, todos os dados são sincronizados automaticamente com o servidor central
          </Text>
          <Text style={styles.infoText}>
            • Registros feitos offline serão marcados para sincronização automática quando a conexão for restabelecida
          </Text>
          <Text style={styles.infoText}>
            • Use o botão acima para forçar uma sincronização manual quando necessário
          </Text>
        </View>
        
        <View style={styles.dataSection}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{patients.length}</Text>
              <Text style={styles.statLabel}>Pacientes Totais</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{unsyncedPatientsCount}</Text>
              <Text style={styles.statLabel}>Não Sincronizados</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{patients.length - unsyncedPatientsCount}</Text>
              <Text style={styles.statLabel}>Sincronizados</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkGray,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statusCard: {
    backgroundColor: Colors.gray[800],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  onlineIndicator: {
    backgroundColor: Colors.success,
  },
  offlineIndicator: {
    backgroundColor: Colors.danger,
  },
  statusText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  lastSyncLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[300],
    marginRight: 4,
  },
  lastSyncValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  pendingSyncContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingSyncText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.warning,
    marginLeft: 8,
  },
  syncedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.success,
    marginLeft: 8,
  },
  syncButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  disabledSyncButton: {
    backgroundColor: Colors.gray[600],
  },
  syncButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.white,
    marginLeft: 12,
  },
  syncCompleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  syncCompleteText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.success,
    marginLeft: 8,
  },
  infoSection: {
    backgroundColor: Colors.gray[800],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[200],
    marginBottom: 8,
    lineHeight: 20,
  },
  dataSection: {
    backgroundColor: Colors.gray[800],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.white,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[300],
  },
});