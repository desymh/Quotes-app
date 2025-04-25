import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Animated } from 'react-native';
import axios from 'axios';
import { useFavorites } from '../context/FavoriteContext';
import { useTheme } from '../context/ThemeContext'; // ✅ pakai context theme
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

export default function QuotesScreen() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToFavorites } = useFavorites();
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  const scaleFavorite = useRef(new Animated.Value(1)).current;
  const scaleNext = useRef(new Animated.Value(1)).current;

  const animatePressIn = (anim) => {
    Animated.spring(anim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = (anim, action) => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => action && action());
  };

  const handleAddToFavorite = () => {
    addToFavorites({ quote: quote?.quote, author: quote?.author });
    Toast.show({
      type: 'success',
      text1: 'Ditambahkan ke Favorit!',
      text2: 'Quote berhasil disimpan.',
    });
  };

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://dummyjson.com/quotes/random');
      setQuote(response.data);
    } catch (error) {
      console.error('Gagal ambil quote:', error);
      setQuote({ quote: 'Gagal ambil quote.', author: 'Unknown' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <View style={[styles.container, darkMode && styles.darkBackground]}>
      <Text style={[styles.header, darkMode && styles.textWhite]}>Quote of the Day</Text>
      {loading ? (
        <ActivityIndicator size="large" color={darkMode ? "#fff" : "#000"} />
      ) : (
        <>
          <View style={[styles.quoteCard, darkMode && styles.darkCard]}>
            <Text style={[styles.text, darkMode && styles.textWhite]}>"{quote?.quote}"</Text>
            <Text style={[styles.author, darkMode && styles.textMuted]}>- {quote?.author}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <Animated.View style={[styles.animatedButton, { transform: [{ scale: scaleFavorite }] }]}>
              <Pressable
                onPressIn={() => animatePressIn(scaleFavorite)}
                onPressOut={() => animatePressOut(scaleFavorite, handleAddToFavorite)}
                style={styles.pressableButton}
              >
                <Ionicons name="heart" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.pressableText}>Add to Favorite</Text>
              </Pressable>
            </Animated.View>

            <Animated.View style={[styles.animatedButton, { transform: [{ scale: scaleNext }] }]}>
              <Pressable
                onPressIn={() => animatePressIn(scaleNext)}
                onPressOut={() => animatePressOut(scaleNext, fetchQuote)}
                style={[styles.pressableButton, { backgroundColor: '#2196F3' }]}
              >
                <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.pressableText}>Next Quote</Text>
              </Pressable>
            </Animated.View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0EAD6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
  },
  quoteCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
    width: '100%',
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
  },
  text: {
    fontSize: 24,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  author: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#555',
  },
  textWhite: {
    color: '#fff',
  },
  textMuted: {
    color: '#aaa',
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 40,
  },
  animatedButton: {
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
  pressableButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressableText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
