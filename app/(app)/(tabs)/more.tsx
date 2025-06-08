import { Colors } from '@/constants/Colors';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'expo-router';
import { ChevronRight, CircleHelp, FileText, Info, LogOut, Shield, Users } from 'lucide-react-native';
import React from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MoreScreen() {
  const router = useRouter();
  const { logout } = useUser();

  const [modal, setModal] = React.useState<null | 'team' | 'terms' | 'about' | 'help'>(null);

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
      <InfoModal
        visible={modal === 'team'}
        onClose={() => setModal(null)}
        title="Sobre a Equipe"
      >
        <Text style={styles.modalText}>Eduardo Henrique Strapazzon Nagado - RM558158</Text>
        <Text style={styles.modalText}>Felipe Silva Maciel - RM555307</Text>
        <Text style={styles.modalText}>Gustavo Ramires Lazzuri - RM556772</Text>
      </InfoModal>

      <InfoModal
        visible={modal === 'terms'}
        onClose={() => setModal(null)}
        title="Termos de Uso"
      >
        <Text style={styles.modalText}>
          Este aplicativo é destinado ao gerenciamento de pacientes em situações de emergência, utilizando identificação por pulseira NFC. O uso é restrito a fins acadêmicos e demonstração. Nenhum dado real é coletado ou compartilhado.
        </Text>
      </InfoModal>

      <InfoModal
        visible={modal === 'about'}
        onClose={() => setModal(null)}
        title="Sobre o Aplicativo"
      >
        <Text style={styles.modalText}>
          GEF - BioTag é um projeto acadêmico desenvolvido para facilitar o registro e acompanhamento de pacientes em abrigos, utilizando tecnologia NFC e IoT para monitoramento de dados vitais.
        </Text>
      </InfoModal>

      <InfoModal
        visible={modal === 'help'}
        onClose={() => setModal(null)}
        title="Ajuda"
      >
        <Text style={styles.modalText}>
          Em caso de dúvidas, entre em contato:
        </Text>
        <Text style={styles.modalText}>rm558158@fiap.com.br</Text>
        <Text style={styles.modalText}>rm555307@fiap.com.br</Text>
        <Text style={styles.modalText}>rm556772@fiap.com.br</Text>
      </InfoModal>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>

        <TouchableOpacity style={styles.settingItem} onPress={() => setModal('team')}>
          <View style={styles.settingContent}>
            <View style={styles.settingIconContainer}>
              <Users size={22} color={Colors.white} />
            </View>
            <Text style={styles.settingLabel}>Sobre a Equipe</Text>
          </View>
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => setModal('terms')}>
          <View style={styles.settingContent}>
            <View style={styles.settingIconContainer}>
              <FileText size={22} color={Colors.white} />
            </View>
            <Text style={styles.settingLabel}>Termos de Uso</Text>
          </View>
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => setModal('about')}>
          <View style={styles.settingContent}>
            <View style={styles.settingIconContainer}>
              <Info size={22} color={Colors.white} />
            </View>
            <Text style={styles.settingLabel}>Sobre o Aplicativo</Text>
          </View>
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} onPress={() => setModal('help')}>
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

// Componente de Modal reutilizável
function InfoModal({ visible, onClose, title, children }: { visible: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView style={styles.modalScroll}>{children}</ScrollView>
          <Pressable style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentLarge: {
    backgroundColor: Colors.gray[800],
    borderRadius: 16,
    padding: 32,
    width: '95%',
    maxHeight: '85%',
    alignItems: 'center',
    elevation: 5,
  },
  modalScroll: {
    maxHeight: 400,
    width: '100%',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  modalButtonText: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
});