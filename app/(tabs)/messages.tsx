import React, { useEffect, useCallback, useState, useRef } from 'react';
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from "react-native-vector-icons/FontAwesome"; // Install if not already
import { useFocusEffect } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';

import API, { getProfile } from "@/components/api";

import axios from "axios"

import { ListItem, Image, Colors, Text, Button, Assets, Modal, Card, View, TextField } from "react-native-ui-lib"
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
			<ListItem.Part left>
        <Image source={{uri: ("http://192.168.1.119:8000"+match?.images[0].image)}} style={styles.image}/>
      </ListItem.Part>

      <ListItem.Part middle column containerStyle={[styles.border, {paddingRight: 17}]}>
        <ListItem.Part containerStyle={{marginBottom: 3}}>
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

type Message = {
	id:number,
	message: string,
	sender: User,
	receiver: User
}

const MessageUserScreen = () => {

}


const MessageScreen = () => {

	const [user,setUser] = useState<User>(null);
	const [selectedUser, setSelectedUser] = useState<User>(null);
	const [messages,setMessages] = useState<Message[]>([{"sender":{"id":2,"username":"alfredrooos","first_name":"","last_name":"","email":"alfred@stensatter.se","school":"Jönköping University","pronoun":"he/him","programe":"Dateteknik","location":"Norrköping","about":"asdka sldkj aslkjdlaskj lsakjd lasjdlaksj dlaksj aslkj lasjd laskj dlaskjdlkasjdlkasj dlkasd lkasdlkajsldkjsalkd aslkjaklsj dlkasjdlkasj dlkasldkjasl kdasdkajdlksajd","details":["Adventurous","Affectionate","Ambitious","Artistic","Authentic","Caring","Charismatic","Charming","Cheerful","Compassionate","Confident"],"interests":["Adventurous","Affectionate","Ambitious","Artistic","Authentic","Caring","Charismatic","Charming","Cheerful","Compassionate","Confident"],"profile_picture":"/media/uploads/mig_Zdv4Y5c.jpg","images":[{"id":3,"image":"/media/user_images/mig.jpg","uploaded_at":"2025-03-25T10:12:50.020922Z","position":0},{"id":2,"image":"/media/user_images/img-0006web-1200x630.jpg","uploaded_at":"2025-03-25T09:55:28.563233Z","position":1},{"id":1,"image":"/media/user_images/Dr_Niclas_Adler.jpg","uploaded_at":"2025-03-25T09:55:22.348410Z","position":2}],"bookmarks":[1,2,3],"swipes":26,"matches":[3]},"receiver":{"id":1,"username":"spy","first_name":"","last_name":"","email":"alfred@stensatter.se","school":"Jönköping University","pronoun":"","programe":"","location":"","about":"","details":[],"interests":[],"profile_picture":null,"images":[],"bookmarks":[2,3],"swipes":3,"matches":[2,3]},"message":"Tjo bro","id":9},{"sender":{"id":2,"username":"alfredrooos","first_name":"","last_name":"","email":"alfred@stensatter.se","school":"Jönköping University","pronoun":"he/him","programe":"Dateteknik","location":"Norrköping","about":"asdka sldkj aslkjdlaskj lsakjd lasjdlaksj dlaksj aslkj lasjd laskj dlaskjdlkasjdlkasj dlkasd lkasdlkajsldkjsalkd aslkjaklsj dlkasjdlkasj dlkasldkjasl kdasdkajdlksajd","details":["Adventurous","Affectionate","Ambitious","Artistic","Authentic","Caring","Charismatic","Charming","Cheerful","Compassionate","Confident"],"interests":["Adventurous","Affectionate","Ambitious","Artistic","Authentic","Caring","Charismatic","Charming","Cheerful","Compassionate","Confident"],"profile_picture":"/media/uploads/mig_Zdv4Y5c.jpg","images":[{"id":3,"image":"/media/user_images/mig.jpg","uploaded_at":"2025-03-25T10:12:50.020922Z","position":0},{"id":2,"image":"/media/user_images/img-0006web-1200x630.jpg","uploaded_at":"2025-03-25T09:55:28.563233Z","position":1},{"id":1,"image":"/media/user_images/Dr_Niclas_Adler.jpg","uploaded_at":"2025-03-25T09:55:22.348410Z","position":2}],"bookmarks":[1,2,3],"swipes":26,"matches":[3]},"receiver":{"id":1,"username":"spy","first_name":"","last_name":"","email":"alfred@stensatter.se","school":"Jönköping University","pronoun":"","programe":"","location":"","about":"","details":[],"interests":[],"profile_picture":null,"images":[],"bookmarks":[2,3],"swipes":3,"matches":[2,3]},"message":"Tjo bro","id":10}])

	const [newMessage,setNewMessage] = useState<string>();

	useFocusEffect(useCallback(()=>{
		getProfile().then(response=>{
				setUser(response);
			}).catch(error=>{
				router.push("/login", { relativeToDirectory: true })
			});

		API.get("/get_messages?sender="+selectedUser?.id).then(response=>{
			setMessages(response.data);
		}).catch(error=>{})

	},[]));

	const sendMessage = () => {
		API.post("/send_message/",{
			sender:user?.id,
			receiver:selectedUser?.id,
			message: newMessage
		}).then(response=>{}).catch(error=>{})
	}


	return (
		<SafeAreaView style={{flex:1}} >


			{selectedUser === null ? user?.matches?.map(match=>(
				<MatchItem press={setSelectedUser} match={match}/>
			))||"" :
			 <View flex padding-20 marginB-100>

				 <View style={{backgroundColor:Colors.$backgroundDefault, height:80, width:"100%"}}>
					 <TouchableOpacity onPress={()=>setSelectedUser(null)} >
						 Back
					 </TouchableOpacity>
					 <Text heading>
						 {selectedUser?.username}
					 </Text>
				 </View>

				 <FlatList
					 data={messages}
					 keyExtractor={(item) => item.id.toString()}
					 ItemSeparatorComponent={() => <View style={{ height: 10 }} />} // Adds 10px gap
					 renderItem={({ item }) => {
						 const isMyMessage = item.sender.id === user?.id;

						 return (
							 <View
								 style={{
									 flexDirection: 'row',
									 justifyContent: isMyMessage ? 'flex-end' : 'flex-start', // Right for my messages, left for others
									 marginVertical: 5,
								 }}
							 >
								 <View
									 style={{
										 backgroundColor: isMyMessage ? Colors.primary : '#E0E0E0', // Green for my messages, gray for others
										 padding: 10,
										 borderRadius: 10,
										 maxWidth: '70%', // Prevent full width
									 }}
								 >
									 <Text style={{ color: isMyMessage ? 'white' : 'black' }}>
										 {item.message}
									 </Text>
								 </View>
							 </View>
						 );
					 }}				 />
				 <View row centerV marginT-10>
					 <TextField
						 flex
						 placeholder='Type a message...'
						 onChangeText={setNewMessage}
						 value={newMessage}
					 />
					 <Button label='Send' onPress={sendMessage} marginL-10 />
				 </View>
			 </View>

			}

		</SafeAreaView>

	);
};
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
