import React, { useEffect, useCallback, useState, useRef } from 'react';
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity, ImageBackground, TextInput, Platform } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useFocusEffect } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { GiPartyPopper } from "react-icons/gi";
import API, { getProfile } from "@/components/api";

import axios from "axios"

import { Chip, Colors, Spacings, Image, SegmentedControl, Text, Button, Assets, Modal, Card, View } from "react-native-ui-lib"
import Icon from "react-native-vector-icons/FontAwesome"; // Install if not already

import ImagePickerComponent from "@/components/ImagePicker";
import { readFile } from 'react-native-fs';
import { Link, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Avatar } from 'react-native-ui-lib/src/components/avatar';
import { DateTimePicker } from 'react-native-ui-lib/src/components/dateTimePicker';
import { Asset } from 'react-native-image-picker';

const { height, width } = Dimensions.get('window');


export type User = {
	id: number;
	username: string;
};

// Define the Event type
export type Event = {
  id: number;
  date: string; // ISO 8601 Date string
  location: string;
  description: string;
	creator: User; // Creator is a user object
	coming: User[]; // List of users attending the event
	image: string | null; // URL to the image, can be null if no image is provided
};


const CreateEventScreen = () => {

	const [profiles, setProfile] = useState([]);
	const [school,setSchool] = useState<number>(0);
	const [date, setDate] = useState(new Date());
	const [image,setImage] = useState<Asset>();

	const [title,setTitle] = useState<string>();
	const [description,setDescription] = useState<string>();
	const [location,setLocation] = useState<string>();

	const [user,setUser] = useState(null);
	const [loading, setLoading] = useState<boolean>(false);

	useFocusEffect(useCallback(()=>{

		getProfile().then(response=>{
				setUser(response);
			}).catch(error=>{
				router.push("/login", { relativeToDirectory: true })
			});
	},[]))

	const publish2 = () => {
		let data = new FormData();

		// Make sure the image is appended correctly to FormData
		if (image && image.uri) {
			data.append('image',{
				uri: image.uri,
				type: image.type,
				name: image.fileName || 'image.jpg',
			});
		}

		// Append other form fields to the FormData
		data.append('title', title);
		data.append('description', description);
		data.append('location', location);
		data.append('date', date.toISOString()); // Ensure proper date format
		data.append('creator', user.id); // Assuming user ID is available
		//data.append('coming', JSON.stringify([])); // Empty array for 'coming' users
		console.log(data)
		// Post the data using FormData with the correct headers
		API.post("/events/create/", data, {
			headers: {
			//	'Content-Type': 'multipart/form-data', // Ensure the header is set for file uploads
			},
		})
		   .then(response => {
			   router.push("/events"); // Redirect to events page after success
		   })
		   .catch(error => {
			   console.error('Error creating event:', error); // Handle errors
		   });
	};

	const publish = () =>{
		setLoading(true)
		API.post("/events/create/",{
			title:title,
			description:description,
			location:location,
			date:date,
			creator:user.id,
			image:image?.base64
		}).then(response=>{
			router.push("/events");
			setLoading(false)

		}).catch(error=>{})


	}

	return (
		<SafeAreaView style={{flex:1,backgroundColor:"#000",padding:20}} >
			<Text heading white marginB-20>
				Skapa Event {event?.id}
			</Text>
			<ImagePickerComponent onImage={setImage} />
			<Text body white marginB-10>
				Titel
			</Text>
			<TextInput
				placeholder={"Titel"}
							value={title}
							onChangeText={setTitle}
							style={styles.input}
			/>
			<Text body white marginB-10>
				Beskrivning
			</Text>
			<TextInput
				placeholder={"Beskrivning"}
				multiline={true}
							value={description}
							onChangeText={setDescription}
							style={styles.input}
			/>
			<Text body white marginB-10>
				Plats
			</Text>
			<TextInput
				placeholder={"Namn + adress"}
							value={location}
							onChangeText={setLocation}
							style={styles.input}
			/><Text body white marginB-10>
				Datom och tid
			</Text>
			<DateTimePicker
				value={date}
				style={{color:"#a2a2a2"}}
				containerStyle={styles.input}

				mode="date"
				display={Platform.OS === 'ios' ? 'spinner' : 'default'}
				onChange={(e, selectedDate) => {
					setDate(selectedDate || date);
				}}
			/>

			<Button onPress={publish} disabled={loading} backgroundColor={Colors.primary} >
				<Text color="white">
					Publicera
				</Text>
			</Button>


		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	input: { backgroundColor:"#000", borderColor:"#28272A", borderWidth:2,color:"#a2a2a2", padding: 10, marginBottom: 10, borderRadius: 15 },
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		//backgroundColor: '#fff',
	},
})


export default CreateEventScreen;
