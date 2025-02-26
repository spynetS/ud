import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import axios from "axios"

import { View, TextField, Button, Text, Avatar} from 'react-native-ui-lib';
import { useFocusEffect } from '@react-navigation/native';

//<Divider d10 testID={'divider'}/>

import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Divider = ({ color = '#D3D3D3', height = 1, marginV = 10 }) => (
  <View style={{ height, backgroundColor: color, width: '100%', marginVertical: marginV }} />
);

const ProfileScreen = () => {
  const [profile, setProfile] = useState({});

  const [loading, setLoading] = useState(false);

	useFocusEffect(useCallback(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) throw new Error("No token found!");
				console.log(token)
        const response = await axios.get("http://192.168.1.119:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setProfile(response.data);  // Store user data

      } catch (err) {

      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchUserData();
  },[]));

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile({ ...profile, profile_picture: result.assets[0].uri });
    }
  };

  // Function to update user info (mock save)
  const saveProfile = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Profile updated successfully!');
    }, 1500);
  };

  return (
		<SafeAreaView>

			<ScrollView contentContainerStyle={styles.container}>
				<View>


					<View style={styles.profileContainer}>
						<TouchableOpacity onPress={pickImage}>
							<Avatar size={100} source={{ uri: profile.profile_picture }} />
						</TouchableOpacity>
						<Text style={styles.name}>{profile.username}</Text>
					</View>

					<Divider />

					{/* Editable Fields */}
					<View style={styles.form}>
						<TextField
							label="Name"
							value={profile.username}
							onChangeText={(text) => setProfile({ ...profile, name: text })}
						/>
						<TextField
							label="Pronouns"
							value={profile.pronoun}
							onChangeText={(text) => setProfile({ ...profile, pronoun: text })}
						/>
						<TextField
							label="Bio"
							value={profile.about}
							onChangeText={(text) => setProfile({ ...profile, bio: text })}
							multiline
						/>
						<TextField
							label="Interests"
							value={profile.interests}
							onChangeText={(text) => setProfile({ ...profile, interests: text })}
						/>
					</View>

					{/* Save Button */}
					<Button
						onPress={saveProfile}
										loading={loading}
										style={styles.saveButton}
					>
						<Text>
							Save Profile
						</Text>

					</Button>
				</View>
			</ScrollView>
		</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    marginTop: 10,
  },
  divider: {
    marginVertical: 20,
  },
  form: {
    gap: 15,
  },
  saveButton: {
    marginTop: 20,
  },
});

export default ProfileScreen;
2
