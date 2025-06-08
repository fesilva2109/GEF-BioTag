import { Platform, View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { useData } from '@/hooks/useData';
import { Colors } from '@/constants/Colors';
import React, { useEffect, useRef } from 'react';
import { useLocalSearchParams } from 'expo-router';
import MapView from 'react-native-maps';

let Marker: typeof import('react-native-maps').Marker;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  Marker = Maps.Marker;
}

export default function MapScreen() {
  const { shelters, patients } = useData();
  const { latitude, longitude } = useLocalSearchParams<{ latitude: number; longitude: number }>();
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [latitude, longitude]);

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Mapa de Abrigos e Pacientes" showBack={false} />
        <View style={styles.webPlaceholder}>
          <Text style={styles.webPlaceholderText}>
            O mapa não está disponível na versão web.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Mapa de Abrigos e Pacientes" showBack={false} />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: latitude || -23.55, 
          longitude: longitude || -46.63, 
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {shelters.map(shelter => (
          <Marker
            key={shelter.id}
            coordinate={{
              latitude: shelter.address.latitude,
              longitude: shelter.address.longitude,
            }}
            pinColor={Colors.primary}
            title={shelter.name}
            description={`${shelter.address.street}, ${shelter.address.number}`}
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
  webPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webPlaceholderText: {
    color: Colors.gray[300],
    fontSize: 18,
    textAlign: 'center',
    padding: 32,
  },
});