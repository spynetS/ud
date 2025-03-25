import React, { useEffect, useCallback, useState, useRef } from 'react';

import { StyleSheet, Dimensions, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from "react-native-vector-icons/FontAwesome"; // Install if not already
import { useFocusEffect } from '@react-navigation/native';

import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import API, {getProfile} from "@/components/api";

import axios from "axios"

import {Chip,Colors, Spacings, Image, SegmentedControl, Text, Button, Assets, Modal, Card, View} from "react-native-ui-lib"
import { Link, router } from 'expo-router';
import { fontConfig } from 'react-native-paper/lib/typescript/styles/fonts';
import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

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



const ProfileCard = ({ card, open,user, bookmark_prop }) => {

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
			>
				<TouchableOpacity onPress={open} style={{width:"100%", height:height-150}}>
					<Image
						style={{ flex: 1, width: '100%',borderRadius: 100, marginTop:40 }}
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
							<RoundButton iconName={user.bookmarks.includes(card.id) ? "heart" : "heart-o"} onPress={()=>{bookmark(card.id); bookmark_prop(card.id);  }} />
						</View>
					</View>
				</TouchableOpacity>
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
	const [visible, setVisible] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)

	const [user,setUser] = useState(null);
	useFocusEffect(useCallback(()=>{

		getProfile().then(response=>{
				setUser(response);
			}).catch(error=>{
				router.push("/login", { relativeToDirectory: true })
			});
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
		<SafeAreaView style={{flex:1,backgroundColor:"white"}} >

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
							 activeBackgroundColor={Colors.white}
							 activeColor={Colors.primary}
							 backgroundColor={Colors.primary}

							 inactiveColor={Colors.white}
							 style={{height:50,width:300}}


				/>

				<View  style={{paddingHorizontal:20,width:"100%", flex:1, flexDirection:"row",justifyContent:"space-between"}}>

					<Link href="/profile" asChild>
						<Pressable>
							<FontAwesome name="cogs" style={{backgroundColor:"white", padding:12, borderRadius:100}} size={52}  />
						</Pressable>
					</Link>




					<TouchableOpacity >
 						<FontAwesome name="bell-o" size={52}  style={{backgroundColor:"white", padding:12, borderRadius:100}}/>
					</TouchableOpacity>
				</View>

			</View>


			{/* Swiper should take the rest of the space */}
			<View style={{ flex: 1, backgroundColor: "pink", overflow: 'visible'}}>

				<Swiper
					disableTopSwipe
					disableBottomSwipe
					showSecondCard={true}
					cards={profiles} renderCard={(card) => <ProfileCard card={card}
																			 user={user || {bookmarks:[]}}
																		bookmark_prop={val => {
																			if(user){
																				setUser(prevUser => ({
																					...prevUser, // Copy previous state
																					bookmarks: prevUser.bookmarks.filter(itm => itm !== val),
																				}));
																			}
																		}}
																		open={()=>{setVisible(true);setSelectedUser(card)}} />}
								   stackSize={2}
								   useViewOverflow={false}
								   verticalSwipe={false}
								   onSwipedRight={e=>swiped(profiles[e])}
								   containerStyle={{ marginTop: 0, backgroundColor:Colors.$backgroundDefault }}
				/>
			</View>
			<View style={{backgroundColor:"white", position:"fixed", zIndex:200,left:0,bottom:0, height:visible ? (height*0.8) : 0, width:width}} >
				<TouchableOpacity  onPress={()=>{setVisible(false)}}>
					<Icon name={"close"} size={52} color={Colors.primary} />
				</TouchableOpacity>

				{selectedUser ? (
					<ScrollView>

						<View style={{flex:1,flexDirection:"column", gap:12, paddingHorizontal:15,paddingBottom:100}} >
							<Text text70>
								Om mig
							</Text>
							<Text>
								{selectedUser.about}
							</Text>

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
						</View>


					</ScrollView>
				):(null)}

			</View>

		</SafeAreaView>

	);
};


export default SwipeScreen;
