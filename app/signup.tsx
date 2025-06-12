import React, { useCallback, useState } from 'react';
import {TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView, SafeAreaViewBase } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import API, {endPoint} from "@/components/api";
import { Button, Text, TextField,View } from "react-native-ui-lib";

import { router, useFocusEffect } from "expo-router";
import ProgressBar from 'react-native-progress/Bar';


import NamePage from "./NamePage"
import NumberPage from "./NumberPage"
import SchoolPage from "./SchoolPage"

import IntrestsAndDetailsPage from './IntrestsAndDetailsPage';
import { User } from '@/components/user';
import ProfileCard from "@/components/ProfileCard"
import axios from 'axios';


/**
   / Signup is made up of multiple pages which takes
   / a user object. They change values of them and passes
   / a new user object back to this page which then passes
   / the new user to the next part. This is so we can go
   / forward and backwards through the pages.
 */

export type Props = {
	user: User;
	onNext: (user:User) => void;
};

const LastScreen = ({user, onNext} : Props) => {

	useFocusEffect(useCallback(()=>{
		const postUser = {
			...user,
			school_id:user.school.id
		}
		axios.post(endPoint+"/api/users/",postUser).then(response=>{
			console.log(response)
		})
	},[]));

	return(
		<View>
			<Text heading2 white>
				Välkommen {user.first_name}
			</Text>
			<Text white>
				för att lägga till bilder eller redigera uppgifter
				kan du gå till profil sidan i appen.
			</Text>
			<TouchableOpacity style={styles.input} onPress={()=>{router.push("/login");}}>
				<Text white center>
					Logga in
				</Text>
			</TouchableOpacity>
		</View>
	)
}

const SignupScreen = () => {
    const navigation = useNavigation();
    const pages = 4;
    const [page,setPage] = useState(0);

	const [user,setUser] = useState<User>({
		id: 0,
		username: '',
		password:'',
		first_name: '',
		last_name: '',
		email: '',
		pronoun: '',
		programe: '',
		school:{
			id:-1,
			name:"",
			color:"#000000"
		},
		location: '',
		about: '',
		details: [],
		interests: [],
		profile_picture: null,
		images: [],
		more_images: [],
		bookmarks: [],
		swipes: 0,
		matches:[]
	});

    const getPage = () =>{
        switch(page){
            case 0:
                return <NumberPage user={user} onNext={(user:User)=>{setUser(user),setPage(page+1)}} />
            case 1:
                return <NamePage  user={user} onNext={(user:User)=>{setUser(user),setPage(page+1)}} />
            case 2:
                return <IntrestsAndDetailsPage  user={user} onNext={(user:User)=>{setUser(user),setPage(page+1)}} />
			case 3:
				return <SchoolPage  user={user} onNext={(user:User)=>{setUser(user),setPage(page+1)}} />
			case 4:
				return <LastScreen  user={user} onNext={()=>{}} />


        }
    }

    return (
        <SafeAreaView>
            {/*             Margin so it doesnt appear inside the camera */}
            <Text marginT-50 marginB-10 center white heading2>
                Registrera för UD
            </Text>
            <View style={{width:"100%"}} >
                <ProgressBar progress={page/pages}  width={null}/>
            </View>
			<View style={{width:100}}>
				{page > 0 ? (
					<TouchableOpacity onPress={()=>{setPage(page-1)}}>
						<Text white>
							Tillbaka
						</Text>
					</TouchableOpacity>
				) :null}
			</View>
            <View style={{padding:40}}>
                {getPage()}
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    input: {
		backgroundColor:"#000",
		borderColor:"gray",
		borderWidth:1,
		color:"#a2a2a2",
		padding: 10,
		paddingTop:5,
		paddingBottom:5,
		marginTop:5,
		borderRadius: 15,
        fontSize:22,
	},

})

export default SignupScreen;
