import React, { useEffect, useCallback, useState, useRef } from 'react';
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from "react-native-vector-icons/FontAwesome"; // Install if not already
import { useFocusEffect } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';

import API from "@/components/api";

import axios from "axios"

import {Chip,Colors, Spacings, Image, SegmentedControl, Text, Button, Assets, Modal, Card, View} from "react-native-ui-lib"
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
	API.post("/bookmark/",{'userId':userId}).then(response=>{
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
							<Text white text90>
								{card.swipes}
							</Text>

						</View>
						<View style={{flex:1, flexDirection:'row', justifyContent:"space-around", width:"100%",marginTop:15, paddingRight:15}}>
							<RoundButton iconName="heart" onPress={()=> bookmark(card.id)} />
							<Link href={`profileswipe?userId=${card.id}`}>
								<RoundButton iconName="info" />
							</Link>
						</View>
					</View>
				</View>

			</ScrollView>
		);
	}
}

function swiped(profile:any) {
	console.log(profile)

	API.post("/swipe/",{
		"id": profile.id,
		"direction":"right"
	}).then(response=>{
		console.log(response)
	}).catch(error=>{

	})

}

const SwipeScreen = () => {

	const [profiles, setProfile] = useState([]);
	const [value, setValue] = React.useState('sverige');
	const [visible, setVisible] = useState(false)

	useFocusEffect(useCallback(()=>{

		API.get('/get_swipes')
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

	},[]))

	return (
		<SafeAreaView style={{flex:1}} >

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
								onSwipedRight={e=>swiped(profiles[e])}
								containerStyle={{ marginTop: 0, backgroundColor:Colors.$backgroundDefault }}
				/>
			</View>

		</SafeAreaView>

	);
};


export default SwipeScreen;
