import React, { useEffect, useCallback, useState, useRef } from 'react';
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity, FlatList} from 'react-native';

import { FlatGrid } from 'react-native-super-grid';
import { useFocusEffect } from '@react-navigation/native';
import API, {getProfile} from "@/components/api";

import { SafeAreaView } from 'react-native-safe-area-context';

import {Colors, SegmentedControl, Text, Button, Avatar, Modal, Card, View} from "react-native-ui-lib"
import { Link, router } from 'expo-router';

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
  more_images: string[];
  bookmarks: number[];
  swipes: number;
};

const Row = ({item}) => {
  return (
      <View
		  style={{
              flex: 1,
			  flexDirection:"row",
			  justifyContent: 'space-between',
			  alignItems: 'center',
			  padding: 20,

		  }}
      >
		  <Text>{item.id}</Text>
		  <Avatar
			  size={40}
			  source={{
				  uri: item.profile_picture,
			  }}
		  />
		  <Text>{item.username}</Text>
		  <Text>{item.swipes}</Text>
      </View>
  );
};

const { height, width } = Dimensions.get('window');

const RankScreen = () => {

	const [users,setUsers] = useState<User[]>([]);
		const [gender,setGender] = useState<number>(0);
	const [school,setSchool] = useState<number>(0);

	const [user,setUser] = useState(null);
	useFocusEffect(useCallback(()=>{

		getProfile().then(response=>{
			setUser(response);
		}).catch(error=>{
			router.push("/login", { relativeToDirectory: true })
		});

		API.get("/ranking/",{
			params:{
				pronoun : gender == 0 ? "he/him" : "she/her",
				school  : school == 0 ? "" : user?.school || ""
			}}).then(response=>{
			console.log(response)
			setUsers(response.data);

		}).catch(error =>{})


	},[gender,school]))


	return (
		<SafeAreaView style={{flex:1,backgroundColor:"#fff"}} >
			<View
				style={{
					position:"absolute",
					top:45,
					width: "100%",
					alignItems: "center",

					zIndex: 1000, // Ensures it's above other content
				}}
			>
				<SegmentedControl
					segments={[{ label: 'Sverige' }, { label: user?.school || "" }]}
							 activeBackgroundColor={Colors.white}
							 activeColor={Colors.primary}
							 backgroundColor={Colors.primary}
							onChangeIndex={setSchool}
							 inactiveColor={Colors.white}
							 style={{height:50,width:300}}
				/>

				<View style={{backgroundColor:Colors.primary,
							  width:"100%",
							  paddingTop:10,
							  marginTop:5,
							  flex:1,
							  alignItems:"center",
							  borderTopLeftRadius:50,
							  borderTopRightRadius:50}} >
					<Text style={{color:"white", marginBottom:10, fontSize:32}} heading>
						TOPPLISTA
					</Text>

					<View style={{backgroundColor:Colors.dark_primary,
								  width:"100%",
								  flex:1,
								  alignItems:"center",
								  borderTopLeftRadius:50,
								  borderTopRightRadius:50}} >

						<View style={{
							flex:1,
							flexDirection:"row",
							justifyContent :"center",
						}} >

							<View style={{
								flex:1,
								justifyContent:"center",
								alignItems:"center",
								height:130,
								marginBottom:10
							}}>
								<Avatar size={80} ribbonLabel={"3"} source={{uri: users.length > 2 ? users[2].profile_picture : ""}} />
							</View>

							<Avatar size={120} ribbonLabel={"1"} source={{uri: users.length > 0 ? users[0].profile_picture : ""}} />

							<View style={{
								flex:1,
								justifyContent:"center",
								height:130,
							}}>
								<Avatar size={100} ribbonLabel={"2"} source={{uri: users.length > 1 ? users[1].profile_picture : ""}} />
							</View>

						</View>

						<SegmentedControl
							segments={[{ label: 'MAN' }, { label: "KVINNA" }]}
							activeBackgroundColor={Colors.white}
							activeColor={Colors.primary}
							backgroundColor={Colors.primary}
							onChangeIndex={setGender}

							inactiveColor={Colors.white}
							style={{height:40,marginBottom:2}}
						/>

						<View style={{backgroundColor:"#fff",
									  width:"100%",
									  flex:1,
									  flexDirection:"column",
									  marginHorizontal: "auto",
									  padding:16,

									  borderTopLeftRadius:50,
									  borderTopRightRadius:50}} >
							<View style={{
								flex:1,
								flexDirection:"row",
                width: "100%",
								justifyContent:"space-between"

							}} >
								<Text h2 body>
									PLACERING
								</Text>
								<Text h2 body>
									ANVÄNDARE
								</Text>
								<Text h2 body>
									RATING
								</Text>
							</View>

							<FlatGrid
								style = {{flex:1,margin:10}}
										data={users}
										renderItem={Row}
										itemDimension={300} // Set the item dimension
							/>
						</View>

					</View>
				</View>


			</View>
		</SafeAreaView>

	);
};


export default RankScreen;
