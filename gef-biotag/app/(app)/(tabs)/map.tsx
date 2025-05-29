import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { useData } from '@/hooks/useData';
import { Colors } from '@/constants/Colors';
import React from 'react';

export default function MapScreen() {
  const { shelters, patients } = useData();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Mapa de Abrigos e Pacientes" showBack={false} />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.55,
          longitude: -46.63,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {shelters.map(shelter => (
          <Marker
            key={shelter.id}
            coordinate={{
              latitude: shelter.address?.latitude || -23.55,
              longitude: shelter.address?.longitude || -46.63,
            }}
            pinColor={Colors.primary}
            title={shelter.name}
            description={shelter.address}
          />
        ))}
        {patients.map(patient => (
          <Marker
            key={patient.id}
            coordinate={{
              latitude: patient.bracelet.rfid.coordinates.latitude,
              longitude: patient.bracelet.rfid.coordinates.longitude,
            }}
            pinColor={Colors.secondary}
            title={patient.name}
            description={`BPM: ${patient.bracelet.iotHeartRate.bpm}`}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkGray,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});