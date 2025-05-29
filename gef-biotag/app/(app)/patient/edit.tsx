import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { User, MapPin, Heart, AlignLeft, Radio } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Header } from '@/components/Header';
import { useData } from '@/hooks/useData';
import { Picker } from '@/components/Picker';
import React from 'react';

export default function EditPatientScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { patients, shelters, updatePatientHeartRate, addPatient } = useData();

  const [isSaving, setIsSaving] = useState(false);
  const [patient, setPatient] = useState<any>(null);

  // Campos editáveis
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [shelterId, setShelterId] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      const foundPatient = patients.find(p => p.id === id);
      if (foundPatient) {
        setPatient(foundPatient);
        setName(foundPatient.name);
        setAddress(foundPatient.address);
        setShelterId(foundPatient.shelterId);
        setHeartRate(String(foundPatient.bracelet.iotHeartRate.bpm));
        // Pega observações do NFC info (exceto nome/abrigo)
        const obs = foundPatient.bracelet.nfc.information
          .filter((info: string) => !info.startsWith('Nome:') && !info.startsWith('Abrigo:'))
          .join('\n');
        setNotes(obs);
      }
    }
  }, [id, patients]);

  const validateForm = () => {
    if (!name) return 'Nome do paciente é obrigatório';
    if (!shelterId) return 'Selecione um abrigo';
    const bpm = parseInt(heartRate, 10);
    if (isNaN(bpm) || bpm < 30 || bpm > 220) {
      return 'Batimentos cardíacos devem estar entre 30 e 220 BPM';
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Erro de Validação', validationError);
      return;
    }
    if (!patient) return;

    setIsSaving(true);

    try {
      // Atualiza campos editáveis
      const updatedPatient = {
        ...patient,
        name,
        address,
        shelterId,
        bracelet: {
          ...patient.bracelet,
          nfc: {
            ...patient.bracelet.nfc,
            information: [
              `Nome: ${name}`,
              `Abrigo: ${shelters.find(s => s.id === shelterId)?.name || 'Não especificado'}`,
              ...(notes ? [notes] : [])
            ]
          },
          iotHeartRate: {
            ...patient.bracelet.iotHeartRate,
            bpm: parseInt(heartRate, 10),
            timestamp: Date.now()
          }
        },
        updatedAt: Date.now(),
      };

      // Atualiza batimentos
      await updatePatientHeartRate(patient.id, parseInt(heartRate, 10));

      patient.name = name;
      patient.address = address;
      patient.shelterId = shelterId;
      patient.bracelet.nfc.information = [
        `Nome: ${name}`,
        `Abrigo: ${shelters.find(s => s.id === shelterId)?.name || 'Não especificado'}`,
        ...(notes ? [notes] : [])
      ];

      Alert.alert('Sucesso', 'Paciente atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao atualizar o paciente. Tente novamente.');
      console.error('Error updating patient:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!patient) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Editar Paciente" showBack={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Carregando paciente...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Editar Paciente" showBack={true} />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          <View style={styles.inputContainer}>
            <User size={20} color={Colors.gray[400]} />
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={Colors.gray[400]}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputContainer}>
            <MapPin size={20} color={Colors.gray[400]} />
            <TextInput
              style={styles.input}
              placeholder="Endereço"
              placeholderTextColor={Colors.gray[400]}
              value={address}
              onChangeText={setAddress}
            />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Abrigo</Text>
            <Picker
              selectedValue={shelterId}
              onValueChange={(value) => setShelterId(value)}
              items={shelters.map(shelter => ({
                label: shelter.name,
                value: shelter.id
              }))}
              placeholder="Selecione um abrigo"
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Vitais</Text>
          <View style={styles.heartRateContainer}>
            <View style={styles.heartRateInputContainer}>
              <Heart size={20} color={Colors.primary} />
              <TextInput
                style={[styles.heartRateInput, { color: Colors.primary }]}
                placeholder="BPM"
                placeholderTextColor={Colors.gray[400]}
                value={heartRate}
                onChangeText={setHeartRate}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <View style={styles.notesContainer}>
            <AlignLeft size={20} color={Colors.gray[400]} style={styles.notesIcon} />
            <TextInput
              style={styles.notesInput}
              placeholder="Informações adicionais sobre o paciente"
              placeholderTextColor={Colors.gray[400]}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            )}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.white,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[700],
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 56,
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 12,
    height: '100%',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
    marginBottom: 8,
  },
  heartRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartRateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[700],
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 56,
    marginRight: 12,
    flex: 1,
  },
  heartRateInput: {
    flex: 1,
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginLeft: 12,
    height: '100%',
  },
  notesContainer: {
    backgroundColor: Colors.gray[700],
    borderRadius: 8,
    padding: 12,
  },
  notesIcon: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  notesInput: {
    color: Colors.white,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginTop: 8,
    paddingBottom: 8,
    minHeight: 100,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  saveButtonText: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 18,
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
});