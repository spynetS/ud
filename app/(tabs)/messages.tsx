import React, { useEffect, useCallback, useState, useRef } from 'react';
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Icon from "react-native-vector-icons/FontAwesome"; // Install if not already
import { useFocusEffect } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';

import API from "@/components/api";

import axios from "axios"

import {Chip,Colors, Spacings, Image, SegmentedControl, Text, Button, Assets, Modal, Card, View} from "react-native-ui-lib"
import { Link } from 'expo-router';

const { height, width } = Dimensions.get('window');

const MessageScreen = () => {



	const message = () =>{
		API.get("/matches").then(response=>{}).catch(error=>{})

		API.post("/send_message/",{
			sender:2,
			receiver: 3,
			message:"Tjo bro"
		}).then(response=>{
			console.log(response.data)
		}).catch(error=>{})
	}

	return (
		<SafeAreaView style={{flex:1}} >

			<TouchableOpacity onPress={message} >
				Message
			</TouchableOpacity>

			<Text>
				Hello World!
			</Text>
		</SafeAreaView>

	);
};


export default MessageScreen;
