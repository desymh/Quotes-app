import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { useFavorites } from '../context/FavoriteContext';
import Toast from 'react-native-toast-message';

export default function FavoriteScreen() {
  const { favorites, removeFromFavorites } = useFavorites();

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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.quote}>"{item.quote}"</Text>
      <Text style={styles.author}>- {item.author}</Text>

      <Pressable
        style={styles.removeButton}
        onPress={() => handleDelete(item)}
      >
        <Text style={styles.removeButtonText}>Hapus</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Quotes</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0EAD6',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
});
