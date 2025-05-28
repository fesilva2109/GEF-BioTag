import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, Modal, TouchableOpacity, 
  TouchableWithoutFeedback, Alert, Platform 
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { X, CircleCheck as CheckCircle2 } from 'lucide-react-native';

type QRScannerModalProps = {
  visible: boolean;
  onClose: () => void;
  onCodeScanned: (data: string) => void;
};

export default function QRScannerModal({ 
  visible, 
  onClose,
  onCodeScanned
}: QRScannerModalProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  
  useEffect(() => {
    if (visible) {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        
        if (status !== 'granted') {
          Alert.alert(
            'Permissão Negada',
            'Precisamos de permissão para acessar a câmera e escanear QR Codes.',
            [{ text: 'OK', onPress: onClose }]
          );
        }
      })();
    }
    
    return () => {
      setScanned(false);
    };
  }, [visible]);
  
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    onCodeScanned(data);
  };
  
  const resetScanner = () => {
    setScanned(false);
  };
  
  if (hasPermission === null && visible) {
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.loadingText}>Solicitando permissão para câmera...</Text>
          </View>
        </View>
      </Modal>
    );
  }
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Escanear QR Code</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.scannerContainer}>
            {hasPermission ? (
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.scanner}
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
              />
            ) : (
              <View style={styles.permissionDeniedContainer}>
                <Text style={styles.permissionDeniedText}>
                  Sem permissão para acessar a câmera
                </Text>
              </View>
            )}
            
            {scanned && (
              <View style={styles.scannedOverlay}>
                <CheckCircle2 size={48} color="#4CAF50" />
                <Text style={styles.scannedText}>QR Code escaneado!</Text>
                <TouchableOpacity 
                  style={styles.scanAgainButton}
                  onPress={resetScanner}
                >
                  <Text style={styles.scanAgainButtonText}>Escanear Novamente</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerMarker}>
                <View style={[styles.scannerCorner, styles.topLeft]} />
                <View style={[styles.scannerCorner, styles.topRight]} />
                <View style={[styles.scannerCorner, styles.bottomLeft]} />
                <View style={[styles.scannerCorner, styles.bottomRight]} />
              </View>
            </View>
          </View>
          
          <Text style={styles.instructions}>
            Posicione o QR Code da pulseira dentro da área demarcada
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    flex: 1,
    backgroundColor: '#303030',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#424242',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerMarker: {
    width: 250,
    height: 250,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  scannerCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFFFFF',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  scannedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 16,
  },
  scanAgainButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
  },
  scanAgainButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  instructions: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    padding: 16,
  },
  permissionDeniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121',
  },
  permissionDeniedText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#E53935',
    textAlign: 'center',
    padding: 20,
  },
});