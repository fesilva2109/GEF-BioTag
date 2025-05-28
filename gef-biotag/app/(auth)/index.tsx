import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@/hooks/useUser';
import { Lock, UserRound } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import React from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useUser();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(username, password);
      router.replace('/(app)/(tabs)');
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>GEF-BioTag</Text>
            <Text style={styles.logoSubtitle}>Gestão de Emergências e Fiscalização</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Acesso de Resgatista</Text>
            
            <View style={styles.inputContainer}>
              <UserRound size={20} color={Colors.gray[400]} />
              <TextInput
                style={styles.input}
                placeholder="Nome de usuário"
                placeholderTextColor={Colors.gray[400]}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock size={20} color={Colors.gray[400]} />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor={Colors.gray[400]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.emergencyLoginButton} onPress={() => router.replace('/(app)/(tabs)')}>
              <Text style={styles.emergencyLoginText}>Acesso de Emergência</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>Versão 1.0.0 - Modo de Emergência</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkGray
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoText: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: Colors.white,
    marginBottom: 8,
  },
  logoSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[300],
  },
  formContainer: {
    backgroundColor: Colors.gray[800],
    borderRadius: 12,
    padding: 24,
    width: '100%',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: Colors.white,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[700],
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.white,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 12,
  },
  errorText: {
    color: Colors.danger,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  emergencyLoginButton: {
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  emergencyLoginText: {
    color: Colors.warning,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  footer: {
    color: Colors.gray[400],
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});