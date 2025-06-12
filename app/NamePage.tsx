import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextField } from "react-native-ui-lib";
import { Props } from './signup';
import {User} from "@/components/user"

const NamePage = ({ user, onNext }: Props) => {
  // Local separate state for fields to avoid mutating props directly
  const [name, setName] = useState(user.first_name !== "" ? user.first_name + " " + user.last_name:"");
  const [username, setUsername] = useState(user.username);
  const [about, setAbout] = useState(user.about || "");
  const [showAbout, setShowAbout] = useState(false);
  const [error, setError] = useState('');

  const validateName = (value: string) => {
    const nameRegex = /^[A-Za-z]+(?:[-'][A-Za-z]+)?\s+[A-Za-z]+(?:[-'][A-Za-z]+)?$/;
    if (!nameRegex.test(value)) {
      setError('Please enter a valid first and last name');
    } else {
      setError('');
    }
    setName(value);
  };

  const validateUsername = (value: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(value)) {
      setError('Username must be 3–20 characters, letters/numbers/underscores only');
    } else {
      setError('');
    }
    setUsername(value);
  };


  const next = () => {
    if (error !== "" || name.trim() === "") {
      // Do not proceed if invalid
      return;
    }

    // Extract first and last name safely
    const parts = name.trim().split(" ");
    const first_name = parts[0];
    const last_name = parts.slice(1).join(" "); // support multi-part last names

    // Prepare updated user object
    const updatedUser: User = {
      ...user,
      first_name,
      last_name,
      about,
      username,
    };

    if (showAbout && about.trim() !== "") {
      onNext(updatedUser);
    } else {
      setShowAbout(true);
    }
  };

  return (
    <View>
      <Text white heading>
        Jag heter
      </Text>
      <TextField
        marginT-20
        placeholderTextColor="white"
        placeholder="För och efternamn"
        value={name}
        onChangeText={validateName}
        enableErrors
        validateOnChange
        validationMessage={error ? [error] : []}
        style={styles.input}
      />
      <Text white>
        Detta kommer visas på din profil
      </Text>
      <TextField
        marginT-20
        placeholderTextColor="white"
        placeholder="Användarnamn"
        value={username}
        onChangeText={validateUsername}
        enableErrors
        validateOnChange
        validationMessage={error ? [error] : []}
        style={styles.input}
      />
      <Text white>
        Detta kommer inte visas på din profil men kan loggas in med
      </Text>
      {(error === "" && name.trim() !== "") ? (
        <View>
          <Text marginT-10 white heading2>
            och detta är en beskrivning om mig
          </Text>
          <TextField
            multiline={true}
            placeholderTextColor="white"
            placeholder="Om dig själv"
            value={about}
            onChangeText={setAbout}
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
    fontSize: 18,
  },
});

export default NamePage;
