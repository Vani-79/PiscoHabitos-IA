import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface WelcomeScreenProps {
  onSelectPatient: () => void;
  onSelectPsychologist?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectPatient,
  onSelectPsychologist,
}) => {
  const handlePsychologistPress = () => {
    if (onSelectPsychologist) {
      onSelectPsychologist();
    } else {
      Alert.alert(
        'Panel de Psicólogo',
        'El módulo para profesionales de la salud mental estará disponible próximamente.',
        [{ text: 'Entendido', style: 'default' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Sección Superior: Logo Central */}
        <View style={styles.logoSection}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />

          {/* Título con los colores exactos: Psico en verde oscuro, Hábitos-IA en teal */}
          <Text style={styles.brandTitle}>
            <Text style={styles.titlePsico}>Psico</Text>
            <Text style={styles.titleHabitos}>Hábitos-IA</Text>
          </Text>

          {/* Slogan institucional */}
          <Text style={styles.sloganText}>Tu bienestar, un día a la vez.</Text>
        </View>

        {/* Sección Inferior: Botones de Selección de Perfil */}
        <View style={styles.buttonSection}>
          <Text style={styles.rolePrompt}>Selecciona tu perfil para ingresar:</Text>

          <TouchableOpacity
            style={styles.patientButton}
            onPress={onSelectPatient}
            activeOpacity={0.85}
          >
            <Ionicons name="person" size={22} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.patientButtonText}>Paciente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.psychologistButton}
            onPress={handlePsychologistPress}
            activeOpacity={0.85}
          >
            <Ionicons name="medkit-outline" size={22} color="#0E5C3A" style={styles.buttonIcon} />
            <Text style={styles.psychologistButtonText}>Psicólogo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  logoImage: {
    width: 240,
    height: 240,
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  titlePsico: {
    color: '#0E5C3A', // Verde bosque oscuro idéntico a la imagen
  },
  titleHabitos: {
    color: '#268D77', // Verde teal / esmeralda idéntico a la imagen
  },
  sloganText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0E5C3A',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  rolePrompt: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6A8296',
    marginBottom: 16,
    textAlign: 'center',
  },
  patientButton: {
    backgroundColor: '#0F613B',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: '#0F613B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  patientButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  psychologistButton: {
    backgroundColor: '#E4EDE7',
    borderWidth: 1.5,
    borderColor: '#0F613B',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
  },
  psychologistButtonText: {
    color: '#0E5C3A',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonIcon: {
    marginRight: 10,
  },
});
