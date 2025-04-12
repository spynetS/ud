//TODO fix rerender of lib

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { StyleSheet, Dimensions, KeyboardAvoidingView, TouchableOpacity, FlatList, TextInput, Keyboard,TouchableWithoutFeedback, ScrollView } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from "react-native-vector-icons/FontAwesome"; // Install if not already
import { useFocusEffect } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';

import API, { getProfile, endPoint } from "@/components/api";

import axios from "axios"

import { ListItem, Image, Colors, Text, Button, View,  } from "react-native-ui-lib"
import { Link, router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { Avatar } from 'react-native-ui-lib/src/components/avatar';
import { FontAwesome } from '@expo/vector-icons';

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

	const [keyboardVisible, setKeyboardVisible] = useState(false);
	const [keyboardHeight, setKeyboardHeight] = useState(0);

	useEffect(() => {
		// Listeners for keyboard show and hide events
		const keyboardDidShowListener = Keyboard.addListener(
			"keyboardDidShow",
			(e) => {
				setKeyboardVisible(true);
				setKeyboardHeight(e.endCoordinates.height);
			}
		);
		const keyboardDidHideListener = Keyboard.addListener(
			"keyboardDidHide",
			() => {
				setKeyboardVisible(false);
				setKeyboardHeight(0);
			}
		);

		// Clean up listeners on unmount
		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

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
			if(selectedUser !== null){
				API.get("/get_messages?sender="+selectedUser.id).then(response=>{
					setMessages([...response.data]);
				}).catch(error=>{})
			}

		}, 5000);

		return () => clearInterval(interval);
	}, [selectedUser]);

	const sendMessage = () => {
		if(newMessage === "") return;
		setNewMessage("");
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

	return (
		<SafeAreaView style={{backgroundColor:"#0a0a0a"}}>
			<View
				style={{
					bottom: keyboardHeight + 20,
				}}
			>

				<View row spread paddingH-15 centerV style={{height:80, width:"100%"}}>
					<Link href="/messages">
						<FontAwesome name="arrow-left"  color="white" size={24}/>
					</Link>
					<View flex row center >
						<Avatar source={{uri:endPoint+selectedUser?.images[0].image}} />
						<View marginL-10>
							<Text heading2 white>
								{selectedUser?.username}
							</Text>
							<Text text90 gray>
								{selectedUser?.school}
							</Text>
						</View>
					</View>

					<View>
					</View>

				</View>

				<View style={{marginBottom:50,}}>
					<View style={{ backgroundColor: '', padding: 20, height:height * 0.8 }}>
						<FlatList
							inverted
							style={{height:height-10}}
								  data={messages}
								  keyExtractor={(item) => item.id.toString()}
								  renderItem={({ item }) => {
									  const isMyMessage = item.sender.id === user?.id;

									  return (
										  <View
											  key={item.id}
												  style={{
													  flexDirection: 'row',
													  justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
													  marginVertical: 5,
												  }}
										  >
											  <View
												  style={{
													  backgroundColor: isMyMessage ? Colors.primary : '#323232',
													  padding: 10,
													  borderRadius: 15,
													  maxWidth: '70%',
													  // Shadow properties for iOS
													  shadowColor: "#fff",
													  shadowOffset: { width: 0, height: 2 },
													  shadowOpacity: 0.25,
													  shadowRadius: 5,
													  // Shadow properties for Android
													  elevation: 7,
												  }}
											  >
												  <Text style={{ color: 'white' }}>
													  {item.message}
												  </Text>
											  </View>
										  </View>
									  );
								  }}
						/>
					</View>
					<View style={{

						...styles.inputContainer}}>
						<TextInput style={{width:width-70,...styles.input}}
								   placeholder="Write here"
								   multiline={true} // Enable multi-line
								   value={newMessage}
								   onChangeText={setNewMessage} />
						<TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
							<FontAwesome name="send" size={24} color="white" />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</SafeAreaView>
	)

}

const styles = StyleSheet.create({
	input: { backgroundColor:"#28272A",color:"#a2a2a2", padding: 10, marginBottom: 10, borderRadius: 15 },
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		//backgroundColor: '#fff',
	},
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 16,
	  },
	sendButton: {
		backgroundColor: '#007AFF',
		borderRadius: 25,
		padding: 10,
		marginLeft: 8,
		alignItems: 'center',
		justifyContent: 'center',
	}
})

export default MessageUserScreen;
