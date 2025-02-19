import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Dimensions, ScrollView, View, TouchableOpacity} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from "react-native-vector-icons/FontAwesome"; // Install if not already

import axios from "axios"
import { PaperProvider, IconButton} from 'react-native-paper';
import { useTheme } from 'react-native-paper';

import {Chip,Colors, Spacings, Image, SegmentedControl, Text, Button, Assets} from "react-native-ui-lib"

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



const ProfileCard = ({ card }) => {

	  const scrollViewRef = useRef(null); // 1️⃣ Create a ref

	const scrollDown = () => {
		if (scrollViewRef.current) {
			scrollViewRef.current.scrollTo({ y: 200, animated: true }); // 2️⃣ Scroll down by 200px
		}
	};

	if(!card) {return (<Text>Loading</Text>)}
	else {
	return (
		<ScrollView ref={scrollViewRef}>
			<View style={{width:"100%", height:height-150}}>
				<Image
					style={{ flex: 1, width: '100%',borderRadius: 20 }}
					resizeMode="cover"
					source={{uri: card.profile_picture}}/>
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
							{card.category}
						</Text>
					</View>
					<View style={{flex:1, flexDirection:'row', justifyContent:"space-around", width:"100%",marginTop:15, paddingRight:15}}>
						<RoundButton iconName="heart" onPress={() => console.log("Button Pressed")} />
						<RoundButton iconName="chevron-down" onPress={scrollDown} />
					</View>
				</View>
			</View>
			<View style={{minHeight:"100px", backgroundColor:Colors.$backgroundDefault, paddingTop:15, paddingBottom:50, flex:1,flexDirection:"column", gap:12}} >
				<Text text70>
					Om mig
				</Text>
				<Text >
					{card.about}
				</Text>
				<Text text70>
					Intressen
				</Text>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
					{card.interests.map((chip, index) => (
						<Chip key={index} label={chip} />
					))}
				</View>
				<Text text70>
					Ditaljer
				</Text>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
					{card.details.map((chip, index) => (
						<Chip key={index} label={chip} />
					))}
				</View>
			</View>

		</ScrollView>
	);
	}
}

const SwipeScreen = () => {

	const [profiles, setProfile] = useState([]);
	const [value, setValue] = React.useState('sverige');

	useEffect(()=>{
		axios.get('http://192.168.1.119:8000/api/users')
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
					  renderCard={(card) => <ProfileCard card={card} />}
					  stackSize={2}
					  verticalSwipe={false}
				containerStyle={{ marginTop: 0, backgroundColor:Colors.$backgroundDefault }}
			/>
		</View>
		</View>

	);
};

export default SwipeScreen;
