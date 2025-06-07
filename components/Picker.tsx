import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import React from 'react';

interface PickerItem {
  label: string;
  value: string;
}

interface PickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: PickerItem[];
  placeholder?: string;
}

export function Picker({ selectedValue, onValueChange, items, placeholder }: PickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  
  const selectedItem = items.find(item => item.value === selectedValue);
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.pickerButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[
          styles.pickerText,
          !selectedItem && styles.placeholderText
        ]}>
          {selectedItem ? selectedItem.label : placeholder || 'Selecione uma opção'}
        </Text>
        <ChevronDown size={20} color={Colors.gray[400]} />
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{placeholder || 'Selecione uma opção'}</Text>
            
            <FlatList
              data={items}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    item.value === selectedValue && styles.selectedItemText
                  ]}>
                    {item.label}
                  </Text>
                  
                  {item.value === selectedValue && (
                    <Check size={18} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              )}
              style={styles.modalList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.gray[700],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    height: 56,
  },
  pickerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.white,
  },
  placeholderText: {
    color: Colors.gray[400],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.gray[800],
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
    padding: 16,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalList: {
    maxHeight: 300,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[700],
  },
  modalItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.white,
  },
  selectedItemText: {
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
  },
});