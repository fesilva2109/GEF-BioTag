import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Filter, UserRound, Heart } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Header } from '@/components/Header';
import { useData } from '@/hooks/useData';
import { Patient } from '@/types';
import { PatientCard } from '@/components/PatientCard';
import React from 'react';

export default function PatientsScreen() {
  const router = useRouter();
  const { patients, shelters } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterShelterId, setFilterShelterId] = useState<string | null>(null);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let result = [...patients];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(patient => 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.bracelet.nfc.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply shelter filter
    if (filterShelterId) {
      result = result.filter(patient => patient.shelterId === filterShelterId);
    }
    
    setFilteredPatients(result);
  }, [searchQuery, filterShelterId, patients]);

  const resetFilters = () => {
    setSearchQuery('');
    setFilterShelterId(null);
  };

  const getShelterName = (shelterId: string) => {
    const shelter = shelters.find(s => s.id === shelterId);
    return shelter ? shelter.name : 'Abrigo desconhecido';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Pacientes" showBack={false} />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou ID de pulseira"
            placeholderTextColor={Colors.gray[400]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Filtrar por abrigo:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity
              style={[
                styles.shelterFilterChip,
                filterShelterId === null && styles.activeShelterFilter
              ]}
              onPress={() => setFilterShelterId(null)}
            >
              <Text style={[
                styles.shelterFilterText,
                filterShelterId === null && styles.activeShelterFilterText
              ]}>Todos</Text>
            </TouchableOpacity>
            
            {shelters.map(shelter => (
              <TouchableOpacity
                key={shelter.id}
                style={[
                  styles.shelterFilterChip,
                  filterShelterId === shelter.id && styles.activeShelterFilter
                ]}
                onPress={() => setFilterShelterId(shelter.id)}
              >
                <Text style={[
                  styles.shelterFilterText,
                  filterShelterId === shelter.id && styles.activeShelterFilterText
                ]}>{shelter.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.filterActions}>
            <TouchableOpacity 
              style={styles.resetFiltersButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetFiltersText}>Limpar filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <View style={styles.contentContainer}>
        {filteredPatients.length > 0 ? (
          <FlatList
            data={filteredPatients}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <PatientCard
                patient={item}
                shelterName={getShelterName(item.shelterId)}
                onPress={() => router.push({
                  pathname: '/patient/details',
                  params: { id: item.id }
                })}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <UserRound size={48} color={Colors.gray[400]} />
            <Text style={styles.emptyTitle}>Nenhum paciente encontrado</Text>
            <Text style={styles.emptyText}>
              {searchQuery || filterShelterId
                ? 'Tente ajustar seus filtros de busca'
                : 'Registre novos pacientes através da tela inicial'}
            </Text>
            {(searchQuery || filterShelterId) && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={resetFilters}
              >
                <Text style={styles.clearFiltersText}>Limpar filtros</Text>
              </TouchableOpacity>
            )}
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
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: Colors.gray[800],
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  shelterFilterChip: {
    backgroundColor: Colors.gray[700],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeShelterFilter: {
    backgroundColor: Colors.primary,
  },
  shelterFilterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
  activeShelterFilterText: {
    color: Colors.white,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  resetFiltersButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  resetFiltersText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.gray[300],
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.darkGray,
  },
  listContent: {
    padding: 16,
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
    marginBottom: 24,
  },
  clearFiltersButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  clearFiltersText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.white,
  },
});