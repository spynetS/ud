import React, { useEffect, useCallback, useState, useRef } from 'react';

import { Animated, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Pressable } from 'react-native';
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

	const [currentImage,setCurrentImage] = useState<string>("");
	const [imageIndex,setImageIndex] = useState<number>(0);
	useEffect(()=>{
		if(card){
			setCurrentImage(card.images[0]?.image || "");
		}
	},[card])


	const nextImage = (index:number) =>{
		if(card){
			setImageIndex(  (imageIndex + index + card.images.length) % card.images.length);
			setCurrentImage(card.images[imageIndex]?.image);
		}
	}

	if(!card) {return (<Text>Loading</Text>)}
	else {
		return (
			<ScrollView
				style={{backgroundColor:""}}
			>
				<View style={{position:"absolute",right:20, bottom:"10%",zIndex:200}}>
					<RoundButton iconName={user.bookmarks.includes(card.id) ? "heart" : "heart-o"} onPress={()=>{bookmark(card.id); bookmark_prop(card.id);  }} />
				</View>
				<View style={{
					position:"absolute",
					flex:1,
					flexDirection:"row",

					zIndex:100,
					width:"100%",
					height:height-150
				}} >
					<TouchableOpacity onPress={()=>{nextImage(-1)}} style={{width:"33%",height:"100%"}}>
					</TouchableOpacity>
					<TouchableOpacity onPress={open} style={{width:"33%",height:"100%"}}>
					</TouchableOpacity>
					<TouchableOpacity onPress={()=>nextImage(1)} style={{width:"33%",height:"100%"}}>
					</TouchableOpacity>

				</View>
				<View style={{width:"100%", height:height}}>
					<Image
						style={{ flex: 1, width: '100%',borderRadius: 0, marginTop:0 }}
							  resizeMode="cover"
							  source={{uri: `http://192.168.1.119:8000/${currentImage}`}}/>

					<View flex row center style={{position:"absolute",top:"7%",width:"100%", }} >
						<View flex row spread style={{width:"66%",marginTop:10, }} >

							{card?.images?.map((e,i)=>(
								<View style={{borderRadius:10,width:100,height:5,backgroundColor:i == imageIndex ? "#F2F2F2" : "#f2f2f250"}} >
								</View>
							))}
						</View>
					</View>

					<View style={{paddingLeft:15,position:"absolute", bottom:0,height:"25%",width:"100%", backgroundColor:"#00000000"}}  >
						<View style={{}}>
							<Text body white heading >
								{card.username}
							</Text>
							<Text body white >
								{card.programe}
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
	const [visible, setVisible] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)

	const [school,setSchool] = useState<number>(0);

	const animatedHeight = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.timing(animatedHeight, {
			toValue: visible ? height * 0.8 : 0,
			duration: 300, // Adjust the duration for smoothness
			useNativeDriver: false, // Can't animate height with native driver
		}).start();
	}, [visible]);

	const [user,setUser] = useState(null);
	useFocusEffect(useCallback(()=>{

		getProfile().then(response=>{
				setUser(response);
			}).catch(error=>{
				router.push("/login", { relativeToDirectory: true })
			});
		API.get('/get_swipes',{params:{school:school == 0 ? "all" : user?.school || "all"}})
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

	},[school]))

	return (
		<SafeAreaView style={{flex:1,backgroundColor:"white"}} >

			<View
				style={{
					position:"absolute",
					top:50,
					width: "100%",
					alignItems: "center",
					zIndex: 1000, // Ensures it's above other content
				}}
			>

				<View  style={{paddingHorizontal:5,width:"100%", flex:1, flexDirection:"row",justifyContent:"space-between"}}>

					<Link href="/profile" asChild>
						<Pressable>
							<FontAwesome name="cogs" size={22} color="white"  style={{backgroundColor:"#444444aa", padding:12, borderRadius:100}}/>
						</Pressable>
					</Link>

					<SegmentedControl
						segments={[{ label: 'Sverige' }, { label: user?.school || "" }]}
								 activeBackgroundColor={"#444444ff"}
								 activeColor={Colors.white}
								 backgroundColor={Colors.primary}
								 onChangeIndex={setSchool}
								 inactiveColor={Colors.white}
								 style={{}}


					/>

					<TouchableOpacity >
 						<FontAwesome name="bell-o" size={22} color="white"  style={{backgroundColor:"#444444aa", padding:12, borderRadius:100}}/>
					</TouchableOpacity>
				</View>



			</View>


			{/* Swiper should take the rest of the space */}
			<View style={{ flex: 1, backgroundColor: "pink", overflow: 'visible'}}>

				<Swiper
					disableTopSwipe
					disableBottomSwipe
					showSecondCard={true}
					cards={profiles}
					renderCard={(card) => <ProfileCard card={card}
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
					useViewOverflow={true}
					verticalSwipe={false}
					backgroundColor={"#444444"}
					onSwipedRight={e=>swiped(profiles[e])}
								   cardVerticalMargin={0}
								   cardHorizontalMargin={0}
				/>
			</View>
			<Animated.View style={{backgroundColor:"#000000ca",borderRadius:50, position:"fixed", zIndex:200,left:0,bottom:0, height:animatedHeight, width:width}} >
				<TouchableOpacity style={{marginTop:10, marginLeft:20}}  onPress={()=>{setVisible(false)}}>
					<Icon name={"close"} size={52} color={Colors.primary} />
				</TouchableOpacity>

				{selectedUser ? (
					<ScrollView>

						<View style={{flex:1,flexDirection:"column", gap:12, paddingHorizontal:15,paddingBottom:100}} >
							<Text text70 white>
								Om mig
							</Text>
							<Text white>
								{selectedUser.about}
							</Text>

							<Text text70 white>
								Intressen
							</Text>
							<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
								{selectedUser.interests.map((chip, index) => (
									<Chip labelStyle={{marginRight: Spacings.s1,fontFamily:"CustomFont", color:"white"}}  key={index} label={chip} />
								))}
							</View>
							<Text text70 white>
								Ditaljer
							</Text>
							<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
								{selectedUser.details.map((chip, index) => (
									<Chip labelStyle={{marginRight: Spacings.s1,fontFamily:"CustomFont",color:"white"}}  key={index} label={chip} />
								))}
							</View	>
						</View>


					</ScrollView>
				):(null)}

			</Animated.View>

		</SafeAreaView>

	);
};


export default SwipeScreen;
