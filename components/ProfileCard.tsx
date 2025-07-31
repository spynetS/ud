import React, { useEffect, useCallback, useState, useRef } from 'react';

import { Animated, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Pressable, Modal } from 'react-native';

import { Chip, Colors, Spacings, Image, SegmentedControl, Text, View, Dialog, PanningContext, Button, Card } from "react-native-ui-lib"

import Icon from "react-native-vector-icons/FontAwesome";

import {endPoint} from "@/components/api"

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

	if(!card) {return (<Text white></Text>)}
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
								label={card.school?.name}
								labelStyle={{color:"white",marginRight: Spacings.s1,fontFamily:"CustomFont"}}
								backgroundColor={"#88888850"}
								containerStyle={{
									borderWidth: 0,
									width:(card.school?.name.length*7)
								}}/>
						</View>

					</View>

				</View>
			</ScrollView>

		);
	}
}

export default ProfileCard;
