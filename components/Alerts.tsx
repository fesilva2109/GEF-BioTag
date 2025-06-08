import { Colors } from '@/constants/Colors';
import { useData } from '@/hooks/useData';
import { AlertTriangle, Building2, Users } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AlertsScreen() {
    const { patients, shelters } = useData();

    const criticalPatients = patients.filter(
        p => p.bracelet.iotHeartRate.bpm < 55 || p.bracelet.iotHeartRate.bpm > 100
    );

    const crowdedShelters = shelters.filter(shelter => {
        const count = patients.filter(p => p.shelterId === shelter.id).length;
        return count / shelter.capacity > 0.9;
    });

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.sectionTitle}>Central de Alertas</Text>
            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <AlertTriangle size={20} color={Colors.danger} />
                        <Text style={styles.sectionTitle}>Pacientes em Risco</Text>
                    </View>
                    {criticalPatients.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum paciente em risco no momento.</Text>
                    ) : (
                        criticalPatients.map(patient => (
                            <View key={patient.id} style={styles.alertCard}>
                                <Users size={16} color={Colors.danger} />
                                <Text style={styles.alertText}>{patient.name} - {patient.bracelet.iotHeartRate.bpm} BPM</Text>
                            </View>
                        ))
                    )}
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Building2 size={20} color={Colors.warning} />
                        <Text style={styles.sectionTitle}>Abrigos Lotados</Text>
                    </View>
                    {crowdedShelters.length === 0 ? (
                        <Text style={styles.emptyText}>Nenhum abrigo lotado.</Text>
                    ) : (
                        crowdedShelters.map(shelter => (
                            <View key={shelter.id} style={styles.alertCard}>
                                <Text style={styles.alertText}>{shelter.name} ({patients.filter(p => p.shelterId === shelter.id).length}/{shelter.capacity})</Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.darkGray,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 8,
    },
    section: {
        backgroundColor: Colors.gray[800],
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 18,
        color: Colors.white,
        marginLeft: 8,
        marginBottom: 8,
    },
    alertCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    alertText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: Colors.danger,
        marginLeft: 8,
    },
    emptyText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: Colors.gray[300],
        marginBottom: 8,
    },
});