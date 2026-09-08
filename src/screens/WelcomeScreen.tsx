import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface WelcomeScreenProps {
  onStartLogin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartLogin }) => {
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

        {/* Sección Inferior: Botón Único de Inicio de Sesión */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={onStartLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            <Ionicons name="arrow-forward" size={22} color="#FFFFFF" style={styles.buttonIcon} />
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
    color: '#0E5C3A',
  },
  titleHabitos: {
    color: '#268D77',
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
  loginButton: {
    backgroundColor: '#0F613B',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: '#0F613B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});
