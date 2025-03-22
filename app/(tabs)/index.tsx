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
import { fontConfig } from 'react-native-paper/lib/typescript/styles/fonts';
import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler';

const { height, width } = Dimensions.get('window');

const RoundButton = ({ onPress, iconName }) => {
  return (
      <TouchableOpacity style={{
		  width: 64,
		  height: 64,
		  borderRadius: 25, // Makes it round
		  //backgroundColor: "#007AFF", // Change color as needed
		  justifyContent: "center",
		  alignItems: "center",
		  elevation: 5, // Adds shadow on Android
		  shadowColor: "#000",
		  shadowOffset: { width: 0, height: 2 },
		  shadowOpacity: 0.3,
		  shadowRadius: 2,
	  }} onPress={onPress}>
		  <Icon name={iconName} size={64} color={Colors.primary} />
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

	const scrollViewRef = useRef(null); // Create a ref for the ScrollView
	const scrollToBottom = () => {
		if (scrollViewRef.current) {
			scrollViewRef.current.scrollToEnd({ animated: true }); // Scroll to bottom
		}
	  };

	if(!card) {return (<Text>Loading</Text>)}
	else {
		return (
			<ScrollView
				style={{height:height*5}}
			ref={scrollViewRef}
			>
			<TouchableOpacity onPress={open} style={{width:"100%", height:height-150}}>
				<Image
					style={{ flex: 1, width: '100%',borderRadius: 100 }}
					resizeMode="cover"
					source={{uri: `http://192.168.1.119:8000/${card.profile_picture}`}}/>
				<View style={{position:"absolute", bottom:15, left:15,width:"100%"}}  >
					<View style={{}}>
						<Text body white heading >
							{card.username}
						</Text>
						<Chip
							resetSpacings
							label={card.pronoun}
							labelStyle={{marginRight: Spacings.s1,fontFamily:"CustomFont"}}
							backgroundColor={"white"}
							containerStyle={{
								borderWidth: 0,
								width:80
							}}/>
						<Text body white >
							{card.programe}
						</Text>
						<Text white body>
							{card.swipes}
						</Text>

					</View>
					<View style={{position:"absolute",right:20}}>
						<RoundButton iconName="heart" onPress={()=> bookmark(card.id)} />
					</View>
				</View>
			</TouchableOpacity>
				<View style={{height:"100%", backgroundColor:"white"}} >
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
	const [selectedUser, setSelectedUser] = useState(null)

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
							 activeBackgroundColor={Colors.white}
							 activeColor={Colors.primary}
							 backgroundColor={Colors.primary}

							 inactiveColor={Colors.white}
							 style={{height:50,width:"90%"}}

				/>
			</View>


			{/* Swiper should take the rest of the space */}
			<View style={{ flex: 1, backgroundColor: "pink", overflow: 'visible'}}>

				<Swiper
					disableTopSwipe
					disableBottomSwipe
					showSecondCard={true}
								   cards={profiles} renderCard={(card) => <ProfileCard card={card} open={()=>{setVisible(true);setSelectedUser(card)}} />}
								   stackSize={2}
								   useViewOverflow={false} // ✅ Fix for Android clipping issue
					verticalSwipe={false}
								   onSwipedRight={e=>swiped(profiles[e])}
								   containerStyle={{ marginTop: 0, backgroundColor:Colors.$backgroundDefault }}
				/>
			</View>
			<View style={{backgroundColor:"white", position:"fixed", zIndex:200,left:0, height:visible ? (height*0.8) : 0, width:width}} >
				<TouchableOpacity onPress={()=>{setVisible(false)}}>
					<Icon name={"close"} size={52} color={Colors.primary} />
				</TouchableOpacity>

				{selectedUser ? (
					<ScrollView>

						<View style={{flex:1,flexDirection:"column", gap:12, paddingHorizontal:15,paddingBottom:100}} > <View >
							<Text text70>
								Om mig
							</Text>
							<Text>
								{selectedUser.about}
							</Text>
						</View>

						<Text text70>
							Intressen
						</Text>
						<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
							{selectedUser.interests.map((chip, index) => (
								<Chip labelStyle={{marginRight: Spacings.s1,fontFamily:"CustomFont"}}  key={index} label={chip} />
							))}
						</View>
						<Text text70>
							Ditaljer
						</Text>
						<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
							{selectedUser.details.map((chip, index) => (
								<Chip labelStyle={{marginRight: Spacings.s1,fontFamily:"CustomFont"}}  key={index} label={chip} />
							))}
						</View	>

				
					</ScrollView>
				):(null)}

			</View>

		</SafeAreaView>

	);
};


export default SwipeScreen;
