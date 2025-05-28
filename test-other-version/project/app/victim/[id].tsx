import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, ScrollView, TouchableOpacity, 
  TextInput, Alert, ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Heart, User, Clock, CreditCard as Edit, Trash2, Save, X, MapPin, CircleAlert as AlertCircle, ClipboardCheck, Scan } from 'lucide-react-native';
import { useVictims } from '@/hooks/useVictims';

export default function VictimDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getVictimById, updateVictim, deleteVictim, isLoading } = useVictims();
  
  const [victim, setVictim] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  
  useEffect(() => {
    if (id) {
      const victimData = getVictimById(id);
      setVictim(victimData);
      setEditForm({ ...victimData });
    }
  }, [id, getVictimById]);
  
  if (!victim) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53935" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setEditForm({ ...victim });
    }
    setIsEditing(!isEditing);
  };
  
  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = async () => {
    try {
      await updateVictim({
        ...editForm,
        needsSync: true,
        lastUpdated: new Date().toISOString()
      });
      
      setVictim({
        ...editForm,
        needsSync: true,
        lastUpdated: new Date().toISOString()
      });
      
      setIsEditing(false);
      Alert.alert('Sucesso', 'Informações atualizadas com sucesso');
    } catch (error) {
      console.error('Error updating victim:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os dados');
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVictim(victim.id);
              Alert.alert('Sucesso', 'Registro excluído com sucesso', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error) {
              console.error('Error deleting victim:', error);
              Alert.alert('Erro', 'Não foi possível excluir o registro');
            }
          }
        }
      ]
    );
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'stable': return 'No Abrigo';
      case 'atrisk': return 'Área de Risco';
      case 'critical': return 'Estado Crítico';
      default: return 'Desconhecido';
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'stable': return '#4CAF50';
      case 'atrisk': return '#FDD835';
      case 'critical': return '#E53935';
      default: return '#CCCCCC';
    }
  };
  
  const getHeartRateStatus = (rate) => {
    if (!rate) return null;
    if (rate < 60) return { status: 'low', color: '#FDD835' };
    if (rate > 100) return { status: 'high', color: '#E53935' };
    return { status: 'normal', color: '#4CAF50' };
  };
  
  const heartRateInfo = getHeartRateStatus(victim.heartRate);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const simulateReadVitals = () => {
    // In a real app, this would connect to the NFC/RFID tag
    // For this demo, we'll simulate a reading
    
    Alert.alert('Lendo Pulseira', 'Simulando leitura de dados vitais...');
    
    setTimeout(() => {
      const mockHeartRate = Math.floor(Math.random() * (110 - 55) + 55);
      
      setEditForm(prev => ({
        ...prev,
        heartRate: mockHeartRate
      }));
      
      if (isEditing) {
        Alert.alert('Leitura Concluída', `Novos dados vitais recebidos: ${mockHeartRate} BPM`);
      } else {
        // Update directly if not in edit mode
        handleInputChange('heartRate', mockHeartRate);
        handleSave();
      }
    }, 1500);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Detalhes da Vítima',
          headerStyle: {
            backgroundColor: '#424242',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
          },
        }}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.idContainer}>
            <ClipboardCheck size={18} color="#CCCCCC" />
            <Text style={styles.idText}>ID: {victim.id}</Text>
          </View>
          
          <View style={styles.actionButtons}>
            {isEditing ? (
              <>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small\" color="#FFFFFF" />
                  ) : (
                    <Save size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={handleEditToggle}
                >
                  <X size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.editButton]}
                  onPress={handleEditToggle}
                >
                  <Edit size={20} color="#FFFFFF" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={handleDelete}
                >
                  <Trash2 size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <User size={20} color="#FFFFFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nome</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editForm.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Nome completo"
                  placeholderTextColor="#888888"
                />
              ) : (
                <Text style={styles.infoValue}>{victim.name}</Text>
              )}
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <MapPin size={20} color="#FFFFFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Localização</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editForm.location}
                  onChangeText={(value) => handleInputChange('location', value)}
                  placeholder="Endereço ou coordenadas"
                  placeholderTextColor="#888888"
                />
              ) : (
                <Text style={styles.infoValue}>{victim.location}</Text>
              )}
            </View>
          </View>
          
          {victim.familyGroup || isEditing ? (
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <User size={20} color="#FFFFFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Grupo Familiar</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.editInput}
                    value={editForm.familyGroup}
                    onChangeText={(value) => handleInputChange('familyGroup', value)}
                    placeholder="Identificação do grupo"
                    placeholderTextColor="#888888"
                  />
                ) : (
                  <Text style={styles.infoValue}>{victim.familyGroup}</Text>
                )}
              </View>
            </View>
          ) : null}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Status e Vitais</Text>
            
            <TouchableOpacity 
              style={styles.readVitalsButton}
              onPress={simulateReadVitals}
            >
              <Scan size={16} color="#FFFFFF" />
              <Text style={styles.readVitalsText}>Ler Pulseira</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoRow}>
            <View style={[
              styles.infoIconContainer,
              { backgroundColor: getStatusColor(victim.status) }
            ]}>
              <AlertCircle size={20} color="#FFFFFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Status</Text>
              {isEditing ? (
                <View style={styles.statusButtonsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton, 
                      editForm.status === 'stable' && styles.statusButtonStable
                    ]}
                    onPress={() => handleInputChange('status', 'stable')}
                  >
                    <Text style={styles.statusButtonText}>No Abrigo</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.statusButton, 
                      editForm.status === 'atrisk' && styles.statusButtonAtrisk
                    ]}
                    onPress={() => handleInputChange('status', 'atrisk')}
                  >
                    <Text style={styles.statusButtonText}>Área de Risco</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.statusButton, 
                      editForm.status === 'critical' && styles.statusButtonCritical
                    ]}
                    onPress={() => handleInputChange('status', 'critical')}
                  >
                    <Text style={styles.statusButtonText}>Crítico</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(victim.status) }
                ]}>
                  <Text style={styles.statusText}>
                    {getStatusLabel(victim.status)}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={[
              styles.infoIconContainer,
              heartRateInfo && { backgroundColor: heartRateInfo.color }
            ]}>
              <Heart size={20} color="#FFFFFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Batimentos Cardíacos</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editForm.heartRate ? editForm.heartRate.toString() : ''}
                  onChangeText={(value) => handleInputChange('heartRate', value.replace(/[^0-9]/g, ''))}
                  placeholder="BPM"
                  placeholderTextColor="#888888"
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.infoValue}>
                  {victim.heartRate 
                    ? `${victim.heartRate} BPM` 
                    : 'Não registrado'}
                </Text>
              )}
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIconContainer}>
              <Clock size={20} color="#FFFFFF" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Última Atualização</Text>
              <Text style={styles.infoValue}>
                {formatDate(victim.lastUpdated)}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          
          {isEditing ? (
            <TextInput
              style={[styles.editInput, styles.observationsInput]}
              value={editForm.observations}
              onChangeText={(value) => handleInputChange('observations', value)}
              placeholder="Informações adicionais sobre a vítima"
              placeholderTextColor="#888888"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          ) : (
            <Text style={styles.observationsText}>
              {victim.observations || 'Nenhuma observação registrada'}
            </Text>
          )}
        </View>
        
        {victim.needsSync && (
          <View style={styles.syncAlert}>
            <AlertCircle size={16} color="#FDD835" />
            <Text style={styles.syncAlertText}>
              Alterações pendentes de sincronização
            </Text>
          </View>
        )}
      </ScrollView>
    </>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#303030',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  idText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#CCCCCC',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#1976D2',
  },
  deleteButton: {
    backgroundColor: '#E53935',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#757575',
  },
  section: {
    backgroundColor: '#424242',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  readVitalsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555555',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  readVitalsText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#555555',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#AAAAAA',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  editInput: {
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  observationsInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  observationsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
  },
  statusButtonStable: {
    backgroundColor: '#4CAF50',
  },
  statusButtonAtrisk: {
    backgroundColor: '#FDD835',
  },
  statusButtonCritical: {
    backgroundColor: '#E53935',
  },
  statusButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  syncAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(253, 216, 53, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  syncAlertText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#FDD835',
    marginLeft: 8,
  },
});