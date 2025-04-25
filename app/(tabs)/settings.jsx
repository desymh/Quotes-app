import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Linking, Switch, ScrollView, SafeAreaView } from 'react-native';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const handleContact = () => {
    Linking.openURL('mailto:desy@example.com');
  };

  const handleRateApp = () => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.desy.quotes');
  };

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.darkBackground]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, darkMode && styles.textWhite]}>Pengaturan</Text>

        {/* Tema */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.textLight]}>Tema</Text>
          <View style={styles.row}>
            <Text style={[styles.sectionText, darkMode && styles.textMuted]}>Mode Gelap</Text>
            <Switch value={darkMode} onValueChange={toggleDarkMode} />
          </View>
        </View>

        {/* Sumber Kutipan */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.textLight]}>Sumber Kutipan</Text>
          <Text style={[styles.sectionText, darkMode && styles.textMuted]}>
            Quotes diambil dari public API: <Text style={{ fontStyle: 'italic' }}>ZenQuotes.io</Text>
          </Text>
        </View>

        {/* Spacer */}
        <View style={{ height: 30 }} />

        {/* Lainnya */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.textLight]}>Lainnya</Text>
          <Pressable style={styles.button} onPress={handleContact}>
            <Text style={styles.buttonText}>Hubungi Pembuat</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={handleRateApp}>
            <Text style={styles.buttonText}>Beri Rating Aplikasi</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Footer tetap di bawah layar */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, darkMode && styles.textMuted]}>Versi Aplikasi: 1.0.0</Text>
        <Text style={[styles.footerText, darkMode && styles.textMuted]}>Dibuat oleh: desy_mh</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0EAD6',
  },
  darkBackground: {
    backgroundColor: '#1e1e1e',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80, // kasih ruang biar gak ketutup footer
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  textWhite: {
    color: '#fff',
  },
  textLight: {
    color: '#ddd',
  },
  textMuted: {
    color: '#aaa',
  },
});
