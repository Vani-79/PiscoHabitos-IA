import React, { useState, useMemo } from 'react';
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
import { DatePickerModal } from '../components/DatePickerModal';
import {
  Gender,
  PatientRegistrationForm,
  MySqlPatientRecord,
} from '../types/patient';

interface PatientRegisterScreenProps {
  onBack: () => void;
  onNavigateToLogin: () => void;
  onRegisterSuccess: (record: MySqlPatientRecord) => void;
}

export const PatientRegisterScreen: React.FC<PatientRegisterScreenProps> = ({
  onBack,
  onNavigateToLogin,
  onRegisterSuccess,
}) => {
  const [form, setForm] = useState<PatientRegistrationForm>({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    edad: '',
    fechaNacimiento: '',
    genero: 'femenino',
    fechaPrimeraSesion: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para abrir los modales de calendario
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [showSessionDatePicker, setShowSessionDatePicker] = useState(false);

  const updateField = (field: keyof PatientRegistrationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Validación estricta de requisitos de contraseña
  const passwordChecks = useMemo(() => {
    const pwd = form.password;
    return {
      hasMinLength: pwd.length >= 8,
      hasUppercase: /[A-ZÁÉÍÓÚÑ]/.test(pwd),
      hasLowercase: /[a-záéíóúñ]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/]/.test(pwd),
    };
  }, [form.password]);

  const isPasswordValid = useMemo(() => {
    return (
      passwordChecks.hasMinLength &&
      passwordChecks.hasUppercase &&
      passwordChecks.hasLowercase &&
      passwordChecks.hasNumber &&
      passwordChecks.hasSpecialChar
    );
  }, [passwordChecks]);

  const passwordsMatch = useMemo(() => {
    return form.password.length > 0 && form.password === form.confirmPassword;
  }, [form.password, form.confirmPassword]);

  // Selección de Fecha de Nacimiento desde el modal de calendario
  const handleSelectBirthDate = (formattedDate: string, dateObj: Date) => {
    // Cálculo automático de la edad
    const today = new Date();
    let calculatedAge = today.getFullYear() - dateObj.getFullYear();
    const m = today.getMonth() - dateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateObj.getDate())) {
      calculatedAge--;
    }

    setForm((prev) => ({
      ...prev,
      fechaNacimiento: formattedDate,
      edad: calculatedAge >= 0 ? String(calculatedAge) : '',
    }));
  };

  // Selección de Fecha de Primera Sesión desde el modal de calendario
  const handleSelectSessionDate = (formattedDate: string) => {
    setForm((prev) => ({
      ...prev,
      fechaPrimeraSesion: formattedDate,
    }));
  };

  const handleRegister = () => {
    // 1. Validación de campos obligatorios básicos
    if (
      !form.nombre.trim() ||
      !form.apellidoPaterno.trim() ||
      !form.apellidoMaterno.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      Alert.alert('Datos incompletos', 'Por favor complete todos los campos obligatorios para continuar.');
      return;
    }

    // 2. Validación de Correo Electrónico (debe contener '@')
    if (!form.email.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      Alert.alert('Correo inválido', 'El correo electrónico debe contener un "@" y un dominio válido (ej. usuario@email.com).');
      return;
    }

    // 3. Validación de Contraseña
    if (!isPasswordValid) {
      Alert.alert(
        'Contraseña no segura',
        'La contraseña debe tener al menos 8 caracteres, incluir letras, números, al menos una mayúscula y un carácter especial.'
      );
      return;
    }

    // 4. Validación de Coincidencia de Contraseñas
    if (form.password !== form.confirmPassword) {
      Alert.alert(
        'Contraseñas no coinciden',
        'La confirmación de contraseña debe coincidir exactamente con la contraseña ingresada.'
      );
      return;
    }

    // 5. Validación de fechas
    if (!form.fechaNacimiento) {
      Alert.alert('Fecha requerida', 'Por favor seleccione su fecha de nacimiento en el calendario.');
      return;
    }
    if (!form.fechaPrimeraSesion) {
      Alert.alert('Fecha requerida', 'Por favor seleccione la fecha de su primera sesión.');
      return;
    }

    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // Objeto estructurado con tipos nativos para MySQL (`pacientes`)
    const mySqlPatientRecord: MySqlPatientRecord = {
      nombre: form.nombre.trim(),
      apellido_paterno: form.apellidoPaterno.trim(),
      apellido_materno: form.apellidoMaterno.trim(),
      edad: parseInt(form.edad, 10) || 0,
      fecha_nacimiento: form.fechaNacimiento,     // Columna DATE en MySQL
      genero: form.genero,                         // ENUM('masculino','femenino','otro')
      fecha_primera_sesion: form.fechaPrimeraSesion, // Columna DATE en MySQL
      email: form.email.trim().toLowerCase(),
      password_hash: form.password,                // Se encriptará con hash en backend
      created_at: createdAt,                       // DATETIME en MySQL
    };

    console.log('Registro de paciente validado para MySQL:', mySqlPatientRecord);
    onRegisterSuccess(mySqlPatientRecord);
  };

  const genderOptions: { key: Gender; label: string }[] = [
    { key: 'femenino', label: 'Femenino' },
    { key: 'masculino', label: 'Masculino' },
    { key: 'otro', label: 'Otro' },
  ];

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

          {/* Encabezado Institucional */}
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

          {/* Tarjeta de Formulario de Registro */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Crear Cuenta</Text>
            <Text style={styles.cardSubtitle}>Complete sus datos de paciente</Text>

            {/* Email con validación de @ */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Email <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  form.email.length > 0 && !form.email.includes('@') && styles.inputErrorBorder,
                ]}
                placeholder="Tuemail@email.com"
                placeholderTextColor="#9CA3AF"
                value={form.email}
                onChangeText={(text) => updateField('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {form.email.length > 0 && !form.email.includes('@') && (
                <Text style={styles.fieldErrorText}>El correo debe contener un '@'</Text>
              )}
            </View>

            {/* Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Contraseña <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={form.password}
                  onChangeText={(text) => updateField('password', text)}
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

              {/* Guía visual de requisitos de contraseña */}
              <View style={styles.pwdRequirementsBox}>
                <Text style={styles.pwdReqTitle}>Requisitos de la contraseña:</Text>
                <Text style={[styles.pwdReqItem, passwordChecks.hasMinLength ? styles.pwdReqMet : styles.pwdReqUnmet]}>
                  {passwordChecks.hasMinLength ? '✓' : '•'} Mínimo 8 caracteres
                </Text>
                <Text style={[styles.pwdReqItem, passwordChecks.hasUppercase ? styles.pwdReqMet : styles.pwdReqUnmet]}>
                  {passwordChecks.hasUppercase ? '✓' : '•'} Al menos una letra mayúscula (A-Z)
                </Text>
                <Text style={[styles.pwdReqItem, passwordChecks.hasLowercase ? styles.pwdReqMet : styles.pwdReqUnmet]}>
                  {passwordChecks.hasLowercase ? '✓' : '•'} Al menos una letra minúscula (a-z)
                </Text>
                <Text style={[styles.pwdReqItem, passwordChecks.hasNumber ? styles.pwdReqMet : styles.pwdReqUnmet]}>
                  {passwordChecks.hasNumber ? '✓' : '•'} Al menos un número (0-9)
                </Text>
                <Text style={[styles.pwdReqItem, passwordChecks.hasSpecialChar ? styles.pwdReqMet : styles.pwdReqUnmet]}>
                  {passwordChecks.hasSpecialChar ? '✓' : '•'} Al menos un carácter especial (!@#$%...)
                </Text>
              </View>
            </View>

            {/* Confirmar Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Confirmar Contraseña <Text style={styles.requiredStar}>*</Text>
              </Text>
              <View
                style={[
                  styles.passwordInputWrapper,
                  form.confirmPassword.length > 0 &&
                  (passwordsMatch ? styles.inputSuccessBorder : styles.inputErrorBorder),
                ]}
              >
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={form.confirmPassword}
                  onChangeText={(text) => updateField('confirmPassword', text)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeIconButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {form.confirmPassword.length > 0 && (
                <Text
                  style={[
                    styles.matchFeedbackText,
                    passwordsMatch ? styles.matchSuccessText : styles.matchErrorText,
                  ]}
                >
                  {passwordsMatch
                    ? '✓ Las contraseñas coinciden exactamente'
                    : '✗ Las contraseñas no coinciden'}
                </Text>
              )}
            </View>

            {/* Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Nombre <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Valentina"
                placeholderTextColor="#9CA3AF"
                value={form.nombre}
                onChangeText={(text) => updateField('nombre', text)}
              />
            </View>

            {/* Apellido Paterno */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Apellido Paterno <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. Pérez"
                placeholderTextColor="#9CA3AF"
                value={form.apellidoPaterno}
                onChangeText={(text) => updateField('apellidoPaterno', text)}
              />
            </View>

            {/* Apellido Materno */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Apellido Materno <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ej. González"
                placeholderTextColor="#9CA3AF"
                value={form.apellidoMaterno}
                onChangeText={(text) => updateField('apellidoMaterno', text)}
              />
            </View>

            {/* Selector de Fecha de Nacimiento tipo Calendario */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Fecha de Nacimiento <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.datePickerTrigger}
                onPress={() => setShowBirthDatePicker(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="calendar" size={20} color="#0F613B" style={styles.dateIcon} />
                <Text
                  style={[
                    styles.datePickerValueText,
                    !form.fechaNacimiento && styles.datePickerPlaceholder,
                  ]}
                >
                  {form.fechaNacimiento || 'Tocar para seleccionar en el calendario'}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Fila: Edad (calculada automáticamente o editable) y Género */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.inputLabel}>Edad</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. 26"
                  placeholderTextColor="#9CA3AF"
                  value={form.edad}
                  onChangeText={(text) => updateField('edad', text)}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 2 }]}>
                <Text style={styles.inputLabel}>
                  Género <Text style={styles.requiredStar}>*</Text>
                </Text>
                <View style={styles.genderContainer}>
                  {genderOptions.map((item) => {
                    const isSelected = form.genero === item.key;
                    return (
                      <TouchableOpacity
                        key={item.key}
                        style={[
                          styles.genderOption,
                          isSelected && styles.genderOptionActive,
                        ]}
                        onPress={() => updateField('genero', item.key)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.genderOptionText,
                            isSelected && styles.genderOptionTextActive,
                          ]}
                          numberOfLines={1}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Selector de Fecha de Primera Sesión tipo Calendario */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Fecha de Primera Sesión <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.datePickerTrigger}
                onPress={() => setShowSessionDatePicker(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="calendar-outline" size={20} color="#0F613B" style={styles.dateIcon} />
                <Text
                  style={[
                    styles.datePickerValueText,
                    !form.fechaPrimeraSesion && styles.datePickerPlaceholder,
                  ]}
                >
                  {form.fechaPrimeraSesion || 'Tocar para seleccionar en el calendario'}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Modal de Calendario con Selector Rápido de Año para Fecha de Nacimiento (Hasta 2010) */}
            <DatePickerModal
              visible={showBirthDatePicker}
              title="Fecha de Nacimiento"
              initialDate={form.fechaNacimiento || '2000-01-01'}
              maxDate={new Date(2010, 11, 31)}
              onClose={() => setShowBirthDatePicker(false)}
              onSelectDate={handleSelectBirthDate}
            />

            {/* Modal de Calendario con Selector Rápido de Año para Fecha de Primera Sesión (Hasta la fecha de hoy del dispositivo) */}
            <DatePickerModal
              visible={showSessionDatePicker}
              title="Fecha de Primera Sesión"
              initialDate={form.fechaPrimeraSesion || new Date().toISOString().split('T')[0]}
              maxDate={new Date()}
              onClose={() => setShowSessionDatePicker(false)}
              onSelectDate={handleSelectSessionDate}
            />

            {/* Botón Registrarse */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!isPasswordValid || !passwordsMatch || !form.email.includes('@')) &&
                styles.submitButtonDisabled,
              ]}
              onPress={handleRegister}
              activeOpacity={0.85}
            >
              <Text style={styles.submitButtonText}>Registrarse</Text>
            </TouchableOpacity>

            {/* Enlace para Iniciar Sesión si ya tiene cuenta */}
            <View style={styles.bottomLinks}>
              <Text style={styles.haveAccountText}>¿Ya tienes una cuenta?</Text>
              <TouchableOpacity onPress={onNavigateToLogin}>
                <Text style={styles.loginLinkText}> Iniciar sesión</Text>
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
    paddingBottom: 220, // Amplitud suficiente para que el teclado no tape ningún input
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 26,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#0E5C3A',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#4A5568',
    marginBottom: 6,
  },
  requiredStar: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
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
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  eyeIconButton: {
    padding: 6,
  },
  inputErrorBorder: {
    borderColor: '#EF4444',
  },
  inputSuccessBorder: {
    borderColor: '#22C55E',
  },
  fieldErrorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '500',
  },
  pwdRequirementsBox: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  pwdReqTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 4,
  },
  pwdReqItem: {
    fontSize: 11.5,
    marginVertical: 1.5,
    fontWeight: '500',
  },
  pwdReqMet: {
    color: '#16A34A',
    fontWeight: '600',
  },
  pwdReqUnmet: {
    color: '#9CA3AF',
  },
  matchFeedbackText: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },
  matchSuccessText: {
    color: '#16A34A',
  },
  matchErrorText: {
    color: '#EF4444',
  },
  datePickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  dateIcon: {
    marginRight: 10,
  },
  datePickerValueText: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  datePickerPlaceholder: {
    color: '#9CA3AF',
    fontWeight: 'normal',
  },
  genderContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 3,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 10,
  },
  genderOptionActive: {
    backgroundColor: '#0F613B',
  },
  genderOptionText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#6B7280',
  },
  genderOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: '#0F613B',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
    shadowColor: '#0F613B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  bottomLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  haveAccountText: {
    fontSize: 13.5,
    color: '#6B7280',
  },
  loginLinkText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0E5C3A',
  },
});
