//TODO fix rerender of lib

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from "react-native-vector-icons/FontAwesome"; // Install if not already
import { useFocusEffect } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';

import API, { getProfile } from "@/components/api";

import axios from "axios"

import { ListItem, Image, Colors, Text, Button, View, TextField } from "react-native-ui-lib"
import { Link, router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { Avatar } from 'react-native-ui-lib/src/components/avatar';

const { height, width } = Dimensions.get('window');

type Message = {
	id:number,
	message: string,
	sender: User,
	receiver: User
}

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




const MessageUserScreen = () => {

	const glob = useLocalSearchParams();
	const pressedUser = JSON.parse(glob.pressedUser);

	console.log(pressedUser);

	useEffect(() => {
		console.log(pressedUser)
		if (pressedUser !== null) {
			setSelectedUser((pressedUser));
			getMessages(pressedUser.id);
		}
	}, []);

	const [messages,setMessages] = useState<Message[]>([{"sender":{"id":2,"username":"alfredrooos","first_name":"","last_name":"","email":"alfred@stensatter.se","school":"Jönköping University","pronoun":"he/him","programe":"Dateteknik","location":"Norrköping","about":"asdka sldkj aslkjdlaskj lsakjd lasjdlaksj dlaksj aslkj lasjd laskj dlaskjdlkasjdlkasj dlkasd lkasdlkajsldkjsalkd aslkjaklsj dlkasjdlkasj dlkasldkjasl kdasdkajdlksajd","details":["Adventurous","Affectionate","Ambitious","Artistic","Authentic","Caring","Charismatic","Charming","Cheerful","Compassionate","Confident"],"interests":["Adventurous","Affectionate","Ambitious","Artistic","Authentic","Caring","Charismatic","Charming","Cheerful","Compassionate","Confident"],"profile_picture":"/media/uploads/mig_Zdv4Y5c.jpg","images":[{"id":3,"image":"/media/user_images/mig.jpg","uploaded_at":"2025-03-25T10:12:50.020922Z","position":0},{"id":2,"image":"/media/user_images/img-0006web-1200x630.jpg","uploaded_at":"2025-03-25T09:55:28.563233Z","position":1},{"id":1,"image":"/media/user_images/Dr_Niclas_Adler.jpg","uploaded_at":"2025-03-25T09:55:22.348410Z","position":2}],"bookmarks":[1,2,3],"swipes":26,"matches":[3]},"receiver":{"id":1,"username":"spy","first_name":"","last_name":"","email":"alfred@stensatter.se","school":"Jönköping University","pronoun":"","programe":"","location":"","about":"","details":[],"interests":[],"profile_picture":null,"images":[],"bookmarks":[2,3],"swipes":3,"matches":[2,3]},"message":"Tjo bro","id":9},{"sender":{"id":2,"username":"alfredrooos","first_name":"","last_name":"","email":"alfred@stensatter.se","school":"Jönköping University","pronoun":"he/him","programe":"Dateteknik","location":"Norrköping","about":"asdka sldkj aslkjdlaskj lsakjd lasjdlaksj dlaksj aslkj lasjd laskj dlaskjdlkasjdlkasj dlkasd lkasdlkajsldkjsalkd aslkjaklsj dlkasjdlkasj dlkasldkjasl kdasdkajdlksajd","details":["Adventurous","Affectionate","Ambitious","Artistic","Authentic","Caring","Charismatic","Charming","Cheerful","Compassionate","Confident"],"interests":["Adventurous","Affectionate","Ambitious","Artistic","Authentic","Caring","Charismatic","Charming","Cheerful","Compassionate","Confident"],"profile_picture":"/media/uploads/mig_Zdv4Y5c.jpg","images":[{"id":3,"image":"/media/user_images/mig.jpg","uploaded_at":"2025-03-25T10:12:50.020922Z","position":0},{"id":2,"image":"/media/user_images/img-0006web-1200x630.jpg","uploaded_at":"2025-03-25T09:55:28.563233Z","position":1},{"id":1,"image":"/media/user_images/Dr_Niclas_Adler.jpg","uploaded_at":"2025-03-25T09:55:22.348410Z","position":2}],"bookmarks":[1,2,3],"swipes":26,"matches":[3]},"receiver":{"id":1,"username":"spy","first_name":"","last_name":"","email":"alfred@stensatter.se","school":"Jönköping University","pronoun":"","programe":"","location":"","about":"","details":[],"interests":[],"profile_picture":null,"images":[],"bookmarks":[2,3],"swipes":3,"matches":[2,3]},"message":"Tjo bro","id":10}])
	const [newMessage,setNewMessage] = useState<string>();
	const [selectedUser, setSelectedUser] = useState<User>(null);
	const [counter, setCounter] = useState(0);

	const [user,setUser] = useState<User>(null);
	useFocusEffect(useCallback(()=>{
			getProfile().then(response=>{
				setUser(response);
			}).catch(error=>{
				router.push("/login", { relativeToDirectory: true })
			});

	},[]));



	useEffect(() => {
		const interval = setInterval(() => {
			console.log("update")
			if(selectedUser !== null)
 				getMessages(selectedUser?.id)
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	const sendMessage = () => {
		API.post("/send_message/",{
			sender:user?.id,
			receiver:selectedUser?.id,
			message: newMessage
		}).then(response=>{
			getMessages(selectedUser?.id)
		}).catch(error=>{})
	}

	const getMessages = (id:number) =>{
		API.get("/get_messages?sender="+id).then(response=>{
			setMessages([...response.data]);
		}).catch(error=>{})
	}


	return (<View>

		<View row spread paddingH-15 centerV style={{backgroundColor:Colors.$backgroundDefault, height:80, width:"100%"}}>
			<Link href="/messages">
				Back
			</Link>
			<Text heading>
				{selectedUser?.username}
			</Text>
			<Avatar source={{uri:"http://192.168.1.119:8000"+selectedUser?.images[0].image}} />
		</View>

		<View style={{ flex: 1,marginBottom:50 }}>
			<View style={{ backgroundColor: '', padding: 20, height:"60%" }}>
				<FlatList

					data={messages}
							  keyExtractor={(item) => item.id.toString()}
							  renderItem={({ item }) => {
								  const isMyMessage = item.sender.id === user?.id;

								  return (
									  <View
										  style={{
											  flexDirection: 'row',
											  justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
											  marginVertical: 5,
										  }}
									  >
										  <View
											  style={{
												  backgroundColor: isMyMessage ? Colors.primary : '#E0E0E0',
												  padding: 10,
												  borderRadius: 10,
												  maxWidth: '70%',
											  }}
										  >
											  <Text style={{ color: isMyMessage ? 'white' : 'black' }}>
												  {item.message}
											  </Text>
										  </View>
									  </View>
								  );
							  }}
				/>
			</View>

			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:"center",alignContent:"center", marginTop: 10, width:"100%" }}>
				<TextField
					preset="outline"
							placeholder='Type a message...'
							onChangeText={setNewMessage}
							value={newMessage}
				/>
				<Button label='Send' onPress={sendMessage} style={{ marginLeft: 10 }} />
			</View>
		</View>

	</View>)

}

export default MessageUserScreen;
