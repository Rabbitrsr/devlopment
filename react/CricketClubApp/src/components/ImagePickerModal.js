import React from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from '@react-native-documents/picker';   // ✅ Updated import

const ImagePickerModal = ({ visible, onClose, onFileSelected }) => {
  const pickFromGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        onFileSelected(response.assets[0]);
        onClose();
      }
    });
  };

  const pickFromCamera = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        onFileSelected(response.assets[0]);
        onClose();
      }
    });
  };

  const pickFromFileExplorer = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      onFileSelected({
        uri: res.uri,
        name: res.name,
        type: res.type,
      });
      onClose();
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        onClose();
      } else {
        console.error(err);
        onClose();
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Image Source</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.iconContainer} onPress={pickFromFileExplorer}>
              <Icon name="document-outline" size={40} color="#4b5563" />
              <Text style={styles.iconLabel}>File</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={pickFromGallery}>
              <Icon name="images-outline" size={40} color="#4b5563" />
              <Text style={styles.iconLabel}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer} onPress={pickFromCamera}>
              <Icon name="camera-outline" size={40} color="#4b5563" />
              <Text style={styles.iconLabel}>Camera</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' },
  modalContent: {
    backgroundColor: 'white',
    margin: 30,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  iconRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  iconContainer: { alignItems: 'center' },
  iconLabel: { marginTop: 8, color: '#4b5563' },
  cancelButton: { marginTop: 20 },
});

export default ImagePickerModal;
