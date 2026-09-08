import React, { useState, useRef, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { HabitKey, DailyHabitRatings, MySqlDailyHabitRecord } from '../types/habits';
import {
  HABIT_CATALOG,
  HABIT_KEYS,
  RATING_SCALE,
  INITIAL_HABITS_STATE,
  getRatingColor,
  getRatingLabel,
} from '../constants/habits';

interface DailyCheckInScreenProps {
  onBack?: () => void;
  onSaveRecord?: (record: MySqlDailyHabitRecord) => void;
  userName?: string;
}

export const DailyCheckInScreen: React.FC<DailyCheckInScreenProps> = ({
  onBack,
  onSaveRecord,
  userName = 'Vani',
}) => {

  // Fecha estipulada en formato estándar MySQL 'YYYY-MM-DD' (para columna tipo DATE)
  const recordDate = useMemo(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const [habits, setHabits] = useState<DailyHabitRatings>(INITIAL_HABITS_STATE);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeHabit, setActiveHabit] = useState<HabitKey | null>(null);
  const [rating, setRating] = useState<number | null>(null);

  const slideAnim = useRef(new Animated.Value(1)).current;

  const openHabitModal = (key: HabitKey) => {
    setActiveHabit(key);
    const currentRating = habits[key];
    setRating(currentRating);

    slideAnim.setValue(currentRating !== null ? currentRating : 1);
    setModalVisible(true);
  };

  const selectRating = (val: number) => {
    setRating(val);
    Animated.spring(slideAnim, {
      toValue: val,
      useNativeDriver: false,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const saveHabitResponse = () => {
    if (activeHabit && rating !== null) {
      setHabits((prev) => ({ ...prev, [activeHabit]: rating }));
      setModalVisible(false);
      setActiveHabit(null);
    }
  };

  const registeredCount = useMemo(
    () => Object.values(habits).filter((val) => val !== null).length,
    [habits]
  );

  const translateX = slideAnim.interpolate({
    inputRange: RATING_SCALE.map((item) => item.value),
    outputRange: ['0%', '100%', '200%', '300%', '400%'],
    extrapolate: 'clamp',
  });

  const indicatorColor = slideAnim.interpolate({
    inputRange: RATING_SCALE.map((item) => item.value),
    outputRange: RATING_SCALE.map((item) => item.color),
    extrapolate: 'clamp',
  });

  const handleConfirm = () => {
    if (registeredCount < 6) {
      Alert.alert(
        'Hábitos incompletos',
        `Debes registrar los 6 hábitos antes de poder confirmar el envío. Actualmente llevas ${registeredCount} de 6.`
      );
      return;
    }

    const now = new Date();
    const confirmedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // Registro estipulado con tipos nativos para MySQL (DATE y DATETIME)
    const mySqlRecord: MySqlDailyHabitRecord = {
      user_id: userName,
      evaluation_date: recordDate, // DATE en MySQL: 'YYYY-MM-DD'
      comida: habits.comida,
      ejercicio: habits.ejercicio,
      hidratacion: habits.hidratacion,
      ansiedad: habits.ansiedad,
      sueno: habits.sueno,
      estres: habits.estres,
      confirmed_at: confirmedAt,   // DATETIME en MySQL: 'YYYY-MM-DD HH:MM:SS'
    };

    console.log('Registro estipulado y preparado para MySQL:', mySqlRecord);

    if (onSaveRecord) {
      onSaveRecord(mySqlRecord);
    }

    setIsConfirmed(true);
    Alert.alert(
      '¡Hábitos Registrados!',
      'Tus hábitos del día han sido registrados exitosamente.',
      [{ text: 'Aceptar', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {onBack && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBack}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="arrow-back" size={24} color="#0F613B" />
              </TouchableOpacity>
            )}
            <View>
              <Text style={styles.greeting}>Hola, {userName}!</Text>
            </View>
          </View>
          <View style={styles.profileIcon}>
            <Ionicons name="person-outline" size={24} color="#666" />
          </View>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressNumber}>{registeredCount}/6</Text>
          <Text style={styles.progressText}>Hábitos registrados</Text>
        </View>

        <View style={styles.grid}>
          {HABIT_KEYS.map((key) => {
            const item = HABIT_CATALOG[key];
            const currentVal = habits[key];
            const cardColor = getRatingColor(currentVal);

            return (
              <TouchableOpacity
                key={key}
                style={styles.card}
                onPress={() => openHabitModal(key)}
                activeOpacity={0.7}
                disabled={isConfirmed}
              >
                <View style={styles.cardIconArea}>
                  {item.image ? (
                    <Image source={item.image} style={styles.habitImage} resizeMode="contain" />
                  ) : (
                    <Text style={styles.emoji}>{item.emoji}</Text>
                  )}
                </View>
                <View style={[styles.cardLabelArea, { backgroundColor: cardColor }]}>
                  <Text
                    style={[
                      styles.cardLabel,
                      currentVal !== null && styles.cardLabelActiveText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Botón Registrar Hábitos (desaparece completamente al ser presionado) */}
        {!isConfirmed && (
          <View style={styles.confirmationSection}>
            <TouchableOpacity
              style={[
                styles.globalConfirmButton,
                registeredCount < 6 && styles.globalConfirmDisabled,
              ]}
              disabled={registeredCount < 6}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.globalConfirmText,
                  registeredCount < 6 && styles.globalConfirmDisabledText,
                ]}
              >
                {registeredCount === 6
                  ? 'Registrar Hábitos'
                  : `Registrar`}
              </Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={22} color="#888" />
            </TouchableOpacity>

            {activeHabit && (
              <View style={styles.modalIconArea}>
                {HABIT_CATALOG[activeHabit].image ? (
                  <Image
                    source={HABIT_CATALOG[activeHabit].image}
                    style={styles.modalHabitImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.modalEmoji}>{HABIT_CATALOG[activeHabit].emoji}</Text>
                )}
              </View>
            )}

            <Text style={styles.questionText}>
              {activeHabit ? HABIT_CATALOG[activeHabit].question : '¿Cómo evalúas este concepto hoy?'}
            </Text>

            <View style={styles.segmentedControl}>
              <Animated.View
                style={[
                  styles.slidingIndicator,
                  {
                    opacity: rating === null ? 0 : 1,
                    transform: [{ translateX }],
                    backgroundColor: indicatorColor,
                  },
                ]}
              />

              {RATING_SCALE.map((item) => {
                const label = getRatingLabel(item.value, activeHabit);

                return (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.segmentButton}
                    onPress={() => selectRating(item.value)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.segmentLabel,
                        rating === item.value && styles.segmentLabelActive,
                      ]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.registerButton, rating === null && styles.registerButtonDisabled]}
              onPress={saveHabitResponse}
              disabled={rating === null}
            >
              <Text style={styles.registerButtonText}>Guardar</Text>
            </TouchableOpacity>

          </Pressable>
        </Pressable>
      </Modal>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="home-outline" size={32} color="#185c37" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="book-outline" size={32} color="#185c37" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.centerNavIcon}>
          <MaterialCommunityIcons name="brain" size={40} color="#185c37" />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons name="robot-outline" size={32} color="#185c37" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={32} color="#185c37" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EBEBEB' },
  scrollContent: { padding: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 12, padding: 4 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#6A8296' },
  date: { fontSize: 16, color: '#6A8296' },
  profileIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#D3D3D3', justifyContent: 'center', alignItems: 'center' },
  progressCard: { borderWidth: 1.5, borderColor: '#A5C1B3', borderRadius: 15, padding: 20, backgroundColor: '#E4EDE7', alignItems: 'center', marginBottom: 30 },
  progressNumber: { fontSize: 24, fontWeight: '500', color: '#7E9186' },
  progressText: { fontSize: 18, color: '#7E9186', marginTop: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '46%', borderWidth: 1.5, borderColor: '#B5B5B5', borderRadius: 12, marginBottom: 20, overflow: 'hidden' },
  cardIconArea: { height: 100, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 50 },
  habitImage: { width: 65, height: 65 },
  cardLabelArea: { borderTopWidth: 1.5, borderColor: '#B5B5B5', paddingVertical: 10, alignItems: 'center' },
  cardLabel: { fontSize: 16, fontWeight: '500', color: '#6A6A6A' },
  cardLabelActiveText: { color: '#FFFFFF', fontWeight: 'bold' },

  confirmationSection: { marginTop: 10, alignItems: 'center' },
  globalConfirmButton: { backgroundColor: '#0F613B', width: '100%', paddingVertical: 15, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  globalConfirmDisabled: { backgroundColor: '#C2D6CC' },
  globalConfirmText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  globalConfirmDisabledText: { color: '#5A7568', fontSize: 15, fontWeight: '600' },

  confirmedBox: { backgroundColor: '#E4EDE7', width: '100%', paddingVertical: 15, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#A5C1B3' },
  confirmedText: { color: '#0F613B', fontSize: 16, fontWeight: 'bold' },

  bottomNav: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#EBEBEB', borderTopWidth: 1, borderColor: '#D3D3D3', paddingVertical: 15, paddingHorizontal: 10 },
  centerNavIcon: { transform: [{ scale: 1.2 }] },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.45)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, alignItems: 'center', elevation: 5, position: 'relative' },
  modalCloseButton: { position: 'absolute', top: 14, right: 14, zIndex: 10, padding: 4 },
  modalIconArea: { width: 100, height: 100, borderWidth: 2, borderColor: '#C6E3D1', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  modalEmoji: { fontSize: 50 },
  modalHabitImage: { width: 65, height: 65 },
  questionText: { fontSize: 16, fontWeight: '600', color: '#4b5563', marginBottom: 20, textAlign: 'center' },

  segmentedControl: { flexDirection: 'row', backgroundColor: '#f3f4f6', borderRadius: 25, padding: 4, width: '100%', marginBottom: 30, position: 'relative' },
  slidingIndicator: { position: 'absolute', top: 4, bottom: 4, left: 4, width: '20%', borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 2 },
  segmentButton: { flex: 1, paddingVertical: 12, paddingHorizontal: 2, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  segmentLabel: { fontSize: 10.5, fontWeight: '700', color: '#9ca3af', textAlign: 'center' },
  segmentLabelActive: { color: '#FFFFFF' },

  registerButton: { backgroundColor: '#0F613B', paddingVertical: 12, paddingHorizontal: 50, borderRadius: 25 },
  registerButtonDisabled: { backgroundColor: '#9ca3af' },
  registerButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
