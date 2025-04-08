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
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Avatar } from 'react-native-ui-lib/src/components/avatar';
import { DateTimePicker } from 'react-native-ui-lib/src/components/dateTimePicker';
import { LinearGradient } from 'expo-linear-gradient';

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

	const [event,setEvent] = useState<Event>(null);
	const [userComming,setUserComming] = useState<boolean>(false)

	const glob = useLocalSearchParams();

	useEffect(()=>{
		setEvent(JSON.parse(glob.event))
	},[])


	const [user,setUser] = useState(null);
	useFocusEffect(useCallback(()=>{

		getProfile().then(response=>{
			setUser(response);
			const event : Event = JSON.parse(glob.event);
			setUserComming(event.coming.includes(response.username))
		}).catch(error=>{
			router.push("/login", { relativeToDirectory: true })
			});

	},[]))

	const comming = () =>{
		setUserComming(!userComming)
		API.post("events/comming/",{
			event:event?.id
		}).then(response=>{
			setUserComming(response.data.added)
		}).catch(error=>{})
	}

	return (
		<SafeAreaView style={{flex:1,backgroundColor:"#000",}} >
			<Image style={{height:height*0.35}} source={{uri:event?.image}}/>
			<ScrollView style={styles.card} >
				<View>
					<Text style={{color:"gray"}}>
						Kommer: {event?.coming.length}
					</Text>
					<Text heading2 white>
						{event?.title}
					</Text>
				</View>

				<View
					style={{
						borderBottomColor: 'gray',
						marginVertical:20,
						borderBottomWidth: StyleSheet.hairlineWidth,
					}}
				/>

				<View row centerV>
					<FontAwesome5 color={Colors.primary} name="calendar" />
					<Text marginL-10  text white style={{color:"#A0A0A0"}}>
						{new Date(event?.date).toDateString()}
					</Text>
				</View>
				<View marginT-2 row centerV>
					<FontAwesome5 color={Colors.primary} name="map-pin" />
					<Text marginL-10  text white style={{color:"#A0A0A0"}}>
						{event?.location}
					</Text>
				</View>

				<Text marginT-10 body white>
					Detaljer
				</Text>

				<Text marginT-20 body style={{color:"#a0a0a0"}} >
					{event?.description}
				</Text>
				<View style={{height:200}}></View>
			</ScrollView>
			<View style={styles.buttonDiv} >
				<LinearGradient
					colors={['transparent', 'black']}
					style={styles.gradient}
					locations={[0, 1]}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 1 }}
				/>
				{event?.creator === user?.id ? (
					<Button marginT-20 backgroundColor={Colors.primary}>
						<Text white>
							TABORT
						</Text>
					</Button>
				) : (
					<TouchableOpacity onPress={comming} style={{marginTop:20,backgroundColor:Colors.primary, paddingVertical:10,paddingHorizontal:20, borderRadius:50}} >
						<View row centerV spread>
							<Text white>
								Kommer
							</Text>
							<FontAwesome marginL-10 color="white" name={userComming?"check-circle":"check-circle-o"} size={24} />
						</View>
					</TouchableOpacity>
				)}

			</View>
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
	card: {
		position:"absolute",
		bottom:0,
		backgroundColor:"#000",
		borderRadius:20,
		padding:20,
		height:height*0.7,
        width: width,
		gap:6,
	},
	buttonDiv: {
		position:"absolute",
		bottom:0,
		width:width,
		height:height*0.5,
		justifyContent:"flex-end",
		padding:20

	},
	  gradient: {
		  ...StyleSheet.absoluteFillObject,
	  },
})


export default CreateEventScreen;

/* {event?.creator === user?.id ? (
   <Button marginT-20 backgroundColor={Colors.primary}>
   <Text white>
   TABORT
   </Text>
   </Button>
   ) : (
   <TouchableOpacity onPress={comming} style={{marginTop:20,backgroundColor:Colors.primary, paddingVertical:10,paddingHorizontal:20, borderRadius:50, width:width*0.5}} >
   <View row centerV spread>
   <Text white>
   Kommer
   </Text>
   <FontAwesome marginL-10 color="white" name={userComming?"check-circle":"check-circle-o"} size={24} />
   </View>
   </TouchableOpacity>
   )} */
