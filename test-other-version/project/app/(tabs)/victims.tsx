import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, FlatList, TouchableOpacity, 
  TextInput, ActivityIndicator, RefreshControl 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, ChevronRight, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Circle } from 'lucide-react-native';
import { useVictims } from '@/hooks/useVictims';
import VictimCard from '@/components/VictimCard';
import FilterModal from '@/components/FilterModal';

export default function VictimsScreen() {
  const router = useRouter();
  const { victims, getVictims, isLoading } = useVictims();
  const [searchText, setSearchText] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    familyGroup: '',
  });
  
  const [filteredVictims, setFilteredVictims] = useState([]);
  
  useEffect(() => {
    // Apply search and filters
    let result = [...victims];
    
    // Apply search
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(victim => 
        victim.name.toLowerCase().includes(searchLower) ||
        victim.id.toLowerCase().includes(searchLower) ||
        (victim.familyGroup && victim.familyGroup.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply status filter
    if (filters.status.length > 0) {
      result = result.filter(victim => filters.status.includes(victim.status));
    }
    
    // Apply family group filter
    if (filters.familyGroup) {
      result = result.filter(victim => 
        victim.familyGroup && victim.familyGroup === filters.familyGroup
      );
    }
    
    setFilteredVictims(result);
  }, [victims, searchText, filters]);
  
  const handleViewVictim = (victimId) => {
    router.push(`/victim/${victimId}`);
  };
  
  const handleRefresh = () => {
    getVictims();
  };
  
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setFilterModalVisible(false);
  };
  
  const renderVictimItem = ({ item }) => (
    <VictimCard 
      victim={item} 
      onPress={() => handleViewVictim(item.id)} 
    />
  );
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <AlertCircle size={48} color="#666666" />
      <Text style={styles.emptyText}>Nenhuma vítima encontrada</Text>
      <Text style={styles.emptySubtext}>
        {searchText || filters.status.length > 0 || filters.familyGroup 
          ? 'Tente ajustar os filtros ou a busca'
          : 'Registre vítimas para vê-las aqui'}
      </Text>
    </View>
  );
  
  const activeFilterCount = filters.status.length + (filters.familyGroup ? 1 : 0);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#AAAAAA" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Buscar por nome, ID ou grupo"
            placeholderTextColor="#888888"
          />
          {searchText ? (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => setSearchText('')}
            >
              <Circle size={16} color="#AAAAAA" />
              <View style={styles.clearX} />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            activeFilterCount > 0 && styles.filterButtonActive
          ]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Filter size={20} color={activeFilterCount > 0 ? '#FFFFFF' : '#AAAAAA'} />
          {activeFilterCount > 0 && (
            <View style={styles.filterCountBadge}>
              <Text style={styles.filterCountText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {filteredVictims.length} {filteredVictims.length === 1 ? 'Vítima' : 'Vítimas'}
          </Text>
          {activeFilterCount > 0 && (
            <TouchableOpacity 
              style={styles.clearFiltersButton}
              onPress={() => setFilters({ status: [], familyGroup: '' })}
            >
              <Text style={styles.clearFiltersText}>Limpar Filtros</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <FlatList
          data={filteredVictims}
          renderItem={renderVictimItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={['#E53935']}
              tintColor="#E53935"
            />
          }
        />
      </View>
      
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
        availableFamilyGroups={[...new Set(victims.map(v => v.familyGroup).filter(Boolean))]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#303030',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#424242',
    borderBottomWidth: 1,
    borderBottomColor: '#505050',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  clearButton: {
    position: 'relative',
    width: 16,
    height: 16,
  },
  clearX: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderColor: '#AAAAAA',
    borderWidth: 1,
    borderRadius: 8,
    transform: [{ rotate: '45deg' }],
  },
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#E53935',
  },
  filterCountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FDD835',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCountText: {
    color: '#000000',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  listContainer: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#CCCCCC',
  },
  clearFiltersButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearFiltersText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#E53935',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#CCCCCC',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#888888',
    marginTop: 8,
    textAlign: 'center',
  },
});