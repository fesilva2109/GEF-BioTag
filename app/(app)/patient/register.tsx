import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Zap, User, MapPin, Heart, AlignLeft, Radio } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Header } from '@/components/Header';
import { useData } from '@/hooks/useData';
import { Picker } from '@/components/Picker';
import { getHeartRateStatus } from '@/utils/healthUtils';
import React from 'react';

export default function RegisterPatientScreen() {
  const router = useRouter();
  const { shelters, addPatient } = useData();

  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [nfcId, setNfcId] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [shelterId, setShelterId] = useState('');
  const [heartRate, setHeartRate] = useState('75');
  const [notes, setNotes] = useState('');

  const simulateNfcScan = () => {
    setIsScanning(true);

    setTimeout(() => {
      const randomId = 'NFC' + Math.floor(Math.random() * 100000).toString().padStart(6, '0');
      setNfcId(randomId);
      setIsScanning(false); 
    }, 2000);
  };

  const validateForm = () => {
    if (!nfcId) return 'ID da pulseira NFC é obrigatório';
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

    setIsSaving(true);

    try {
      const shelter = shelters.find(s => s.id === shelterId);

      const latitude = shelter?.address?.latitude ?? (-23.55 - (Math.random() * 0.1));
      const longitude = shelter?.address?.longitude ?? (-46.63 - (Math.random() * 0.1));

      await addPatient({
        name,
        address,
        shelterId,
        bracelet: {
          id: nfcId,
          nfc: {
            id: nfcId,
            information: [
              `Nome: ${name}`,
              `Abrigo: ${shelter?.name || 'Não especificado'}`,
              notes ? `Observações: ${notes}` : ''
            ].filter(Boolean)
          },
          iotHeartRate: {
            id: 'HR' + nfcId.substring(3),
            bpm: parseInt(heartRate, 10),
            timestamp: Date.now()
          }
        }
      });

      Alert.alert(
        'Sucesso',
        'Paciente registrado com sucesso!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o paciente. Tente novamente.');
      console.error('Error saving patient:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const heartRateStatus = getHeartRateStatus(parseInt(heartRate, 10));
  const heartRateColor = 
    heartRateStatus === 'critical' ? Colors.danger :
    heartRateStatus === 'warning' ? Colors.warning :
    Colors.success;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Registrar Paciente" showBack={true} />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pulseira NFC</Text>
          
          <View style={styles.nfcContainer}>
            <View style={styles.nfcInputContainer}>
              <Radio size={20} color={Colors.gray[400]} />
              <TextInput
                style={styles.nfcInput}
                placeholder="ID da pulseira NFC"
                placeholderTextColor={Colors.gray[400]}
                value={nfcId}
                onChangeText={setNfcId}
                editable={!isScanning}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={simulateNfcScan}
              disabled={isScanning}
            >
              {isScanning ? (
                <ActivityIndicator color="#FFFFFF\" size="small" />
              ) : (
                <>
                  <Zap size={20} color="#FFFFFF" />
                  <Text style={styles.scanButtonText}>Escanear</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          
          {isScanning && (
            <Text style={styles.scanningText}>Aproxime a pulseira do dispositivo...</Text>
          )}
        </View>
        
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
              <Heart size={20} color={heartRateColor} />
              <TextInput
                style={[styles.heartRateInput, { color: heartRateColor }]}
                placeholder="BPM"
                placeholderTextColor={Colors.gray[400]}
                value={heartRate}
                onChangeText={setHeartRate}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
            
            <View style={[styles.heartRateStatus, { backgroundColor: heartRateColor + '20' }]}>
              <Text style={[styles.heartRateStatusText, { color: heartRateColor }]}>
                {heartRateStatus === 'normal' ? 'Normal' : 
                 heartRateStatus === 'warning' ? 'Atenção' : 'Crítico'}
              </Text>
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
              <Text style={styles.saveButtonText}>Registrar Paciente</Text>
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
  nfcContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  nfcInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[700],
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 56,
    marginRight: 12,
  },
  nfcInput: {
    flex: 1,
    color: Colors.white,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 12,
    height: '100%',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 56,
  },
  scanButtonText: {
    color: Colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
  },
  scanningText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.warning,
    marginTop: 8,
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
  heartRateStatus: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  heartRateStatusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
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
});