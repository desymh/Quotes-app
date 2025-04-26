import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Animated,
  ImageBackground,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { useFavorites } from '../context/FavoriteContext';
import { useTheme } from '../context/ThemeContext';
import { useLogin } from '../context/LoginContext';
import { useRouter } from 'expo-router';
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
  const { logout } = useLogin();
  const router = useRouter();
  const darkMode = theme === 'dark';

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const quoteFade = useRef(new Animated.Value(0)).current;
  const quoteTranslate = useRef(new Animated.Value(10)).current;
  const viewShotRef = useRef();

  const images = [
    require('../../assets/images/bg1.jpg'),
    require('../../assets/images/bg2.jpg'),
    require('../../assets/images/bg3.jpg'),
    require('../../assets/images/bg4.jpg'),
    require('../../assets/images/bg5.jpg'),
    require('../../assets/images/bg6.jpg'),
  ];
  const [backgroundImage, setBackgroundImage] = useState(images[0]);

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

  const handleAddToFavorite = () => {
    if (quote) {
      addToFavorites({ quote: quote?.quote, author: quote?.author });
      Toast.show({
        type: 'success',
        text1: 'Ditambahkan ke Favorit!',
        text2: 'Quote berhasil disimpan.',
      });
    }
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

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  useEffect(() => {
    fetchQuote();
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
      }
    })();
  }, []);

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.darkBackground]}>
      {loading ? (
        <ActivityIndicator size="large" color={darkMode ? '#fff' : '#000'} />
      ) : (
        <>
          <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }} style={styles.fullScreen}>
            <ImageBackground source={backgroundImage} style={styles.imageBackground}>
              <View style={styles.overlay}>
                <Animated.Text
                  style={[
                    styles.quoteText,
                    darkMode && styles.textWhite,
                    { opacity: quoteFade, transform: [{ translateY: quoteTranslate }] },
                  ]}
                >
                  "{quote?.quote}"
                </Animated.Text>
                <Text style={[styles.authorText, darkMode && styles.textMuted]}>- {quote?.author}</Text>
              </View>
            </ImageBackground>
          </ViewShot>

          <View style={styles.buttonBar}>
            <Pressable style={styles.iconButton} onPress={handleAddToFavorite}>
              <Ionicons name="heart" size={24} color="#fff" />
            </Pressable>

            <Pressable style={styles.iconButton} onPress={fetchQuote}>
              <Ionicons name="refresh" size={24} color="#fff" />
            </Pressable>

            <Pressable style={styles.iconButton} onPress={handleShare}>
              <Ionicons name="share-social" size={24} color="#fff" />
            </Pressable>

            <Pressable style={styles.iconButton} onPress={handleSaveToGallery}>
              <Ionicons name="download" size={24} color="#fff" />
            </Pressable>

            <Pressable style={styles.iconButton} onPress={handleLogout}>
              <Ionicons name="log-out" size={24} color="#fff" />
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0EAD6',
    justifyContent: 'flex-end',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  fullScreen: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteText: {
    fontSize: 28,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  authorText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#ddd',
  },
  textWhite: {
    color: '#fff',
  },
  textMuted: {
    color: '#ccc',
  },
  buttonBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)', // efek glossy
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 50,
  },
});
