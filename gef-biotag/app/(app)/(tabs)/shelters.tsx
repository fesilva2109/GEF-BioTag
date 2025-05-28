import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Building2, Users } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Header } from '@/components/Header';
import { useData } from '@/hooks/useData';
import React from 'react';

export default function SheltersScreen() {
  const router = useRouter();
  const { shelters, patients } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredShelters = shelters.filter(shelter => 
    shelter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shelter.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPatientsCount = (shelterId: string) => {
    return patients.filter(patient => patient.shelterId === shelterId).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Abrigos" showBack={false} />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou endereço"
            placeholderTextColor={Colors.gray[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        {filteredShelters.length > 0 ? (
          <FlatList
            data={filteredShelters}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const patientCount = getPatientsCount(item.id);
              const capacityPercentage = Math.min((patientCount / item.capacity) * 100, 100);
              
              return (
                <TouchableOpacity 
                  style={styles.shelterCard}
                  onPress={() => router.push({
                    pathname: '/patients',
                    params: { shelterId: item.id }
                  })}
                >
                  <View style={styles.shelterHeader}>
                    <View style={styles.shelterIconContainer}>
                      <Building2 size={24} color={Colors.white} />
                    </View>
                    <View style={styles.shelterInfo}>
                      <Text style={styles.shelterName}>{item.name}</Text>
                      <Text style={styles.shelterAddress}>{item.address}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.shelterStats}>
                    <View style={styles.capacityContainer}>
                      <View style={styles.capacityTextContainer}>
                        <Text style={styles.capacityText}>Capacidade: </Text>
                        <Text style={styles.capacityNumbers}>
                          {patientCount}/{item.capacity}
                        </Text>
                      </View>
                      <View style={styles.capacityBarBackground}>
                        <View 
                          style={[
                            styles.capacityBarFill, 
                            { width: `${capacityPercentage}%` },
                            capacityPercentage > 90 ? styles.capacityBarDanger : 
                            capacityPercentage > 70 ? styles.capacityBarWarning : 
                            styles.capacityBarNormal
                          ]} 
                        />
                      </View>
                    </View>
                    
                    <View style={styles.patientCountContainer}>
                      <Users size={16} color={Colors.white} />
                      <Text style={styles.patientCountText}>{patientCount} pacientes</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Building2 size={48} color={Colors.gray[400]} />
            <Text style={styles.emptyTitle}>Nenhum abrigo encontrado</Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'Tente ajustar sua busca'
                : 'Não há abrigos registrados no sistema'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkGray,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.gray[800],
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[700],
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 8,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.darkGray,
  },
  listContent: {
    padding: 16,
  },
  shelterCard: {
    backgroundColor: Colors.gray[800],
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  shelterHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  shelterIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shelterInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  shelterName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.white,
    marginBottom: 4,
  },
  shelterAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[300],
  },
  shelterStats: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray[700],
    paddingTop: 12,
  },
  capacityContainer: {
    marginBottom: 8,
  },
  capacityTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  capacityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[300],
  },
  capacityNumbers: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  capacityBarBackground: {
    height: 8,
    backgroundColor: Colors.gray[700],
    borderRadius: 4,
    overflow: 'hidden',
  },
  capacityBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  capacityBarNormal: {
    backgroundColor: Colors.success,
  },
  capacityBarWarning: {
    backgroundColor: Colors.warning,
  },
  capacityBarDanger: {
    backgroundColor: Colors.danger,
  },
  patientCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientCountText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.white,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[300],
    textAlign: 'center',
  },
});