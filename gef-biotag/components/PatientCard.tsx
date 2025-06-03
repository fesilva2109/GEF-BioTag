import { Colors } from '@/constants/Colors';
import { Patient } from '@/types';
import { getHeartRateStatus } from '@/utils/healthUtils';
import { Heart, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PatientCardProps {
  patient: Patient;
  shelterName: string;
  onPress: () => void;
}

export function PatientCard({ patient, shelterName, onPress }: PatientCardProps) {
  const heartRateStatus = getHeartRateStatus(patient.bracelet.iotHeartRate.bpm);
  const heartRateColor =
    heartRateStatus === 'critical' ? Colors.danger :
      heartRateStatus === 'warning' ? Colors.warning :
        Colors.success;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <User size={24} color={Colors.white} />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{patient.name}</Text>
          <Text style={styles.id}>ID: {patient.bracelet.nfc.id}</Text>
          <Text style={styles.shelter}>{shelterName}</Text>
        </View>

        <View style={styles.heartRateContainer}>
          <Heart size={18} color={heartRateColor} />
          <Text style={[styles.heartRate, { color: heartRateColor }]}>
            {patient.bracelet.iotHeartRate.bpm} BPM
          </Text>
        </View>
      </View>

      {heartRateStatus !== 'normal' && (
        <View style={[
          styles.statusBar,
          heartRateStatus === 'critical' ? styles.criticalStatus : styles.warningStatus
        ]} />
      )}

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray[800],
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    flexDirection: 'row',
    padding: 16,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.white,
    marginBottom: 2,
  },
  id: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[300],
    marginBottom: 2,
  },
  shelter: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[400],
  },
  heartRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[700],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  heartRate: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    marginLeft: 4,
  },
  statusBar: {
    height: 4,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  criticalStatus: {
    backgroundColor: Colors.danger,
  },
  warningStatus: {
    backgroundColor: Colors.warning,
  },
  syncIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.warning + '30',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  syncText: {
    fontFamily: 'Inter-Medium',
    fontSize: 10,
    color: Colors.warning,
  },
});