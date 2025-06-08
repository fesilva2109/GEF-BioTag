import React, { useState } from 'react';
import { Alert, ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { ArrowLeft, Radio } from 'lucide-react-native';
import { apiService } from '@/services/apiService';

export default function ScannerScreen() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);

  const simulateScan = async () => {
    setIsScanning(true);

    try {
      const patients = await apiService.getPatients();

      const randomPatient = patients[Math.floor(Math.random() * patients.length)];
      if (!randomPatient) {
        Alert.alert('Erro', 'Nenhum paciente encontrado na API.');
        return;
      }

      const simulatedNfcId = randomPatient.bracelet.nfc.id;
      router.push({
        pathname: '/patient/details',
        params: { id: randomPatient.id },
      });
    } catch (error) {
      console.error('Erro ao simular escaneamento:', error);
      Alert.alert('Erro', 'Não foi possível simular o escaneamento.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.absoluteBackButton}>
        <ArrowLeft size={28} color={Colors.white} />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>Escanear Paciente</Text>
        <Text style={styles.subtitle}>Aproxime a pulseira NFC do dispositivo</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/nfc.png')} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        {isScanning ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <TouchableOpacity style={styles.scanButton} onPress={simulateScan}>
            <Radio size={32} color={Colors.white} />
            <Text style={styles.scanButtonText}>Iniciar Escaneamento</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  absoluteBackButton: {
    position: 'absolute',
    top: 64,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[300],
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: 32,
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  content: {
    alignItems: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    elevation: 5,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  scanButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.white,
    marginLeft: 12,
  },
});