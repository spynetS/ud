import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView, SafeAreaViewBase } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import API, {endPoint} from "@/components/api";
import { Button, Text, TextField } from "react-native-ui-lib";

import {router} from "expo-router";
import ProgressBar from 'react-native-progress/Bar';


import NamePage from "./NamePage"
import NumberPage from "./NumberPage"
import IntrestsAndDetailsPage from './IntrestsAndDetailsPage';

const SignupScreen = () => {
    const navigation = useNavigation();
    const pages = 3;
    const [page,setPage] = useState(2);

    const getPage = () =>{
        switch(page){
            case 0:
                return <NumberPage onNext={()=>{setPage(page+1)}} />
            case 1:
                return <NamePage onNext={()=>{setPage(page+1)}} />
            case 2:
                return <IntrestsAndDetailsPage onNext={()=>{setPage(page+1)}} />

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
