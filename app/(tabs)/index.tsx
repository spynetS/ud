import React, { useEffect, useCallback, useState, useRef } from 'react';

import { Animated, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Pressable, Modal } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from "react-native-vector-icons/FontAwesome"; // Install if not already
import { useFocusEffect } from '@react-navigation/native';

import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import API, {getProfile, endPoint} from "@/components/api";

import axios from "axios"

import { Chip, Colors, Spacings, Image, SegmentedControl, Text, View, Dialog, PanningContext, Button, Card } from "react-native-ui-lib"
import { Link, router } from 'expo-router';
import { fontConfig } from 'react-native-paper/lib/typescript/styles/fonts';
import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { Avatar } from 'react-native-ui-lib/src/components/avatar';

const { height, width } = Dimensions.get('window');
type Image = {
	image:string,
}

type User = {
	id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  pronoun: string;
  programe: string;
  location: string;
  about: string;
  details: string[];
  interests: string[];
  profile_picture: string | null;
	images: Image[] | null;
  more_images: string[];
  bookmarks: number[];
  swipes: number;
};


const MatchModal = ({close, user, matchUser}) => {

	return (
		<BlurView
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: width,
				height: height,
				flexDirection: "column",
				alignItems: "center",

				backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent overlay
				zIndex: 999, // make sure it's on top
				paddingTop: 100,
			}}
		intensity={5}
		experimentalBlurMethod="dimezisBlurView"
		>
		<Text heading white>
			It's a Match!
		</Text>
		<Text heading2 white>
			Alfred likes you!
		</Text>
		<View row spread style={{width:width*2/3}}>
			<Avatar size={100} source={{uri:endPoint+user?.images[0].image}} />
			<Avatar size={100} source={{uri:endPoint+matchUser?.images[0].image}} />
		</View>
		<Button
			onPress={()=>{close();router.push({pathname:"/messageUser",params:{pressedUser:JSON.stringify(matchUser)}})}}
					style={{marginTop:20}} >
			<Text white>
				Send a Message!
			</Text>
		</Button>
		<Button onPress={close} style={{marginTop:20}} >
			<Text white>
				Keep Swiping
			</Text>
		</Button>
		</BlurView>

	);
}

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


const unbookmark = (userId=>{
	API.post("/unbookmark/",{'userId':userId}).then(response=>{
		console.log(response.data)
	}).catch(error=>{
		console.log(error)
	})
})

const bookmark = (userId=>{
	API.post("/bookmark/",{'userId':userId}).then(response=>{
		console.log(response.data)
	}).catch(error=>{
		console.log(error)
	})
})


const ProfileCard = ({ card, open,user }) => {

	const [currentImage,setCurrentImage] = useState<string>("");
	const [imageIndex,setImageIndex] = useState<number>(0);
	const [hearted,setHearted] = useState<boolean>(false);

	useEffect(()=>{
		if(card){
			setHearted(user.bookmarks.includes(card.id));
			setCurrentImage(card.images[0]?.image || "");
		}
	},[card])


	const nextImage = (step: number) => {
		if (card && card.images?.length > 0) {
			const total = card.images.length;
			const newIndex = (imageIndex + step + total) % total;

			setImageIndex(newIndex);
			setCurrentImage(card.images[newIndex]?.image);
		}
	};

	if(!card) {return (<Text>Loading</Text>)}
	else {
		return (
			<ScrollView
				style={{backgroundColor:""}}
			>
				<View style={{position:"absolute",right:30, bottom:"15%",zIndex:200}}>
					<RoundButton iconName={hearted ? "heart" : "heart-o"} onPress={()=>{!hearted ? bookmark(card.id) : unbookmark(card.id); setHearted(!hearted)  }} />
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
				<View center style={{width:width, height:height-40,marginTop:20}}>
					<Image
						style={{ flex: 1, width: width-40,borderRadius: 30, marginTop:0 }}
						resizeMode="cover"
						source={{uri: `${endPoint}/${currentImage}`}}/>

					<View center style={{ position: "absolute", top: "7%", width: "100%" }}>
						<View
							flex
							row
							center
							spread
							style={{
								width: width*2/3,
								marginTop: 10,
							}}
						>
							{card?.images?.map((e, i) => (
								<View
									key={i} // Always add a key when mapping
									style={{
										borderRadius: 10,
										marginHorizontal:8,
										width: 50,
										height: 5,
										backgroundColor: i === imageIndex ? "#F2F2F2" : "#f2f2f250",
									}}
								/>
							))}
						</View>
					</View>

					<View style={{paddingLeft:35,position:"absolute", bottom:0,height:"30%",width:"100%", backgroundColor:"#00000000"}}  >
						<View style={{}}>
							<Text body white heading >
								{card.first_name} {card.last_name}
							</Text>
							<Text heading2 white marginB-10 marginL-2>
								{card.programe}
							</Text>
							<Chip
								resetSpacings
								label={card.school}
								labelStyle={{color:"white",marginRight: Spacings.s1,fontFamily:"CustomFont"}}
								backgroundColor={"#88888850"}
								containerStyle={{
									borderWidth: 0,
									width:(card.school.length*7)
								}}/>
						</View>

					</View>

				</View>
			</ScrollView>

		);
	}
}



const SwipeScreen = () => {

	const [profiles, setProfile] = useState([]);
	const [visible, setVisible] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)
	const [school,setSchool] = useState<number>(0);

	const [isMatch,setIsMatch] = useState<boolean>(false);
	const [matchUser,setMatchUser] = useState<User>(null)

	const animatedHeight = useRef(new Animated.Value(0)).current;

	function swiped(profile:any) {
		API.post("/swipe/",{
			"id": profile.id,
			"direction":"right"
		}).then(response=>{
			if(response.data.match === true){
				setIsMatch(true);
				setMatchUser(response.data.other);
			}
		}).catch(error=>{

		})

	}

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
			{isMatch && user ? <MatchModal user={user} matchUser={matchUser} close={()=>{setIsMatch(false)}} /> : ""}
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
							<FontAwesome name="cogs" size={22} color="white"  style={{backgroundColor:"#000000da", padding:12, borderRadius:100}}/>
						</Pressable>
					</Link>

					<SegmentedControl
						segments={[{ label: 'Sverige' }, { label: user?.school || "" }]}
						activeBackgroundColor={Colors.primary}
						activeColor={Colors.white}
						backgroundColor={"#010101aa"}
						onChangeIndex={setSchool}
						inactiveColor={Colors.white}
					/>

					<TouchableOpacity >
 						<FontAwesome name="bell-o" size={22} color="white"  style={{backgroundColor:"#000000da", padding:12, borderRadius:100}}/>
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
																	  open={()=>{setVisible(true);setSelectedUser(card)}} />}
								   stackSize={2}
								   useViewOverflow={true}
								   verticalSwipe={false}
								   backgroundColor={"#000000"}
								   onSwipedRight={e=>swiped(profiles[e])}
								   cardVerticalMargin={0}
								   cardHorizontalMargin={0}
				/>
			</View>
			<Animated.View style={{backgroundColor:"#000000ea",borderRadius:20, position:"fixed", zIndex:200,left:0,bottom:0, height:animatedHeight, width:width}} >
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
