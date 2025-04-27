import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Switch,
  ScrollView,
  SafeAreaView,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';

  const handleContact = () => {
    Linking.openURL('mailto:desymamluahhimaya@gmail.com');
  };

  const handleRateApp = () => {
    Alert.alert('Belum Tersedia', 'Fitur rating akan aktif setelah aplikasi tersedia di Play Store.');
  };

  const handleShareApp = () => {
    Alert.alert('Bagikan Aplikasi', 'Aplikasi ini mungkin belum tersedia di Play Store. Tetap ingin membagikan link?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Bagikan',
        onPress: async () => {
          try {
            await Share.share({
              message: 'Yuk coba aplikasi quotes inspiratif ini! 📚 https://play.google.com/store/apps/details?id=com.desy.quotes',
            });
          } catch (error) {
            console.error('Gagal membagikan:', error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.darkBackground]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, darkMode && styles.textWhite]}>Pengaturan</Text>

        {/* Tema */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={[styles.sectionTitle, darkMode && styles.textWhite]}>Mode Gelap</Text>
            <Switch value={darkMode} onValueChange={toggleTheme} />
          </View>
          <Text style={[styles.sectionText, darkMode && styles.textMuted]}>
            Tema saat ini: {darkMode ? 'Gelap' : 'Terang'}
          </Text>
        </View>

        {/* Sumber Kutipan */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.textWhite]}>Sumber Kutipan</Text>
          <Text style={[styles.sectionText, darkMode && styles.textMuted]}>
            Aplikasi ini mengambil kutipan dari API publik{' '}
            <Text style={{ fontStyle: 'italic' }}>ZenQuotes.io</Text>. Semua kutipan digunakan untuk tujuan edukatif dan inspiratif.
          </Text>
        </View>

        {/* Tentang Aplikasi */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.textWhite]}>Tentang Aplikasi</Text>
          <Text style={[styles.sectionText, darkMode && styles.textMuted]}>
            Temukan kutipan inspiratif setiap hari dari tokoh-tokoh terkenal dunia.
            Simpan favoritmu, ubah tampilan terang/gelap, dan bagikan ke orang terdekatmu dengan mudah.
          </Text>
        </View>

        {/* Lisensi */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.textWhite]}>Lisensi</Text>
          <Text style={[styles.sectionText, darkMode && styles.textMuted]}>
            Konten kutipan diambil dari sumber terbuka dan dimanfaatkan untuk pembelajaran serta inspirasi.
            Kami menghormati para penulis asli.
          </Text>
        </View>

        {/* Riwayat Versi */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.textWhite]}>Riwayat Versi</Text>
          <Text style={[styles.sectionText, darkMode && styles.textMuted]}>
            • 1.0.0 - Versi awal: fitur kutipan, favorit, dan mode tema
          </Text>
        </View>

        {/* Lainnya (Tombol Aksi) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, darkMode && styles.textWhite]}>Lainnya</Text>

          <Pressable style={styles.button} onPress={handleContact}>
            <View style={styles.buttonContent}>
              <Ionicons name="mail-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Hubungi Pembuat</Text>
            </View>
          </Pressable>

          <Pressable style={styles.button} onPress={handleRateApp}>
            <View style={styles.buttonContent}>
              <Ionicons name="star-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Beri Rating Aplikasi</Text>
            </View>
          </Pressable>

          <Pressable style={styles.button} onPress={handleShareApp}>
            <View style={styles.buttonContent}>
              <Ionicons name="share-social-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Bagikan Aplikasi</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>

      {/* Footer */}
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
    paddingBottom: 80,
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
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 22,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
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
    marginBottom: 2,
  },
  textWhite: {
    color: '#fff',
  },
  textMuted: {
    color: '#aaa',
  },
});
