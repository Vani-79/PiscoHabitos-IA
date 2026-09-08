import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface PsychologistDashboardScreenProps {
  doctorName: string;
  onLogout: () => void;
}

export const PsychologistDashboardScreen: React.FC<PsychologistDashboardScreenProps> = ({
  doctorName,
  onLogout,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Barra Superior */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.portalTag}>PORTAL DEL ESPECIALISTA</Text>
          <Text style={styles.doctorName}>{doctorName}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={22} color="#DC2626" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner de Bienvenida */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerIconContainer}>
            <Ionicons name="medkit" size={28} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Panel Clínico Psicohábitos</Text>
            <Text style={styles.bannerSubtitle}>
              Monitoreo y seguimiento en tiempo real de los hábitos de tus pacientes.
            </Text>
          </View>
        </View>

        {/* Métricas Resumen */}
        <Text style={styles.sectionTitle}>Resumen de hoy</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIconBg, { backgroundColor: '#E4EDE7' }]}>
              <Ionicons name="people" size={22} color="#0F613B" />
            </View>
            <Text style={styles.metricNumber}>12</Text>
            <Text style={styles.metricLabel}>Pacientes Activos</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconBg, { backgroundColor: '#E6F4F1' }]}>
              <Ionicons name="checkmark-circle" size={22} color="#268D77" />
            </View>
            <Text style={styles.metricNumber}>8</Text>
            <Text style={styles.metricLabel}>Check-ins Hoy</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconBg, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="alert-circle" size={22} color="#D97706" />
            </View>
            <Text style={styles.metricNumber}>2</Text>
            <Text style={styles.metricLabel}>Alertas Estrés</Text>
          </View>
        </View>

        {/* Lista Rápida de Pacientes */}
        <Text style={styles.sectionTitle}>Pacientes Recientes</Text>
        
        <View style={styles.patientCard}>
          <View style={styles.patientAvatar}>
            <Text style={styles.patientInitials}>CP</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.patientName}>Carlos (Paciente 1)</Text>
            <Text style={styles.patientSubtext}>Check-in completado • Sueño: 8h</Text>
          </View>
          <View style={styles.statusBadgeGood}>
            <Text style={styles.statusTextGood}>Estable</Text>
          </View>
        </View>

        <View style={styles.patientCard}>
          <View style={styles.patientAvatar}>
            <Text style={styles.patientInitials}>VP</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.patientName}>Vani</Text>
            <Text style={styles.patientSubtext}>Check-in completado • Hidratación: 100%</Text>
          </View>
          <View style={styles.statusBadgeGood}>
            <Text style={styles.statusTextGood}>Estable</Text>
          </View>
        </View>

        <View style={styles.patientCard}>
          <View style={styles.patientAvatar}>
            <Text style={styles.patientInitials}>AL</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.patientName}>Ana López</Text>
            <Text style={styles.patientSubtext}>Nivel de ansiedad alto reportado</Text>
          </View>
          <View style={styles.statusBadgeAlert}>
            <Text style={styles.statusTextAlert}>Atención</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF9',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  portalTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#268D77',
    letterSpacing: 0.8,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F613B',
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    shadowColor: '#0F613B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '700',
  },
  bannerSubtitle: {
    color: '#D1E7DD',
    fontSize: 12.5,
    marginTop: 3,
    lineHeight: 17,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 26,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  metricIconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  metricLabel: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  patientAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E4EDE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patientInitials: {
    color: '#0F613B',
    fontSize: 14,
    fontWeight: '700',
  },
  patientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  patientSubtext: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  statusBadgeGood: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusTextGood: {
    color: '#15803D',
    fontSize: 11.5,
    fontWeight: '700',
  },
  statusBadgeAlert: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusTextAlert: {
    color: '#DC2626',
    fontSize: 11.5,
    fontWeight: '700',
  },
});
