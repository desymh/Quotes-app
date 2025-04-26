import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useLogin } from './context/LoginContext';
import { useTheme } from './context/ThemeContext'; // << tambahkan

export default function LoginScreen() {
  const { login } = useLogin();
  const { theme } = useTheme(); // << pakai
  const darkMode = theme === 'dark'; // << cek mode

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const hardcodedEmail = 'uts@gmail.com';
    const hardcodedPassword = 'semangat';

    if (
      email.trim().toLowerCase() === hardcodedEmail &&
      password.trim() === hardcodedPassword
    ) {
      login();
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Gagal', 'Email atau Password salah.');
    }
  };

  return (
    <View style={[styles.container, darkMode && styles.containerDark]}>
      <Text style={[styles.title, darkMode && styles.textDark]}>Login</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor={darkMode ? '#aaa' : '#666'}
        style={[styles.input, darkMode && styles.inputDark]}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={darkMode ? '#aaa' : '#666'}
        style={[styles.input, darkMode && styles.inputDark]}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} color={darkMode ? '#bb86fc' : '#2196F3'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#f0f0f0', // light mode
  },
  containerDark: {
    backgroundColor: '#121212', // dark mode
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#222',
  },
  textDark: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#000',
  },
  inputDark: {
    backgroundColor: '#1f1f1f',
    borderColor: '#555',
    color: '#fff',
  },
});
