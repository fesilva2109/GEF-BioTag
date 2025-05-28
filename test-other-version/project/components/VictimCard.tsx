import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Heart, CircleAlert as AlertCircle, ChevronRight } from 'lucide-react-native';
import type { Victim } from '@/types/victim';

type VictimCardProps = {
  victim: Victim;
  onPress?: () => void;
};

export default function VictimCard({ victim, onPress }: VictimCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return '#4CAF50';
      case 'atrisk': return '#FDD835';
      case 'critical': return '#E53935';
      default: return '#CCCCCC';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'stable': return 'No Abrigo';
      case 'atrisk': return 'Área de Risco';
      case 'critical': return 'Estado Crítico';
      default: return 'Desconhecido';
    }
  };
  
  const getHeartRateStatus = (rate: number | null) => {
    if (!rate) return null;
    if (rate < 60) return '#FDD835'; // Low - yellow
    if (rate > 100) return '#E53935'; // High - red
    return '#4CAF50'; // Normal - green
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.content}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{victim.name}</Text>
          
          {victim.needsSync && (
            <View style={styles.syncBadge}>
              <Text style={styles.syncText}>Não sincronizado</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.id}>ID: {victim.id}</Text>
        
        <View style={styles.detailsContainer}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(victim.status) }
          ]}>
            <AlertCircle size={12} color="#FFFFFF" style={styles.statusIcon} />
            <Text style={styles.statusText}>
              {getStatusLabel(victim.status)}
            </Text>
          </View>
          
          {victim.familyGroup && (
            <View style={styles.familyBadge}>
              <Text style={styles.familyText}>
                Grupo: {victim.familyGroup}
              </Text>
            </View>
          )}
          
          {victim.heartRate && (
            <View style={[
              styles.heartRateBadge,
              { backgroundColor: `${getHeartRateStatus(victim.heartRate)}20` }
            ]}>
              <Heart 
                size={12} 
                color={getHeartRateStatus(victim.heartRate) || '#CCCCCC'} 
                style={styles.heartIcon} 
              />
              <Text style={[
                styles.heartRateText,
                { color: getHeartRateStatus(victim.heartRate) }
              ]}>
                {victim.heartRate} BPM
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.timeText}>
            Atualizado: {formatDate(victim.lastUpdated)}
          </Text>
        </View>
      </View>
      
      <View style={styles.actionContainer}>
        <ChevronRight size={20} color="#AAAAAA" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#424242',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  syncBadge: {
    backgroundColor: '#FDD83520',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  syncText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#FDD835',
  },
  id: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#AAAAAA',
    marginTop: 2,
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
    marginBottom: 4,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  familyBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
    marginBottom: 4,
  },
  familyText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#CCCCCC',
  },
  heartRateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  heartIcon: {
    marginRight: 4,
  },
  heartRateText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  footer: {
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#999999',
  },
  actionContainer: {
    justifyContent: 'center',
  },
});