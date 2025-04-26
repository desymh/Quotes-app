import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Animated,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import { useFavorites } from '../context/FavoriteContext';
import { useTheme } from '../context/ThemeContext';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

export default function QuotesScreen() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToFavorites } = useFavorites();
  const { theme } = useTheme();
  const darkMode = theme === 'dark';

  const scaleFavorite = useRef(new Animated.Value(1)).current;
  const scaleNext = useRef(new Animated.Value(1)).current;
  const scaleShare = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const quoteFade = useRef(new Animated.Value(0)).current;
  const quoteTranslate = useRef(new Animated.Value(10)).current;

  const images = [
    require('../../assets/images/bg1.jpg'),
    require('../../assets/images/bg2.jpg'),
    require('../../assets/images/bg3.jpg'),
    require('../../assets/images/bg4.jpg'),
    require('../../assets/images/bg5.jpg'),
    require('../../assets/images/bg6.jpg'),
  ];
  const [backgroundImage, setBackgroundImage] = useState(images[0]);
  const viewShotRef = useRef();

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

  const animateQuote = () => {
    quoteFade.setValue(0);
    quoteTranslate.setValue(10);

    Animated.parallel([
      Animated.timing(quoteFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(quoteTranslate, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAddToFavorite = () => {
    addToFavorites({ quote: quote?.quote, author: quote?.author });
    Toast.show({
      type: 'success',
      text1: 'Ditambahkan ke Favorit!',
      text2: 'Quote berhasil disimpan.',
    });
  };

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Gagal share:', error);
    }
  };

  const handleSaveToGallery = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('QuotesApp', asset, false);
      Toast.show({
        type: 'success',
        text1: 'Berhasil disimpan!',
        text2: 'Quote tersimpan di galeri.',
      });
    } catch (err) {
      console.error('Gagal simpan ke galeri:', err);
    }
  };

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://dummyjson.com/quotes/random');
      setQuote(response.data);
      const randomImage = images[Math.floor(Math.random() * images.length)];
      setBackgroundImage(randomImage);
      animateQuote();
    } catch (error) {
      console.error('Gagal ambil quote:', error);
      setQuote({ quote: 'Gagal ambil quote.', author: 'Unknown' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
      }
    })();
  }, []);

  return (
    <View style={[styles.container, darkMode && styles.darkBackground]}>
      <Animated.Text style={[styles.header, darkMode && styles.textWhite, { opacity: fadeAnim }]}>✨ Your Daily Motivation</Animated.Text>
      <Text style={[styles.subHeader, darkMode && styles.textMuted]}>A little push to brighten your day</Text>

      {loading ? (
        <ActivityIndicator size="large" color={darkMode ? '#fff' : '#000'} />
      ) : (
        <>
          <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }} style={styles.quoteCard}>
            <ImageBackground source={backgroundImage} style={styles.quoteCard} imageStyle={{ borderRadius: 20, resizeMode: 'cover' }}>
              <View style={styles.overlay}>
                <Animated.Text style={[styles.text, darkMode && styles.textWhite, { opacity: quoteFade, transform: [{ translateY: quoteTranslate }] }]}>"{quote?.quote}"</Animated.Text>
                <Text style={[styles.author, darkMode && styles.textMuted]}>- {quote?.author}</Text>
              </View>
            </ImageBackground>
          </ViewShot>

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

            <Animated.View style={[styles.animatedButton, { transform: [{ scale: scaleShare }] }]}>
              <Pressable
                onPressIn={() => animatePressIn(scaleShare)}
                onPressOut={() => animatePressOut(scaleShare, handleShare)}
                style={[styles.pressableButton, { backgroundColor: '#FF9800' }]}
              >
                <Ionicons name="share-social" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.pressableText}>Share</Text>
              </Pressable>
            </Animated.View>

            <Animated.View style={[styles.animatedButton, { transform: [{ scale: scaleShare }] }]}>
              <Pressable
                onPressIn={() => animatePressIn(scaleShare)}
                onPressOut={() => animatePressOut(scaleShare, handleSaveToGallery)}
                style={[styles.pressableButton, { backgroundColor: '#9C27B0' }]}
              >
                <Ionicons name="download" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.pressableText}>Save to Gallery</Text>
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
    paddingHorizontal: 10,
    paddingTop: 40,
    paddingBottom: 20,
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 20,
    color: '#444',
    textAlign: 'center',
  },
  quoteCard: {
    width: '100%',
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text: {
    fontSize: 26,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  author: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ddd',
  },
  textWhite: {
    color: '#fff',
  },
  textMuted: {
    color: '#ccc',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 30,
  },
  animatedButton: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  pressableButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
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
