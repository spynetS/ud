import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Dimensions, ScrollView, View, TouchableOpacity} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from "react-native-vector-icons/FontAwesome"; // Install if not already

import API from "@/components/api";

import axios from "axios"

import {Chip,Colors, Spacings, Image, SegmentedControl, Text, Button, Assets, Modal, Card} from "react-native-ui-lib"
import { Link } from 'expo-router';

const { height, width } = Dimensions.get('window');

const RoundButton = ({ onPress, iconName }) => {
  return (
      <TouchableOpacity style={{
		  width: 50,
		  height: 50,
		  borderRadius: 25, // Makes it round
		  backgroundColor: "#007AFF", // Change color as needed
		  justifyContent: "center",
		  alignItems: "center",
		  elevation: 5, // Adds shadow on Android
		  shadowColor: "#000",
		  shadowOffset: { width: 0, height: 2 },
		  shadowOpacity: 0.3,
		  shadowRadius: 2,
	  }} onPress={onPress}>
		  <Icon name={iconName} size={24} color="#fff" />
      </TouchableOpacity>
  );
};


const bookmark = (userId=>{
	API.post("http://192.168.1.119:8000/api/bookmark/",{'userId':userId}).then(response=>{
		console.log(response.data)
	}).catch(error=>{
		console.log(error)
	})
})


const ProfileCard = ({ card, open }) => {

	if(!card) {return (<Text>Loading</Text>)}
	else {
	return (
		<ScrollView >
			<View style={{width:"100%", height:height-150}}>
				<Image
					style={{ flex: 1, width: '100%',borderRadius: 20 }}
								resizeMode="cover"
								source={{uri: `http://192.168.1.119:8000/${card.profile_picture}`}}/>
				<View style={{position:"absolute", bottom:15, left:15,width:"100%"}}  >
					<View style={{}}>
						<Text white text40 >
							{card.username}
						</Text>
						<Chip
							resetSpacings
							label={card.pronoun}
										labelStyle={{marginRight: Spacings.s1}}
										backgroundColor={"white"}
										containerStyle={{
											borderWidth: 0,
											width:80
											//marginLeft: Spacings.s3
										}}/>
						<Text white text90>
							{card.programe}
						</Text>
					</View>
					<View style={{flex:1, flexDirection:'row', justifyContent:"space-around", width:"100%",marginTop:15, paddingRight:15}}>
						<RoundButton iconName="heart" onPress={()=> bookmark(card.id)} />
						{/* 						<RoundButton iconName="chevron-down" onPress={() => navigation.navigate('Profile', { card })} /> */}
						<Link
							href={{
							pathname: 'profileswipe',
							params: { id:card.id }
						}}>
							asdk
						</Link>
					</View>
				</View>
			</View>

		</ScrollView>
	);
	}
}

const SwipeScreen = () => {

	const [profiles, setProfile] = useState([]);
	const [value, setValue] = React.useState('sverige');
	const [visible, setVisible] = useState(false)

	useEffect(()=>{
		API.get('http://192.168.1.119:8000/api/get_swipes')
			 .then(function (response) {
				 // handle success
				 setProfile(response.data.concat(response.data));
			 })
			 .catch(function (error) {
				 // handle error
				 console.log(error);
			 })
			 .finally(function () {
				 // always executed
			 });

	},[])

	return (
		<View style={{ flex: 1 }}>
			{/* Wrap SegmentedButtons in a dedicated View */}
			<View
				style={{
					position: "absolute", // Acts like "fixed" in web
					top: 0,
					left: 0,
					right: 0,
					width: "100%",
					paddingTop: 8,
					paddingVertical: 10,
					backgroundColor: "white", // Optional, prevents transparency issues
					alignItems: "center",
					zIndex: 1000, // Ensures it's above other content
				}}
			>
				<SegmentedControl
					segments={[{ label: 'Sverige' }, { label: 'Lunds Universited' }]}
									 activeBackgroundColor={Colors.$backgroundPrimaryHeavy}
									 activeColor={Colors.white}
				/>
			</View>


			{/* Swiper should take the rest of the space */}
		<View style={{ flex: 1, backgroundColor: "pink" }}>
			<Swiper
				cards={profiles}
							renderCard={(card) => <ProfileCard card={card} open={()=>setVisible(true)} />}
							stackSize={3}
							verticalSwipe={false}
							containerStyle={{ marginTop: 0, backgroundColor:Colors.$backgroundDefault }}
			/>
		</View>

		</View>

	);
};


export default SwipeScreen;
