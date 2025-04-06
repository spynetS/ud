import React, { useEffect, useCallback, useState, useRef } from 'react';
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useFocusEffect } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons'; // If using expo
import API, { getProfile } from "@/components/api";

import axios from "axios"

import { Chip, Colors, Spacings, Image, SegmentedControl, Text, Button, Assets, Modal, Card, View } from "react-native-ui-lib"
import Icon from "react-native-vector-icons/FontAwesome"; // Install if not already

import { Link, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Avatar } from 'react-native-ui-lib/src/components/avatar';

const { height, width } = Dimensions.get('window');

const RoundButton = ({ onPress, iconName }) => {
  return (
      <TouchableOpacity style={{
		  width: 64,
		  height: 64,
		  borderRadius: "100%", // Makes it round
		  backgroundColor: Colors.primary, // Change color as needed
		  justifyContent: "center",
		  alignItems: "center",
		  elevation: 5, // Adds shadow on Android
	  }} onPress={onPress}>
		  <Icon name={iconName} size={24} color={"white"} />
      </TouchableOpacity>
  );
};


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


const NewEvent = ({event,small}) =>{
	const getMonthName = (date: string): string => {
		const eventDate = new Date(date);
		const options = { month: 'long' };  // Use 'long' for full month name
		return eventDate.toLocaleString('sv-SE', options); // Outputs the month name (e.g., "April")
	};


	return(
		<TouchableOpacity key={event.id}>
			<View center style={{
				position:"absolute",
				top:0,
				zIndex:10,
				padding:3,
				borderRadius:10,
				backgroundColor:"#fff",
				flexDirection:"column",


			}} >
				<Text style={{fontWeight:"bold"}} >
					{new Date(event.date).getDay()}
				</Text>
				<Text style={{fontWeight:"bold"}}>
					{getMonthName(event.date)}
				</Text>

			</View>
			<ImageBackground
				source={{uri:event?.image}}
					   style={{
						   margin:10,
						   width:  small? 120 : "100%",
						   height: small? 120 : height*0.2,
						   borderRadius: 20,
						   overflow: 'hidden', // 🔥 this is key
						   justifyContent: 'flex-end',
					   }}
					   resizeMode="cover" // or "contain", "stretch", etc.
			>
				<View style={{padding:12,backgroundColor:"#00000040"}}>

					<View row centerV style={{}}>
						{!small?(
							<View row center>

								<FontAwesome5 name="glass-cheers" size={12} color="white" />
								<Text heading2 white marginL-10>{event?.title}</Text>
							</View>)
						:(
							<Text body white style={{fontWeight:"bold"}}>{event?.title}</Text>
						)}

					</View>
					{!small?(
						<View row centerV>
							<Avatar size={28} source={{uri:event?.creator.images[0].image}} />
							<Text body white marginL-10>{event?.creator.first_name} {event?.creator.last_name}</Text>
						</View>)
					:""}
				</View>
			</ImageBackground>

		</TouchableOpacity>
	)
}


const EventScreen = () => {

	const [profiles, setProfile] = useState([]);
	const [school,setSchool] = useState<number>(0);

	const [newstEvents, setNewestEvents] = useState(null);
	const [popularEvents, setPopularEvents] = useState(null);

	const [user,setUser] = useState(null);
	useFocusEffect(useCallback(()=>{

		getProfile().then(response=>{
				setUser(response);
			}).catch(error=>{
				router.push("/login", { relativeToDirectory: true })
			});

		API.get("get_events?filter=newest").then(response=>{
			setNewestEvents(response.data);
		}).catch(error=>{

		})
		API.get("get_events?filter=popular").then(response=>{
			setPopularEvents(response.data);
		}).catch(error=>{

		})

	},[]))

	return (
		<SafeAreaView style={{flex:1,backgroundColor:"#000",}} >

			<View
				style={{
					position:"absolute",
					top:45,
					width: "100%",
					alignItems: "center",
					zIndex: 1000, // Ensures it's above other content
				}}
			>
				<SegmentedControl
					segments={[{ label: 'Sverige' }, { label: user?.school || "" }]}
					activeBackgroundColor={Colors.primary}
					activeColor={Colors.white}
					backgroundColor={"#010101aa"}
					onChangeIndex={setSchool}
					inactiveColor={Colors.white}
				/>
			</View>

			<View
				style={{
					marginTop:50,
					padding:20,
					height:height-50,
				}} >
				<Text white heading2 marginB-10>
					Nya Event
				</Text>
				<ScrollView horizontal  >
					{newstEvents?.map(event=>(<NewEvent event={event} small />))}
				</ScrollView>

				<Text white heading2 marginV-10>
					Populära Event
				</Text>
				<ScrollView style={{height:height*0.6}}  >

					{popularEvents?.map(event=>(<NewEvent event={event} />))}


					<View style={{ height: 100 }} />
				</ScrollView>


			</View>

			<View style={{position:"absolute",right:30, bottom:"10%",zIndex:200}}>
				<RoundButton iconName={"plus"}  />
			</View>


		</SafeAreaView>

	);
};


export default EventScreen;
