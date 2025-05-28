import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, Modal, TouchableOpacity, 
  FlatList, TouchableWithoutFeedback 
} from 'react-native';
import { X, Check, Filter } from 'lucide-react-native';

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: { status: string[], familyGroup: string }) => void;
  currentFilters: { status: string[], familyGroup: string };
  availableFamilyGroups: string[];
};

export default function FilterModal({ 
  visible, 
  onClose, 
  onApply,
  currentFilters,
  availableFamilyGroups 
}: FilterModalProps) {
  const [filters, setFilters] = useState({
    status: [...(currentFilters.status || [])],
    familyGroup: currentFilters.familyGroup || '',
  });
  
  useEffect(() => {
    if (visible) {
      // Reset filters to current when modal opens
      setFilters({
        status: [...(currentFilters.status || [])],
        familyGroup: currentFilters.familyGroup || '',
      });
    }
  }, [visible, currentFilters]);
  
  const toggleStatus = (status: string) => {
    setFilters(prev => {
      const newStatus = [...prev.status];
      const index = newStatus.indexOf(status);
      
      if (index > -1) {
        newStatus.splice(index, 1);
      } else {
        newStatus.push(status);
      }
      
      return { ...prev, status: newStatus };
    });
  };
  
  const selectFamilyGroup = (group: string) => {
    setFilters(prev => ({
      ...prev,
      familyGroup: prev.familyGroup === group ? '' : group
    }));
  };
  
  const handleApply = () => {
    onApply(filters);
  };
  
  const handleReset = () => {
    setFilters({
      status: [],
      familyGroup: '',
    });
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'stable': return 'No Abrigo';
      case 'atrisk': return 'Área de Risco';
      case 'critical': return 'Estado Crítico';
      default: return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return '#4CAF50';
      case 'atrisk': return '#FDD835';
      case 'critical': return '#E53935';
      default: return '#CCCCCC';
    }
  };
  
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={styles.headerTitleContainer}>
                  <Filter size={20} color="#FFFFFF" />
                  <Text style={styles.modalTitle}>Filtros</Text>
                </View>
                <TouchableOpacity onPress={onClose}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.sectionTitle}>Status</Text>
                <View style={styles.statusButtonsContainer}>
                  {['stable', 'atrisk', 'critical'].map(status => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        filters.status.includes(status) && {
                          backgroundColor: getStatusColor(status)
                        }
                      ]}
                      onPress={() => toggleStatus(status)}
                    >
                      {filters.status.includes(status) && (
                        <Check 
                          size={16} 
                          color="#FFFFFF" 
                          style={styles.checkIcon} 
                        />
                      )}
                      <Text style={[
                        styles.statusButtonText,
                        filters.status.includes(status) && styles.statusButtonTextActive
                      ]}>
                        {getStatusLabel(status)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {availableFamilyGroups.length > 0 && (
                <View style={styles.filterSection}>
                  <Text style={styles.sectionTitle}>Grupo Familiar</Text>
                  <FlatList
                    data={availableFamilyGroups}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.familyGroupButton,
                          filters.familyGroup === item && styles.familyGroupButtonActive
                        ]}
                        onPress={() => selectFamilyGroup(item)}
                      >
                        {filters.familyGroup === item && (
                          <Check 
                            size={16} 
                            color="#FFFFFF" 
                            style={styles.checkIcon} 
                          />
                        )}
                        <Text style={[
                          styles.familyGroupText,
                          filters.familyGroup === item && styles.familyGroupTextActive
                        ]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.familyGroupsList}
                  />
                </View>
              )}
              
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.resetButton}
                  onPress={handleReset}
                >
                  <Text style={styles.resetButtonText}>Limpar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.applyButton}
                  onPress={handleApply}
                >
                  <Text style={styles.applyButtonText}>Aplicar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#303030',
    borderRadius: 8,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#CCCCCC',
    marginBottom: 12,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424242',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  checkIcon: {
    marginRight: 4,
  },
  statusButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#CCCCCC',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
  familyGroupsList: {
    paddingVertical: 4,
  },
  familyGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424242',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  familyGroupButtonActive: {
    backgroundColor: '#1976D2',
  },
  familyGroupText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#CCCCCC',
  },
  familyGroupTextActive: {
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  resetButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#CCCCCC',
  },
  applyButton: {
    backgroundColor: '#E53935',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  applyButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
});