import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Animated } from 'react-native';
import axios from 'axios';
import { useFavorites } from '../context/FavoriteContext';
import Toast from 'react-native-toast-message';

export default function QuotesScreen() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToFavorites } = useFavorites();

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
      setQuote({ quote: 'Gagal ambil quote.', author: 'Unknown' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Text style={styles.text}>"{quote?.quote}"</Text>
          <Text style={styles.author}>- {quote?.author}</Text>
          <View style={styles.buttonContainer}>
            {/* Favorite button */}
            <Animated.View style={[styles.animatedButton, { transform: [{ scale: scaleFavorite }] }]}>
              <Pressable
                onPressIn={() => animatePressIn(scaleFavorite)}
                onPressOut={() => animatePressOut(scaleFavorite, handleAddToFavorite)}
                style={styles.pressableButton}
              >
                <Text style={styles.pressableText}>Add to Favorite</Text>
              </Pressable>
            </Animated.View>

            {/* Next Quote button */}
            <Animated.View style={[styles.animatedButton, { transform: [{ scale: scaleNext }] }]}>
              <Pressable
                onPressIn={() => animatePressIn(scaleNext)}
                onPressOut={() => animatePressOut(scaleNext, fetchQuote)}
                style={[styles.pressableButton, { backgroundColor: '#2196F3' }]}
              >
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
  text: {
    fontSize: 24,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  author: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#555',
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
  },
  pressableText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
