import {View, Text, Colors, Chip, Image} from "react-native-ui-lib";

import { Alert, ScrollView, StyleSheet} from 'react-native'
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import React, {useState, useCallback} from "react";

import API from "@/components/api"
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileSwipeScreen = ({route, navigation}) =>{

	const { userId } = useLocalSearchParams(); // Retrieve params
	const [user,setUser] = useState(null);

	useFocusEffect(useCallback(() => {
		API.get(`http://192.168.1.119:8000/api/users/${userId}`).then(response=>{
			console.log(response);
			setUser(response.data)
		})
	},[userId]));

	if(user){
		return (

			<ScrollView>
				<View style={{backgroundColor:Colors.$backgroundDefault, paddingTop:15, paddingBottom:50, flex:1,flexDirection:"column", gap:12, paddingHorizontal:15}} >
					<Image width="100%" height={500} source={{uri: `${user.profile_picture}`}}/>
					<View >
						<Text text70>
							Om mig
						</Text>
						<Text>
							{user.about}
						</Text>
					</View>

					<Text text70>
						Intressen
					</Text>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
						{user.interests.map((chip, index) => (
							<Chip key={index} label={chip} />
						))}
					</View>
					<Text text70>
						Ditaljer
					</Text>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
						{user.details.map((chip, index) => (
							<Chip key={index} label={chip} />
						))}
					</View>
				</View>
			</ScrollView>
		)
	}
	else{
		return (
			<View>
				<Text>
					Hello
				</Text>
			</View>
		)
	}
}

export default ProfileSwipeScreen;
