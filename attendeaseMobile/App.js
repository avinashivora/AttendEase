import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet, Modal, ActivityIndicator, ProgressBarAndroid } from "react-native";
import { Router } from './src/manageRoutes/Router';
import { AuthProvider } from "./src/contexts/Auth";
import codePush from 'react-native-code-push';
import { getLatestPatch } from "./src/actions/authActions";
import RNSecureStorage from "rn-secure-storage";

const codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

const App = () => {
  const [progress, setProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPatchNote, setShowPatchNote] = useState(false);
  const [patchNote, setPatchNote] = useState("");

  useEffect(() => {
    // Check for updates manually
    codePush.checkForUpdate().then((update) => {
      if (update) {
        // Alert the user about the update
        Alert.alert(
          "Update Available",
          "An update is available. Would you like to update now?",
          [
            { text: "No", onPress: () => console.log("Update declined") },
            { text: "Yes", onPress: () => applyUpdate() }
          ]
        );
      } else {
        console.log("The app is up to date.");
      }
    }).catch((err) => {
      console.log("An error occurred while checking for updates: ", err);
    });
  }, []);

  const applyUpdate = async() => {
    setIsUpdating(true);
    let patch = await getLatestPatch();
    await RNSecureStorage.setItem('showPatchNote', patch.data[0].summary);
    // Sync and install the update
    codePush.sync(
      {
        installMode: codePush.InstallMode.IMMEDIATE, // Install immediately after download
        mandatoryInstallMode: codePush.InstallMode.IMMEDIATE, // Install mandatory updates immediately
      },
      (status) => {
        switch (status) {
          case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            console.log("Downloading package.");
            break;
          case codePush.SyncStatus.INSTALLING_UPDATE:
            console.log("Installing update.");
            break;
          case codePush.SyncStatus.UPDATE_INSTALLED:
            setIsUpdating(false);
            Alert.alert("Update Installed", "The update has been installed.");
            break;
        }
      },
      ({ receivedBytes, totalBytes }) => {
        const downloadProgress = receivedBytes / totalBytes;
        setProgress(downloadProgress);
        console.log(`Downloading ${receivedBytes} of ${totalBytes} bytes.`);
      }
    );
  };

  useEffect(() => {
    const checkForPatchNotes = async() => {
      try {
        const shouldShow = await RNSecureStorage.getItem('showPatchNote');
          if (shouldShow) {
            setPatchNote(shouldShow)
            setShowPatchNote(true);
            // Clear the flag after showing the patch notes
            await RNSecureStorage.removeItem('showPatchNote');
          }
      } catch(err) {
        console.log(err);
      }
    };
    checkForPatchNotes();
  }, []);

  return (
    <AuthProvider>
      <Router />
      {isUpdating && (
        <Modal transparent={true} animationType="fade">
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <Text style={styles.updateText}>Updating...</Text>
              <ProgressBarAndroid 
                styleAttr="Horizontal" 
                indeterminate={false} 
                progress={progress} 
                color="#2196F3" 
              />
              <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
            </View>
          </View>
        </Modal>
      )}
      {showPatchNote && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.patchNoteWrapper}>
              <Text style={styles.patchNoteTitle}>Patch Notes</Text>
              <Text style={styles.patchNoteText}>{patchNote}</Text>
              <Text 
                style={styles.closeButton} 
                onPress={() => setShowPatchNote(false)}
              >
                Close
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 200,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  updateText: {
    fontSize: 18,
    marginBottom: 10
  },
  progressText: {
    marginTop: 10,
    fontSize: 16
  },
  patchNoteWrapper: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  patchNoteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  patchNoteText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 16,
    color: '#2196F3',
    textAlign: 'center',
  }
});

export default codePush(codePushOptions)(App);
