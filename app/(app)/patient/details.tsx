import { Header } from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { useData } from '@/hooks/useData';
import { Patient, Shelter } from '@/types';
import { getHeartRateStatus } from '@/utils/healthUtils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AlignLeft, Building2, Clipboard as ClipboardEdit, Heart, MapPin, Radio, UserRound } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PatientDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { patients, shelters, updatePatientHeartRate, removePatient } = useData();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPatient = patients.find(p => p.id === id);
      setPatient(foundPatient || null);

      if (foundPatient) {
        const foundShelter = shelters.find(s => s.id === foundPatient.shelterId);
        setShelter(foundShelter || null);
      }
    }
  }, [id, patients, shelters]);

  const simulateHeartRateUpdate = async () => {
    if (!patient) return;

    setLoading(true);

    try {
      const newBpm = Math.floor(Math.random() * 80) + 50;

      await updatePatientHeartRate(patient.id, newBpm);

      setPatient(prev => {
        if (!prev) return null;
        return {
          ...prev,
          bracelet: {
            ...prev.bracelet,
            iotHeartRate: {
              ...prev.bracelet.iotHeartRate,
              bpm: newBpm,
              timestamp: Date.now()
            }
          }
        };
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os batimentos cardíacos.');
      console.error('Error updating heart rate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = () => {
    if (!patient) return;

    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja remover o paciente ${patient.name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await removePatient(patient.id);
              router.back();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover o paciente.');
              console.error('Error removing patient:', error);
            }
          }
        }
      ]
    );
  };

  if (!patient) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Detalhes do Paciente" showBack={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando paciente...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const heartRateStatus = getHeartRateStatus(patient.bracelet.iotHeartRate.bpm);
  const heartRateColor =
    heartRateStatus === 'critical' ? Colors.danger :
      heartRateStatus === 'warning' ? Colors.warning :
        Colors.success;

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
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
      <Header title="Detalhes do Paciente" showBack={true} />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.patientHeader}>
          <View style={styles.patientIconContainer}>
            <UserRound size={32} color={Colors.white} />
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientId}>ID: {patient.bracelet.nfc.id}</Text>
          </View>
        </View>

        <View style={styles.vitalSign}>
          <Heart size={24} color={heartRateColor} />
          <View style={styles.vitalInfo}>
            <Text style={styles.vitalValue}>{patient.bracelet.iotHeartRate.bpm} BPM</Text>
            <Text style={styles.vitalLabel}>Batimentos Cardíacos</Text>
          </View>
          <View style={[styles.vitalStatus, { backgroundColor: heartRateColor + '20' }]}>
            <Text style={[styles.vitalStatusText, { color: heartRateColor }]}>
              {heartRateStatus === 'normal' ? 'Normal' :
                heartRateStatus === 'warning' ? 'Atenção' : 'Crítico'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={simulateHeartRateUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF\" size="small" />
          ) : (
            <>
              <Heart size={18} color="#FFFFFF" />
              <Text style={styles.updateButtonText}>Atualizar Batimentos</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Radio size={20} color={Colors.gray[400]} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>ID da Pulseira NFC</Text>
              <Text style={styles.infoValue}>{patient.bracelet.nfc.id}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MapPin size={20} color={Colors.gray[400]} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Endereço</Text>
              <Text style={styles.infoValue}>
                {typeof patient.address === 'string'
                  ? patient.address
                  : [
                      patient.address?.street,
                      patient.address?.number,
                      patient.address?.suite,
                      patient.address?.city,
                      patient.address?.state
                    ]
                      .filter(Boolean)
                      .join(', ') || 'Não informado'}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Building2 size={20} color={Colors.gray[400]} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Abrigo</Text>
              <Text style={styles.infoValue}>{shelter?.name || 'Não especificado'}</Text>
            </View>
          </View>
        </View>

        {patient.bracelet.nfc.information.length > 0 && (
          <View style={styles.notesSection}>
            <View style={styles.sectionHeader}>
              <AlignLeft size={20} color={Colors.white} />
              <Text style={styles.sectionTitle}>Observações</Text>
            </View>

            {patient.bracelet.nfc.information.map((info, index) => {
              if (!info.startsWith('Nome:') && !info.startsWith('Abrigo:')) {
                return (
                  <Text key={index} style={styles.noteText}>{info}</Text>
                );
              }
              return null;
            })}
          </View>
        )}

        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <ClipboardEdit size={20} color={Colors.white} />
            <Text style={styles.sectionTitle}>Histórico</Text>
          </View>

          <View style={styles.historyItem}>
            <Text style={styles.historyTitle}>Registrado em</Text>
            <Text style={styles.historyValue}>{formatTimestamp(patient.createdAt)}</Text>
          </View>

          <View style={styles.historyItem}>
            <Text style={styles.historyTitle}>Última atualização</Text>
            <Text style={styles.historyValue}>{formatTimestamp(patient.updatedAt)}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push({
              pathname: '/patient/edit',
              params: { id: patient.id }
            })}
          >
            <Text style={styles.editButtonText}>Editar Paciente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeletePatient}
          >
            <Text style={styles.deleteButtonText}>Remover Paciente</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.white,
    marginTop: 16,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  patientIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.white,
    marginBottom: 4,
  },
  patientId: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[300],
  },
  vitalSign: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[800],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  vitalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vitalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.white,
  },
  vitalLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[300],
  },
  vitalStatus: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  vitalStatusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  updateButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
    marginLeft: 8,
  },
  infoSection: {
    backgroundColor: Colors.gray[800],
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[300],
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.white,
  },
  notesSection: {
    backgroundColor: Colors.gray[800],
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.white,
    marginLeft: 8,
  },
  noteText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.white,
    marginBottom: 8,
    lineHeight: 22,
  },
  historySection: {
    backgroundColor: Colors.gray[800],
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  historyItem: {
    marginBottom: 12,
  },
  historyTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[300],
    marginBottom: 4,
  },
  historyValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.white,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  syncedIndicator: {
    backgroundColor: Colors.success,
  },
  unsyncedIndicator: {
    backgroundColor: Colors.warning,
  },
  syncText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.white,
  },
  actionButtons: {
    marginBottom: 32,
  },
  editButton: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  editButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  deleteButton: {
    backgroundColor: Colors.danger + '20',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.danger,
  },
});