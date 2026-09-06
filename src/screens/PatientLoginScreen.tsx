import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface PatientLoginScreenProps {
  onBack: () => void;
  onNavigateToRegister: () => void;
  onLoginSuccess: (email: string) => void;
}

export const PatientLoginScreen: React.FC<PatientLoginScreenProps> = ({
  onBack,
  onNavigateToRegister,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    if (!email.trim()) {
      Alert.alert('Email requerido', 'Por favor ingresa tu correo electrónico.');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Email inválido', 'El correo electrónico debe contener un "@".');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Contraseña requerida', 'Por favor ingresa tu contraseña.');
      return;
    }

    // Aquí se conectará la autenticación con la base de datos MySQL (SELECT * FROM pacientes WHERE email = ?)
    console.log('Login iniciado para:', email, 'Recuérdame:', rememberMe);
    onLoginSuccess(email);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Botón Volver */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#0F613B" />
          </TouchableOpacity>

          {/* Encabezado Institucional idéntico a la imagen */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.brandTitle}>
              <Text style={styles.titlePsico}>Psico</Text>
              <Text style={styles.titleHabitos}>Hábitos-IA</Text>
            </Text>
            <Text style={styles.sloganText}>Tu bienestar, un día a la vez.</Text>
          </View>

          {/* Tarjeta de Inicio de Sesión idéntica a la imagen */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Bienvenido</Text>
            <Text style={styles.cardSubtitle}>Inicie sesión para continuar</Text>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Tuemail@email.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeIconButton}
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Checkbox Recuérdame */}
            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.rememberText}>Recuérdame</Text>
            </TouchableOpacity>

            {/* Botón Entrar */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.submitButtonText}>Entrar</Text>
            </TouchableOpacity>

            {/* Enlaces Inferiores: Olvidaste contraseña y Crear cuenta */}
            <View style={styles.bottomLinksRow}>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'Recuperar Contraseña',
                    'Te enviaremos un enlace de recuperación a tu correo electrónico registrado.'
                  )
                }
              >
                <Text style={styles.forgotPasswordText}>¿Has olvidado tu contraseña?</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onNavigateToRegister}>
                <Text style={styles.createAccountText}>Crear cuenta</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 160,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 95,
    height: 95,
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  titlePsico: {
    color: '#0E5C3A',
  },
  titleHabitos: {
    color: '#268D77',
  },
  sloganText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0E5C3A',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#2D3748',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14.5,
    color: '#718096',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1F2937',
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1F2937',
  },
  eyeIconButton: {
    padding: 6,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#0F613B',
    borderColor: '#0F613B',
  },
  rememberText: {
    fontSize: 13.5,
    color: '#64748B',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#0F613B',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 22,
    shadowColor: '#0F613B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  bottomLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#0E5C3A',
    fontWeight: '500',
  },
  createAccountText: {
    fontSize: 13,
    color: '#0E5C3A',
    fontWeight: '700',
  },
});
