import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { DailyCheckInScreen } from './src/screens/DailyCheckInScreen';
import { PsychologistDashboardScreen } from './src/screens/PsychologistDashboardScreen';
import { RegisterPatientScreen } from './src/screens/RegisterPatientScreen';
import { UserRole } from './src/constants/auth';
import { MySqlPatientRecord } from './src/types/patient';

export type AppScreen =
  | 'welcome'
  | 'login'
  | 'habits'
  | 'psychologist-dashboard'
  | 'psychologist-register-patient';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [activeUserName, setActiveUserName] = useState<string>('Carlos');

  const handleLoginSuccess = (email: string, role: UserRole, name: string) => {
    setActiveUserName(name);
    if (role === 'psicologo') {
      setCurrentScreen('psychologist-dashboard');
    } else {
      setCurrentScreen('habits');
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onStartLogin={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'login' && (
        <LoginScreen
          onBack={() => setCurrentScreen('welcome')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentScreen === 'habits' && (
        <DailyCheckInScreen
          userName={activeUserName}
          onBack={() => setCurrentScreen('welcome')}
        />
      )}

      {currentScreen === 'psychologist-dashboard' && (
        <PsychologistDashboardScreen
          doctorName={activeUserName}
          onLogout={() => setCurrentScreen('welcome')}
          onRegisterPatient={() => setCurrentScreen('psychologist-register-patient')}
        />
      )}

      {currentScreen === 'psychologist-register-patient' && (
        <RegisterPatientScreen
          onBack={() => setCurrentScreen('psychologist-dashboard')}
          onRegisterSuccess={(_record: MySqlPatientRecord) => {
            setCurrentScreen('psychologist-dashboard');
          }}
        />
      )}
    </SafeAreaProvider>
  );
}