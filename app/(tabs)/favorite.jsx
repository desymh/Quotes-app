import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { useFavorites } from '../context/FavoriteContext';
import { useTheme } from '../context/ThemeContext'; // ✅ pakai theme global
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

export default function FavoriteScreen() {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  const handleDelete = (item) => {
    Alert.alert(
      "Hapus dari Favorit?",
      "Kamu yakin ingin menghapus quote ini dari favorit?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => {
            removeFromFavorites(item);
            Toast.show({
              type: 'info',
              text1: 'Quote dihapus',
              text2: 'Quote berhasil dihapus dari favorit.',
            });
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Hapus Semua Favorit?",
      "Apakah kamu yakin ingin menghapus semua quote favorit?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus Semua",
          style: "destructive",
          onPress: () => {
            clearFavorites();
            Toast.show({
              type: 'info',
              text1: 'Semua Favorit Dihapus',
              text2: 'Semua quote favorit telah dihapus.',
            });
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, darkMode && styles.darkCard]}>
      <Text style={[styles.quote, darkMode && styles.textWhite]}>"{item.quote}"</Text>
      <Text style={[styles.author, darkMode && styles.textMuted]}>- {item.author}</Text>

      <Pressable style={styles.removeButton} onPress={() => handleDelete(item)}>
        <Text style={styles.removeButtonText}>Hapus</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={[styles.container, darkMode && styles.darkBackground]}>
      <Text style={[styles.title, darkMode && styles.textWhite]}>Favorite Quotes</Text>

      {favorites.length === 0 ? (
        <Text style={[styles.emptyText, darkMode && styles.textMuted]}>
          Belum ada quote favorit.
        </Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {favorites.length > 0 && (
        <View style={styles.fixedBottom}>
          <Pressable style={styles.clearButton} onPress={handleClearAll}>
            <Ionicons name="trash-outline" size={18} color="#fff" />
            <Text style={styles.clearButtonText}>Hapus Semua Favorit</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0EAD6',
    padding: 20,
    paddingBottom: 0,
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#1f1f1f',
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 8,
    color: '#333',
  },
  author: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  removeButton: {
    marginTop: 12,
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontStyle: 'italic',
    marginTop: 50,
  },
  fixedBottom: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#c0392b',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textWhite: {
    color: '#fff',
  },
  textMuted: {
    color: '#aaa',
  },
});
