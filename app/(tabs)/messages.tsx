import React, { useEffect, useCallback, useState, useRef } from 'react';
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from "react-native-vector-icons/FontAwesome"; // Install if not already
import { useFocusEffect } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';

import API, { getProfile } from "@/components/api";

import axios from "axios"

import { ListItem, Image, Colors, Text, Button, View, TextField } from "react-native-ui-lib"
import { Link, router } from 'expo-router';
import { Avatar } from 'react-native-ui-lib/src/components/avatar';

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
				  <Image source={{uri: ("http://192.168.1.119:8000"+match?.images[0].image)}} style={styles.image}/>
				  <Text grey10 text70 style={{flex: 1, marginRight: 10}} numberOfLines={1}>
					  {match.username}
				  </Text>
				  <Text grey10 text70 style={{marginTop: 2}}>
					  {match.id}
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
		<SafeAreaView style={{flex:1}} >

			<View>
				<View style={{backgroundColor:Colors.$backgroundDefault, height:80, width:"100%"}}>
					<TouchableOpacity onPress={null} >
						Back
					</TouchableOpacity>
					<Text heading>
						Messages
					</Text>
				</View>
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
    borderRadius: 10,
    marginHorizontal: 14
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey70
  }
});

export default MessageScreen;

/*
   <FlatList
   ref={flatListRef}
   data={messages}
   keyExtractor={(item) => item.id.toString()}
   ItemSeparatorComponent={() => <View style={{ height: 10 }} />} // Adds 10px gap
   onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })} // Scrolls down on update
   onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })} // Scrolls down on layout load
   renderItem={({ item }) => {

 */
