import { Colors } from '@/constants/Colors';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'expo-router';
import { ChevronRight, CircleHelp, FileText, Info, LogOut, Shield, Users } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MoreScreen() {
  const router = useRouter();
  const { logout } = useUser();


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
            router.replace('/(auth)');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <View style={styles.settingIconContainer}>
              <Users size={22} color={Colors.white} />
            </View>
            <Text style={styles.settingLabel}>Sobre a Equipe</Text>
          </View>
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <View style={styles.settingIconContainer}>
              <FileText size={22} color={Colors.white} />
            </View>
            <Text style={styles.settingLabel}>Termos de Uso</Text>
          </View>
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <View style={styles.settingIconContainer}>
              <Info size={22} color={Colors.white} />
            </View>
            <Text style={styles.settingLabel}>Sobre o Aplicativo</Text>
          </View>
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingContent}>
            <View style={styles.settingIconContainer}>
              <CircleHelp size={22} color={Colors.white} />
            </View>
            <Text style={styles.settingLabel}>Ajuda</Text>
          </View>
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>
      </View>

      <View style={styles.versionContainer}>
        <Shield size={18} color={Colors.gray[400]} />
        <Text style={styles.versionText}>GEF - BioTag v1.0.0</Text>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <LogOut size={20} color={Colors.white} />
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: Colors.darkGray,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: Colors.gray[800],
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[700],
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[700],
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
    backgroundColor: Colors.gray[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.white,
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[400],
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[400],
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: Colors.danger,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
    marginLeft: 8,
  },
});