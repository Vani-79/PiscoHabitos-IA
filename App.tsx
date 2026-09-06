import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { PatientLoginScreen } from './src/screens/PatientLoginScreen';
import { PatientRegisterScreen } from './src/screens/PatientRegisterScreen';
import { DailyCheckInScreen } from './src/screens/DailyCheckInScreen';
import { MySqlPatientRecord } from './src/types/patient';

export type AppScreen = 'welcome' | 'login' | 'register' | 'habits';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [activePatientName, setActivePatientName] = useState<string>('Vani');

  const handleRegisterSuccess = (record: MySqlPatientRecord) => {
    setActivePatientName(record.nombre);
    setCurrentScreen('habits');
  };

  const handleLoginSuccess = (email: string) => {
    // Si inicia sesión, extraemos el nombre del email o mantenemos el predeterminado
    const nameFromEmail = email.split('@')[0];
    const capitalized = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    setActivePatientName(capitalized || 'Vani');
    setCurrentScreen('habits');
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onSelectPatient={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'login' && (
        <PatientLoginScreen
          onBack={() => setCurrentScreen('welcome')}
          onNavigateToRegister={() => setCurrentScreen('register')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentScreen === 'register' && (
        <PatientRegisterScreen
          onBack={() => setCurrentScreen('login')}
          onNavigateToLogin={() => setCurrentScreen('login')}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {currentScreen === 'habits' && (
        <DailyCheckInScreen
          userName={activePatientName}
          onBack={() => setCurrentScreen('welcome')}
        />
      )}
    </SafeAreaProvider>
  );
}