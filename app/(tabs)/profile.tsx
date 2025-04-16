import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import axios from "axios"

import { View, TextField, Button, Text, Avatar, Chip } from 'react-native-ui-lib';
import { useFocusEffect } from '@react-navigation/native';

//<Divider d10 testID={'divider'}/>

import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { endPoint, getProfile } from '@/components/api';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Divider = ({ color = '#D3D3D3', height = 1, marginV = 10 }) => (
	<View style={{ height, backgroundColor: color, width: '100%', marginVertical: marginV }} />
);

const ProfileScreen = () => {
	const [profile, setProfile] = useState({});

	const [loading, setLoading] = useState(false);

	const [user,setUser] = useState(null);
	useFocusEffect(useCallback(() => {
		getProfile().then(response=>{
			setUser(response);
		})
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

	const logout = () => {
		AsyncStorage.setItem("access_token", "");

	}

	const Entry = ({label,value,onChange}) => {
		return(
			<View >
				<Text white>
					{label}
				</Text>
				<TextField placeholder="Skriv" value={value} style={styles.input} />

			</View>
		)
	}

	return (
		<SafeAreaView style={{backgroundColor:"#000"}}>
			<ScrollView contentContainerStyle={styles.container}>
				<View center marginT-10 marginB-12 >
					<Avatar size={120} source={{uri: endPoint + user?.images[0].image}} />
				</View>

				<View row center >
					<Entry label={"Förnamn"} value={user?.first_name} />
					<Entry label={"Efternamn"} value={user?.last_name} />
				</View>

				<Entry label={"Email"} value={user?.email} />
				<Entry label={"Bor"} value={user?.location} />
				<Entry label={"Program"} value={user?.programe} />
				<Entry label={"Skola"} value={user?.school} />

				<Text white >
					Detaljer
				</Text>
				<View row center style={styles.chiper} >
					<Chip labelStyle={{color:"white"}} label={"knas"} />
					<Chip labelStyle={{color:"white"}} label={"knas"} />
					<Chip labelStyle={{color:"white"}} label={"knas"} />
					<Chip labelStyle={{color:"white"}} label={"knas"} />
					<Chip labelStyle={{color:"white"}} label={"knas"} />
				</View>

				<Button
					onPress={logout}
							loading={loading}
							style={styles.saveButton}
				>
					<Text>
						Logout
					</Text>
				</Button>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor:"#000"
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
	input: {
		backgroundColor:"#000",
		borderColor:"gray",
		borderWidth:1,
		color:"#a2a2a2",
		padding: 10,
		paddingTop:5,
		paddingBottom:5,
		marginBottom: 10,
		marginTop:5,
		borderRadius: 15
	},
	chiper:{
		backgroundColor:"#111",
		borderRadius:12,
		padding:12
	}

});

export default ProfileScreen;
