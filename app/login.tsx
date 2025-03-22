import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import API from "@/components/api";

import {router} from "expo-router";


const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = async () => {
        try {
            let response = await fetch('http://192.168.1.119:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            let json = await response.json();
            if (response.ok) {
                // Store token securely
                await AsyncStorage.setItem('access_token', json.access_token);
                await AsyncStorage.setItem('refresh_token', json.refresh_token);
                await AsyncStorage.setItem('token_expiry', json.expire.toString());

                Alert.alert("Success", json.message);
                router.push("/", { relativeToDirectory: true })
            } else {
                Alert.alert("Error", json.error);
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8f9fa' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
    button: { backgroundColor: '#007bff', padding: 15, borderRadius: 5 },
    buttonText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
});

export default LoginScreen;
