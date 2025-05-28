import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, ScrollView, TouchableOpacity, 
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, TriangleAlert as AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react-native';
import { useVictims } from '@/hooks/useVictims';

export default function MonitoringScreen() {
  const router = useRouter();
  const { victims, getVictims, isLoading } = useVictims();
  const [refreshing, setRefreshing] = useState(false);
  
  // Sort victims by heart rate to display most critical first
  const sortedVictims = [...victims]
    .filter(v => v.heartRate) // Only those with heart rate
    .sort((a, b) => {
      // First by status (critical first)
      if (a.status === 'critical' && b.status !== 'critical') return -1;
      if (a.status !== 'critical' && b.status === 'critical') return 1;
      
      // Then by abnormal heart rate
      const aAbnormal = isAbnormalHeartRate(a.heartRate);
      const bAbnormal = isAbnormalHeartRate(b.heartRate);
      
      if (aAbnormal && !bAbnormal) return -1;
      if (!aAbnormal && bAbnormal) return 1;
      
      // Finally by heart rate value (higher first for same status)
      return b.heartRate - a.heartRate;
    });
  
  const criticalCount = sortedVictims.filter(v => 
    v.status === 'critical' || isAbnormalHeartRate(v.heartRate)
  ).length;
  
  function isAbnormalHeartRate(rate) {
    return rate < 60 || rate > 100;
  }
  
  function getHeartRateStatus(rate) {
    if (rate < 60) return 'low';
    if (rate > 100) return 'high';
    return 'normal';
  }
  
  const onRefresh = async () => {
    setRefreshing(true);
    await getVictims();
    
    // Simulate updating heart rates for demo purposes
    // In a real app, this would come from the server or device
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  const handleViewVictim = (victimId) => {
    router.push(`/victim/${victimId}`);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'high': return '#E53935'; // Red for high
      case 'low': return '#FDD835'; // Yellow for low
      case 'normal': return '#4CAF50'; // Green for normal
      default: return '#CCCCCC';
    }
  };
  
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#E53935']}
          tintColor="#E53935"
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Monitoramento Vital</Text>
        <Text style={styles.subtitle}>
          {sortedVictims.length} vítimas com monitoramento ativo
        </Text>
      </View>
      
      {criticalCount > 0 ? (
        <View style={styles.alertBox}>
          <AlertTriangle size={24} color="#E53935" />
          <Text style={styles.alertText}>
            {criticalCount} {criticalCount === 1 ? 'vítima' : 'vítimas'} com sinais vitais críticos
          </Text>
        </View>
      ) : (
        <View style={styles.alertBox}>
          <Heart size={24} color="#4CAF50" />
          <Text style={styles.alertText}>
            Todos os sinais vitais estão normais
          </Text>
        </View>
      )}
      
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {sortedVictims.filter(v => getHeartRateStatus(v.heartRate) === 'normal').length}
          </Text>
          <Text style={styles.statLabel}>Normais</Text>
          <View style={[styles.statIndicator, { backgroundColor: '#4CAF50' }]} />
        </View>
        
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {sortedVictims.filter(v => getHeartRateStatus(v.heartRate) === 'high').length}
          </Text>
          <Text style={styles.statLabel}>Elevados</Text>
          <View style={[styles.statIndicator, { backgroundColor: '#E53935' }]} />
        </View>
        
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {sortedVictims.filter(v => getHeartRateStatus(v.heartRate) === 'low').length}
          </Text>
          <Text style={styles.statLabel}>Baixos</Text>
          <View style={[styles.statIndicator, { backgroundColor: '#FDD835' }]} />
        </View>
      </View>
      
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Vítimas Monitoradas</Text>
        
        {sortedVictims.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Heart size={48} color="#666666" />
            <Text style={styles.emptyText}>Nenhuma vítima monitorada</Text>
            <Text style={styles.emptySubtext}>
              Registre vítimas com dados vitais para visualizá-las aqui
            </Text>
          </View>
        ) : (
          sortedVictims.map(victim => {
            const heartRateStatus = getHeartRateStatus(victim.heartRate);
            
            return (
              <TouchableOpacity
                key={victim.id}
                style={styles.victimCard}
                onPress={() => handleViewVictim(victim.id)}
              >
                <View style={styles.victimInfo}>
                  <Text style={styles.victimName}>{victim.name}</Text>
                  <Text style={styles.victimId}>ID: {victim.id}</Text>
                  
                  {victim.familyGroup && (
                    <View style={styles.familyGroupTag}>
                      <Text style={styles.familyGroupText}>
                        Grupo: {victim.familyGroup}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.vitalsContainer}>
                  <View style={[
                    styles.heartRateContainer,
                    styles[`heartRate${heartRateStatus.charAt(0).toUpperCase() + heartRateStatus.slice(1)}`]
                  ]}>
                    <Heart 
                      size={16} 
                      color={getStatusColor(heartRateStatus)}
                      style={styles.pulsingHeart}
                    />
                    <Text style={styles.heartRateValue}>
                      {victim.heartRate}
                    </Text>
                    <Text style={styles.heartRateUnit}>BPM</Text>
                  </View>
                  
                  <View style={styles.timeSinceContainer}>
                    <Text style={styles.timeSinceText}>
                      Atualizado há 3 min
                    </Text>
                  </View>
                </View>
                
                <View style={styles.cardAction}>
                  <ArrowRight size={20} color="#AAAAAA" />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
      
      {sortedVictims.length > 0 && (
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={20} color="#FFFFFF" />
          <Text style={styles.refreshButtonText}>
            Atualizar Dados Vitais
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#303030',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#CCCCCC',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424242',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#424242',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  statIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#CCCCCC',
  },
  listContainer: {
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  victimCard: {
    flexDirection: 'row',
    backgroundColor: '#424242',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  victimInfo: {
    flex: 1,
  },
  victimName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  victimId: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#AAAAAA',
  },
  familyGroupTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  familyGroupText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#CCCCCC',
  },
  vitalsContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  heartRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heartRateNormal: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  heartRateHigh: {
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
  },
  heartRateLow: {
    backgroundColor: 'rgba(253, 216, 53, 0.1)',
  },
  pulsingHeart: {
    // Animation would be implemented with Reanimated
  },
  heartRateValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  heartRateUnit: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#AAAAAA',
    marginLeft: 2,
  },
  timeSinceContainer: {
    marginTop: 4,
  },
  timeSinceText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#AAAAAA',
  },
  cardAction: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#424242',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#CCCCCC',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#888888',
    marginTop: 8,
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: '#555555',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});