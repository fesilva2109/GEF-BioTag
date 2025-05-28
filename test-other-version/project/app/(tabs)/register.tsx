import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  ScrollView, Alert, ActivityIndicator, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, MapPin, Users, CircleAlert as AlertCircle, Check, X, QrCode, Scan } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useVictims } from '@/hooks/useVictims';
import { generateVictimId } from '@/utils/idGenerator';
import QRScannerModal from '@/components/QRScannerModal';

export default function RegisterScreen() {
  const router = useRouter();
  const { addVictim } = useVictims();
  const [qrModalVisible, setQrModalVisible] = useState(false);
  
  const [form, setForm] = useState({
    id: '',
    name: '',
    familyGroup: '',
    location: '',
    status: 'stable',
    observations: '',
    heartRate: '',
    lastUpdated: new Date().toISOString(),
    needsSync: true,
  });

  const [loading, setLoading] = useState({
    location: false,
    saving: false,
  });

  const [errors, setErrors] = useState({
    name: false,
    location: false,
  });

  useEffect(() => {
    // Generate a unique ID for this victim
    setForm(prev => ({ ...prev, id: generateVictimId() }));
  }, []);

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const getCurrentLocation = async () => {
    setLoading(prev => ({ ...prev, location: true }));
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de permissão para acessar sua localização');
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // For a real app, we would reverse geocode these coordinates
      // For this demo, we'll just use the coordinates
      setForm(prev => ({ 
        ...prev, 
        location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
      }));
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Erro', 'Não foi possível obter sua localização');
    } finally {
      setLoading(prev => ({ ...prev, location: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !form.name.trim(),
      location: !form.location.trim()
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSave = async (andRegisterNext = false) => {
    if (!validateForm()) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos marcados com *');
      return;
    }
    
    setLoading(prev => ({ ...prev, saving: true }));
    
    try {
      await addVictim({
        ...form,
        heartRate: form.heartRate ? parseInt(form.heartRate, 10) : null,
        lastUpdated: new Date().toISOString()
      });
      
      Alert.alert(
        'Sucesso', 
        'Vítima registrada com sucesso!',
        [
          { 
            text: 'OK',
            onPress: () => {
              if (andRegisterNext) {
                // Reset form for next victim
                setForm({
                  id: generateVictimId(),
                  name: '',
                  familyGroup: '',
                  location: form.location, // Keep the same location
                  status: 'stable',
                  observations: '',
                  heartRate: '',
                  lastUpdated: new Date().toISOString(),
                  needsSync: true,
                });
              } else {
                // Navigate back or to the list
                router.push('/victims');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error saving victim:', error);
      Alert.alert('Erro', 'Não foi possível salvar o registro');
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };

  const handleQRScanned = (data) => {
    try {
      // Assume QR contains JSON data about the victim
      const scannedData = JSON.parse(data);
      
      setForm(prev => ({
        ...prev,
        name: scannedData.name || prev.name,
        // Add other fields as needed from QR code
      }));
      
      setQrModalVisible(false);
    } catch (error) {
      Alert.alert('Erro no QR Code', 'O código não contém dados válidos');
      setQrModalVisible(false);
    }
  };

  const simulateNFCScan = () => {
    // This would be a real NFC scan in a production app
    // For this demo, we'll simulate reading data
    
    Alert.alert('Leitura NFC', 'Simulando leitura de pulseira...');
    
    // Simulate reading some data after a delay
    setTimeout(() => {
      const mockHeartRate = Math.floor(Math.random() * (100 - 60) + 60);
      
      setForm(prev => ({
        ...prev,
        heartRate: mockHeartRate.toString()
      }));
      
      Alert.alert('Leitura Concluída', `Batimentos cardíacos: ${mockHeartRate} BPM`);
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Informações Básicas</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome Completo *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={form.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Nome da vítima"
            placeholderTextColor="#888"
          />
          {errors.name && (
            <Text style={styles.errorText}>Nome é obrigatório</Text>
          )}
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Grupo Familiar</Text>
          <TextInput
            style={styles.input}
            value={form.familyGroup}
            onChangeText={(value) => handleInputChange('familyGroup', value)}
            placeholder="Identificação do grupo familiar"
            placeholderTextColor="#888"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Localização *</Text>
          <View style={styles.locationInputContainer}>
            <TextInput
              style={[
                styles.input, 
                styles.locationInput, 
                errors.location && styles.inputError
              ]}
              value={form.location}
              onChangeText={(value) => handleInputChange('location', value)}
              placeholder="Endereço ou coordenadas"
              placeholderTextColor="#888"
            />
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={getCurrentLocation}
              disabled={loading.location}
            >
              {loading.location ? (
                <ActivityIndicator size="small\" color="#FFFFFF" />
              ) : (
                <MapPin size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
          {errors.location && (
            <Text style={styles.errorText}>Localização é obrigatória</Text>
          )}
        </View>
      </View>
      
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Status e Vitais</Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.label}>Status da Vítima</Text>
          <View style={styles.statusButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.statusButton, 
                form.status === 'stable' && styles.statusButtonActive
              ]}
              onPress={() => handleInputChange('status', 'stable')}
            >
              <Check size={16} color={form.status === 'stable' ? '#FFFFFF' : '#4CAF50'} />
              <Text style={[
                styles.statusButtonText,
                form.status === 'stable' && styles.statusButtonTextActive
              ]}>No Abrigo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.statusButton, 
                form.status === 'atrisk' && styles.statusButtonAtRisk
              ]}
              onPress={() => handleInputChange('status', 'atrisk')}
            >
              <AlertCircle size={16} color={form.status === 'atrisk' ? '#FFFFFF' : '#FDD835'} />
              <Text style={[
                styles.statusButtonText,
                form.status === 'atrisk' && styles.statusButtonTextActive
              ]}>Área de Risco</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.statusButton, 
                form.status === 'critical' && styles.statusButtonCritical
              ]}
              onPress={() => handleInputChange('status', 'critical')}
            >
              <AlertCircle size={16} color={form.status === 'critical' ? '#FFFFFF' : '#E53935'} />
              <Text style={[
                styles.statusButtonText,
                form.status === 'critical' && styles.statusButtonTextActive
              ]}>Crítico</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <View style={styles.heartRateContainer}>
            <Text style={styles.label}>Batimentos Cardíacos (BPM)</Text>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={simulateNFCScan}
            >
              <Scan size={18} color="#FFFFFF" />
              <Text style={styles.scanButtonText}>Ler Pulseira</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={form.heartRate}
            onChangeText={(value) => handleInputChange('heartRate', value.replace(/[^0-9]/g, ''))}
            placeholder="BPM"
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Observações</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.observations}
            onChangeText={(value) => handleInputChange('observations', value)}
            placeholder="Informações adicionais sobre a vítima"
            placeholderTextColor="#888"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>
      
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.scanQRButton]}
          onPress={() => setQrModalVisible(true)}
        >
          <QrCode size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Escanear QR Code</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.saveButton]}
          onPress={() => handleSave(false)}
          disabled={loading.saving}
        >
          {loading.saving ? (
            <ActivityIndicator size="small\" color="#FFFFFF" />
          ) : (
            <>
              <Check size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Salvar e Concluir</Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.saveAndNextButton]}
          onPress={() => handleSave(true)}
          disabled={loading.saving}
        >
          {loading.saving ? (
            <ActivityIndicator size="small\" color="#FFFFFF" />
          ) : (
            <>
              <Users size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Salvar e Registrar Próximo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      <QRScannerModal 
        visible={qrModalVisible}
        onClose={() => setQrModalVisible(false)}
        onCodeScanned={handleQRScanned}
      />
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
  formSection: {
    backgroundColor: '#424242',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#CCCCCC',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#E53935',
  },
  errorText: {
    color: '#E53935',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  locationInputContainer: {
    flexDirection: 'row',
  },
  locationInput: {
    flex: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  locationButton: {
    backgroundColor: '#555555',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  statusButtonActive: {
    backgroundColor: '#4CAF50',
  },
  statusButtonAtRisk: {
    backgroundColor: '#FDD835',
  },
  statusButtonCritical: {
    backgroundColor: '#E53935',
  },
  statusButtonText: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 4,
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
  heartRateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555555',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 4,
  },
  actionButtonsContainer: {
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 12,
  },
  scanQRButton: {
    backgroundColor: '#555555',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveAndNextButton: {
    backgroundColor: '#1976D2',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
});