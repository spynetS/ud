import React, { useEffect, useCallback, useState, useRef } from 'react';
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity, ImageBackground, TextInput, Platform } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { EventArg, useFocusEffect } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { GiPartyPopper } from "react-icons/gi";
import API, { getProfile } from "@/components/api";

import axios from "axios"

import { Chip, Colors, Spacings, Image, SegmentedControl, Text, Button, Assets, Modal, Card, View } from "react-native-ui-lib"
import Icon from "react-native-vector-icons/FontAwesome"; // Install if not already

import { Link, router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Avatar } from 'react-native-ui-lib/src/components/avatar';
import { DateTimePicker } from 'react-native-ui-lib/src/components/dateTimePicker';

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
	const [event,setEvent] = useState<Event>(null);

	const glob = useLocalSearchParams();

	useEffect(()=>{
		setEvent(JSON.parse(glob.event))
	})


	const [user,setUser] = useState(null);
	useFocusEffect(useCallback(()=>{

		getProfile().then(response=>{
				setUser(response);
			}).catch(error=>{
				router.push("/login", { relativeToDirectory: true })
			});

	},[]))



	return (
		<SafeAreaView style={{flex:1,backgroundColor:"#000",padding:20}} >
			<Image style={{width:width, height:100}} source={{uri:event?.image}}/>

			<Text heading2 white>
				{event?.title}
			</Text>
			<Text body white>
				{event?.description}
			</Text>

		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	input: { backgroundColor:"#28272A",color:"#a2a2a2", padding: 10, marginBottom: 10, borderRadius: 15 },
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		//backgroundColor: '#fff',
	},
})


export default CreateEventScreen;
