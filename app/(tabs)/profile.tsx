import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

import { View, TextField, Button, Text, Avatar} from 'react-native-ui-lib';

//<Divider d10 testID={'divider'}/>

import * as ImagePicker from 'expo-image-picker';

const Divider = ({ color = '#D3D3D3', height = 1, marginV = 10 }) => (
  <View style={{ height, backgroundColor: color, width: '100%', marginVertical: marginV }} />
);

const ProfileScreen = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    pronoun: 'He/Him',
    bio: 'A passionate explorer and software developer.',
    interests: 'Coding, Hiking, Photography',
    profile_picture: 'https://via.placeholder.com/150', // Default profile pic
  });

  const [loading, setLoading] = useState(false);

  // Function to handle image selection
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

    <ScrollView contentContainerStyle={styles.container}>
			{/* Profile Picture */}
			<View style={styles.profileContainer}>
				<TouchableOpacity onPress={pickImage}>
					<Avatar size={100} source={{ uri: profile.profile_picture }} />
				</TouchableOpacity>
				<Text style={styles.name}>{profile.name}</Text>
			</View>

			<Divider />

			{/* Editable Fields */}
			<View style={styles.form}>
				<TextField
					label="Name"
					value={profile.name}
					onChangeText={(text) => setProfile({ ...profile, name: text })}
				/>
				<TextField
					label="Pronouns"
					value={profile.pronoun}
					onChangeText={(text) => setProfile({ ...profile, pronoun: text })}
				/>
				<TextField
					label="Bio"
					value={profile.bio}
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
		</ScrollView>
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
