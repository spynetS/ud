import React, { useEffect, useCallback, useState, useRef } from 'react';
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from "react-native-vector-icons/FontAwesome"; // Install if not already
import { useFocusEffect } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';

import API, { getProfile, endPoint} from "@/components/api";

import axios from "axios"

import { ListItem, Image, Colors, Text, Button, View, TextField } from "react-native-ui-lib"
import { Link, router } from 'expo-router';
import { Avatar } from 'react-native-ui-lib/src/components/avatar';
import { Spacings } from 'react-native-ui-lib/src/style/spacings';

const { height, width } = Dimensions.get('window');

type Image = {
  id: number;
  image: string;
  uploaded_at: string;
  position: number;
};

type User = {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  school?: string;
  pronoun?: string;
  programe?: string;
  location?: string;
  about?: string;
  details: string[];
  interests: string[];
  profile_picture?: string | null;
  images: Image[];
  bookmarks: number[];
  swipes: number;
  matches: User[];
};

const MatchItem = ({ match, press }: { match: User, press:any }) => {
	if(!match) return null;

  return (
		<ListItem
	  	activeBackgroundColor={Colors.grey60}

	  	activeOpacity={0.3}
	  	height={77.5}
	  	onPress={() => press(match)}
	  >
		  <ListItem.Part left >

		  </ListItem.Part>

		  <ListItem.Part middle column containerStyle={[styles.border, {paddingRight: 17}]}>
			  <ListItem.Part containerStyle={{marginBottom: 3}}>
					{match.images.length > 0 ? (<Image source={{uri: (endPoint+match?.images[0].image)}} style={styles.image}/>) : ""}

				  <Text grey10 text70 white style={{flex: 1, marginRight: 10}} numberOfLines={1}>
					  {match.username}
				  </Text>
				  <Text grey10 text40 style={{marginTop: 2, color:"gray"}}>

				  </Text>
			  </ListItem.Part>
		  </ListItem.Part>

    </ListItem>
  );
};


const MessageScreen = () => {

	const [user,setUser] = useState<User>(null);


	useFocusEffect(useCallback(()=>{
		getProfile().then(response=>{
				setUser(response);
			}).catch(error=>{
				router.push("/login", { relativeToDirectory: true })
			});

	},[]));


	return (
		<SafeAreaView style={{backgroundColor:"#000", padding:10, height:height}} >
			<Text heading white marginB-25>
				Messages
			</Text>
			<TextInput style={styles.input} placeholder="Search"  />
			<View row center style={{}} >
        {/* THIS SHOULDNT BE HARD CODED
						<Image source={{uri: ("http://192.168.1.119:8000/media/uploads/mig_Zdv4Y5c.jpg")}} style={styles.bigImage}/>
						<Image source={{uri: ("http://192.168.1.119:8000/media/uploads/mig_Zdv4Y5c.jpg")}} style={styles.bigImage}/>
						<Image source={{uri: ("http://192.168.1.119:8000/media/uploads/mig_Zdv4Y5c.jpg")}} style={styles.bigImage}/>
						<Image source={{uri: ("http://192.168.1.119:8000/media/uploads/mig_Zdv4Y5c.jpg")}} style={styles.bigImage}/>
					*/}
			</View>
			<View style={{padding:10}} >

				<Text body white bold marginB-10>
					Messages
				</Text>
				{user?.matches?.map(match=>(
					<MatchItem press={()=>{router.push({pathname:"/messageUser",params:{pressedUser:JSON.stringify(match)}});}} match={match}/>
				))}

			</View>

		</SafeAreaView>

	);
}

const styles = StyleSheet.create({
  image: {
    width: 54,
    height: 54,
    borderRadius: 100,
		borderColor:Colors.primary,
		borderWidth:2,
    marginHorizontal: 14
  },
	 bigImage: {
			width: 74,
			height: 74,
			borderRadius: 100,
			borderColor:Colors.primary,
			borderWidth:2,
			marginHorizontal: 3
		},
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,

  },
	input: { backgroundColor:"#28272A",color:"gray", padding: 10, marginBottom: 10, borderRadius: 15 },
  searchContainer: {
    padding: Spacings.s1,
    paddingBottom: 0
  },
  searchField: {
    padding: Spacings.s3,
    borderRadius: 8
  },
	});

	export default MessageScreen;
