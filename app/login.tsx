import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import API, { endPoint } from '@/components/api';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    setErrorMessage(''); // clear previous errors
    try {
      let response = await fetch(endPoint + '/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      let json = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('access_token', json.access_token);
        await AsyncStorage.setItem('refresh_token', json.refresh_token);
        await AsyncStorage.setItem('token_expiry', json.expire.toString());
        await AsyncStorage.setItem('primary_color', json.school_color);

        Alert.alert('Success', json.message);
        router.push('/', { relativeToDirectory: true });
      } else {
        setErrorMessage(json.error || 'Invalid username or password');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0d0d0d',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  errorText: {
    color: '#FF4D4D',
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
  },
  linkText: {
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#FF69B4',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#0d0d0d',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
