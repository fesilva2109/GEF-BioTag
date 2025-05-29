import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UserPlus, Users, CircleAlert as AlertCircle, Info } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Header } from '@/components/Header';
import { useData } from '@/hooks/useData';
import { OfflineBanner } from '@/components/OfflineBanner';
import React from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const { patients, shelters } = useData();
  const { isOffline } = useData();

  
  // Filter patients with critical heart rate
  const criticalPatients = patients.filter(patient => {
    return patient.bracelet.iotHeartRate.bpm > 100 || patient.bracelet.iotHeartRate.bpm < 60;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="GEF-BioTag" showBack={false} />
      {isOffline && <OfflineBanner />}

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => router.push('/patient/register')}
          >
            <UserPlus size={32} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Registrar Novo Paciente</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => router.push('/patients')}
          >
            <Users size={28} color="#FFFFFF" />
            <Text style={styles.secondaryButtonText}>Pacientes nos Abrigos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Resumo da Operação</Text>
          
          <View style={styles.statRow}>
            <View style={[styles.statCard, styles.primaryStatCard]}>
              <Text style={styles.statNumber}>{patients.length}</Text>
              <Text style={styles.statLabel}>Pacientes Registrados</Text>
            </View>
            
            <View style={[styles.statCard, styles.secondaryStatCard]}>
              <Text style={styles.statNumber}>{shelters.length}</Text>
              <Text style={styles.statLabel}>Abrigos Ativos</Text>
            </View>
          </View>
          
          <View style={[styles.statCard, styles.warningStatCard]}>
            <View style={styles.statHeader}>
              <AlertCircle size={20} color={Colors.warning} />
              <Text style={styles.statWarningText}>Atenção Necessária</Text>
            </View>
            <Text style={styles.statNumber}>{criticalPatients.length}</Text>
            <Text style={styles.statLabel}>Pacientes em Estado Crítico</Text>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Info size={20} color={Colors.white} />
            <Text style={styles.infoTitle}>Instruções de Emergência</Text>
          </View>
          <Text style={styles.infoText}>
            1. Registre pacientes usando o botão acima
          </Text>
          <Text style={styles.infoText}>
            2. Monitore batimentos cardíacos para priorizar atendimentos
          </Text>
          <Text style={styles.infoText}>
            3. Sincronize dados quando possível para atualizar o sistema central
          </Text>
          <Text style={styles.infoText}>
            4. Mantenha a pulseira NFC próxima ao aparelho durante leituras
          </Text>
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
  actionButtons: {
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginLeft: 16,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginLeft: 12,
  },
  statsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.white,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  primaryStatCard: {
    backgroundColor: Colors.gray[700],
    flex: 1,
    marginRight: 8,
  },
  secondaryStatCard: {
    backgroundColor: Colors.gray[700],
    flex: 1,
    marginLeft: 8,
  },
  warningStatCard: {
    backgroundColor: Colors.gray[700],
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statWarningText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.warning,
    marginLeft: 8,
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.white,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[300],
    marginTop: 4,
  },
  infoSection: {
    backgroundColor: Colors.gray[700],
    borderRadius: 12,
    padding: 16,
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
});