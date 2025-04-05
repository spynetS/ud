import React, { useEffect, useCallback, useState, useRef } from 'react';
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from "react-native-vector-icons/FontAwesome"; // Install if not already
import { useFocusEffect } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';

import API, { getProfile } from "@/components/api";

import axios from "axios"

import {Chip,Colors, Spacings, Image, SegmentedControl, Text, Button, Assets, Modal, Card, View} from "react-native-ui-lib"
import { Link, router } from 'expo-router';

const { height, width } = Dimensions.get('window');

const NewEvent = ({small}) =>{
	return(
		<ImageBackground
			source={{uri:'http://192.168.1.119:8000/media/uploads/Erik-XIV-toppbild.jpg'}}
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
			<View style={{ padding: 10,  borderRadius: 100 }}>
				<Text white style={{fontSize:12}}>Enginering dinner</Text>
			</View>
		</ImageBackground>
	)
}


const EventScreen = () => {

	const [profiles, setProfile] = useState([]);
	const [school,setSchool] = useState<number>(0);

	const [user,setUser] = useState(null);
	useFocusEffect(useCallback(()=>{

		getProfile().then(response=>{
				setUser(response);
			}).catch(error=>{
				router.push("/login", { relativeToDirectory: true })
			});
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
					height:height-90,
				}} >
				<Text white heading2 marginB-10>
					Nya Event
				</Text>
				<ScrollView horizontal  >
					<NewEvent small>
					</NewEvent>
					<NewEvent small>
					</NewEvent>
					<NewEvent small>
					</NewEvent>
				</ScrollView>

				<Text white heading2 marginV-10>
					Populära Event
				</Text>
				<ScrollView  >
					<NewEvent></NewEvent>
					<NewEvent></NewEvent>
					<NewEvent></NewEvent>
					<View style={{ height: 100 }} />
				</ScrollView>


			</View>



		</SafeAreaView>

	);
};


export default EventScreen;
