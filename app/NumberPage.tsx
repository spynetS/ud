import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextField } from "react-native-ui-lib";
import { Props } from './signup';

import {User} from "@/components/user"

const NumberPage = ({ user, onNext }: Props) => {
  const [number, setNumber] = useState(user.number || "+46"); // Assuming user has number field
  const [email, setEmail] = useState(user.email);
  const [errorE, setErrorE] = useState('');
  const [errorN, setErrorN] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [password,setPassword] = useState(user.password);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setErrorE('Inte en giltig email adress');
    } else {
      setErrorE('');
    }
    setEmail(value);
  };
  const validatePassword = (value: string) => {
    if (!value) {
      setErrorPassword('Lösenord krävs');
    } else if (value.length < 8) {
      setErrorPassword('Minst 8 tecken krävs');
    } else if (!/[A-Z]/.test(value)) {
      setErrorPassword('Minst en stor bokstav krävs');
    } else if (!/[a-z]/.test(value)) {
      setErrorPassword('Minst en liten bokstav krävs');
    } else if (!/\d/.test(value)) {
      setErrorPassword('Minst en siffra krävs');
    } else {
      setErrorPassword('');
    }
    setPassword(value);
  };

  const validateSwedishPhone = (value: string) => {
    const phoneRegex = /^([+]46)\s*(7[0236])\s*(\d{4})\s*(\d{3})$/;
    if (!phoneRegex.test(value.trim())) {
      setErrorN('Inte ett giltigt telefonnummer');
    } else {
      setErrorN('');
    }
    setNumber(value);
  };

  const next = () => {
    if (email === "" || errorE !== "" || errorN !== "" || number === "") {
      return;
    }

    const updatedUser: User = {
      ...user,
      email,
      number,
      password,
    };

    onNext(updatedUser);
  };

  return (
    <View>
      <Text white heading2>
        Min email är
      </Text>
      <TextField
        marginT-20
        placeholderTextColor="white"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        placeholder="Email adress"
        value={email}
        onChangeText={validateEmail}
        enableErrors
        validateOnChange
        validationMessage={errorE ? [errorE] : []}
        style={styles.input}
      />
      <TextField
        placeholder="Password"
        value={password}
        onChangeText={validatePassword}
        secureTextEntry
        style={styles.input}
        enableErrors
        validateOnChange
        validationMessage = {errorPassword ? [errorPassword] : []}
        validationMessagePosition="top"
        validate={['required']}
      />
      {email !== "" && errorE === "" ? (
        <View>
          <Text white heading2>
            och mitt nummer är
          </Text>
          <TextField
            marginT-20
            placeholderTextColor="white"
            keyboardType="phone-pad"
            placeholder="Telefonnummer"
            value={number}
            onChangeText={validateSwedishPhone}
            enableErrors
            validateOnChange
            validationMessage={errorN ? [errorN] : []}
            style={styles.input}
          />
        </View>
      ) : null}
      <Button marginT-50 onPress={next} >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Fortsätt
        </Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#000",
    borderColor: "gray",
    borderWidth: 1,
    color: "#a2a2a2",
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 5,
    borderRadius: 15,
    fontSize: 22,
  },
});

export default NumberPage;
