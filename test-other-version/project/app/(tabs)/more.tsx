import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, Switch, Alert,
  ScrollView, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut, Settings, CircleHelp as HelpCircle, Info, RefreshCw, Database, Users, FileText, Shield, ChevronRight } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useVictims } from '@/hooks/useVictims';
import { useConnectivity } from '@/hooks/useConnectivity';

export default function MoreScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { victims, syncWithServer, isLoading, clearAllData } = useVictims();
  const { isConnected } = useConnectivity();
  
  const [offlineMode, setOfflineMode] = useState(!isConnected);
  
  const handleLogout = () => {
    Alert.alert(
      'Confirmar Saída',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          }
        }
      ]
    );
  };
  
  const handleClearData = () => {
    Alert.alert(
      'Atenção!',
      'Esta ação irá excluir TODOS os dados de vítimas armazenados no dispositivo. Esta ação não pode ser desfeita!',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar Dados', 
          style: 'destructive',
          onPress: () => {
            clearAllData();
            Alert.alert('Sucesso', 'Todos os dados foram excluídos');
          }
        }
      ]
    );
  };
  
  const handleToggleOfflineMode = (value) => {
    setOfflineMode(value);
    
    if (!value && isConnected) {
      // Going from offline to online, offer to sync
      Alert.alert(
        'Modo Online Ativado',
        'Deseja sincronizar os dados agora?',
        [
          { text: 'Depois' },
          { text: 'Sincronizar', onPress: syncWithServer }
        ]
      );
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações do Aplicativo</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <View style={styles.settingIconContainer}>
              <Settings size={22} color="#CCCCCC" />
            </View>
            <Text style={styles.settingLabel}>Modo Offline</Text>
          </View>
          <Switch
            value={offlineMode}
            onValueChange={handleToggleOfflineMode}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={syncWithServer}
          disabled={!isConnected || isLoading}
        >
          <View style={styles.settingContent}>
            <View style={styles.settingIconContainer}>
              <RefreshCw size={22} color="#CCCCCC" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Sincronizar Dados</Text>
              <Text style={styles.settingDescription}>
                {isConnected 
                  ? `${victims.filter(v => v.needsSync).length} registros pendentes`
                  : 'Sem conexão'}
              </Text>
            </View>
          </View>
          {isLoading ? (
            <ActivityIndicator size="small" color="#E53935" />
          ) : (
            <ChevronRight size={20} color="#AAAAAA" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleClearData}
        >
          <View style={styles.settingContent}>
            <View style={styles.settingIconContainer}>
              <Database size={22} color="#CCCCCC" />
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>Limpar Dados Locais</Text>
              <Text style={styles.settingDescription}>
                Exclui todos os dados armazenados no dispositivo
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#AAAAAA" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <View style={styles.settingIconContainer}>
              <Users size={22} color="#CCCCCC" />
            </View>
            <Text style={styles.settingLabel}>Sobre a Equipe</Text>
          </View>
          <ChevronRight size={20} color="#AAAAAA" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <View style={styles.settingIconContainer}>
              <FileText size={22} color="#CCCCCC" />
            </View>
            <Text style={styles.settingLabel}>Termos de Uso</Text>
          </View>
          <ChevronRight size={20} color="#AAAAAA" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <View style={styles.settingIconContainer}>
              <Info size={22} color="#CCCCCC" />
            </View>
            <Text style={styles.settingLabel}>Sobre o Aplicativo</Text>
          </View>
          <ChevronRight size={20} color="#AAAAAA" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <View style={styles.settingIconContainer}>
              <HelpCircle size={22} color="#CCCCCC" />
            </View>
            <Text style={styles.settingLabel}>Ajuda</Text>
          </View>
          <ChevronRight size={20} color="#AAAAAA" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.versionContainer}>
        <Shield size={18} color="#AAAAAA" />
        <Text style={styles.versionText}>GEF - BioTag v1.0.0</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <LogOut size={20} color="#FFFFFF" />
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
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
  section: {
    backgroundColor: '#424242',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#505050',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#505050',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#AAAAAA',
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#AAAAAA',
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: '#E53935',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});