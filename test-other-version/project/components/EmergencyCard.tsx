import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { TriangleAlert as AlertTriangle, MapPin, ChevronRight } from 'lucide-react-native';

type EmergencyCardProps = {
  title: string;
  location: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  onPress?: () => void;
};

export default function EmergencyCard({ 
  title, 
  location, 
  description, 
  severity = 'medium',
  onPress 
}: EmergencyCardProps) {
  
  const getSeverityColor = () => {
    switch (severity) {
      case 'high': return '#E53935';
      case 'medium': return '#FDD835';
      case 'low': return '#4CAF50';
      default: return '#CCCCCC';
    }
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { borderLeftColor: getSeverityColor() }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <AlertTriangle size={18} color={getSeverityColor()} style={styles.icon} />
          <Text style={styles.title}>{title}</Text>
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin size={14} color="#AAAAAA" style={styles.locationIcon} />
          <Text style={styles.locationText}>{location}</Text>
        </View>
      </View>
      
      <Text style={styles.description}>{description}</Text>
      
      {onPress && (
        <View style={styles.actionContainer}>
          <ChevronRight size={20} color="#AAAAAA" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#424242',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  header: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#AAAAAA',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#CCCCCC',
    lineHeight: 20,
  },
  actionContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});