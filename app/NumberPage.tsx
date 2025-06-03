import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView, SafeAreaViewBase } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import API, {endPoint} from "@/components/api";
import { Button, Text, TextField } from "react-native-ui-lib";

import {router} from "expo-router";
import ProgressBar from 'react-native-progress/Bar';


const NumberPage = ({onNext}) => {
    const [number,setNumber] = useState("+46");
    const [errorE, setErrorE] = useState('');
    const [errorN, setErrorN] = useState('');
    const [email,setEmail] = useState();

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setErrorE('Inte en giltig email adress');
        } else {
            setErrorE('');
        }
        setEmail(value);
    };

    const validateSwedishPhone = (value: string) => {
        const phoneRegex = /^([+]46)\s*(7[0236])\s*(\d{4})\s*(\d{3})$/;
        if (!phoneRegex.test(value.trim())) {
            setErrorN('Inte ett giltigt telefonnummer');
        } else {
            setErrorN('');
        }
        setNumber(value);
    };
      const next = () => {

          if(number !== "" && errorN === "") onNext()

      }


    return(
        <View style={{}} >
            <Text white heading2>
                Min email är
            </Text>
            <TextField
                marginT-20
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                placeholder="Email adress"
		        value={email}  // Bind to local input state
                onChangeText={validateEmail}
                enableErrors
                validateOnChange
                validationMessage={errorE ? [errorE] : []}
		        style={styles.input} />
            {email !== "" && errorE === "" ? (
                <View>

                    <Text white heading2>
                        och mitt nummer är
                    </Text>
                    <TextField
                        marginT-20
                        keyboardType="phone-pad"
                        placeholder="För och efternamn"
		                value={number}  // Bind to local input state
                        onChangeText={validateSwedishPhone}
                        enableErrors
                        validateOnChange
                        validationMessage={errorN ? [errorN] : []}
		                style={styles.input} />
                </View>
            ):null}
            <Button marginT-50 onPress={next} >
                <Text style={{color:"white",fontWeight:"bold"}}>
                    Fortsätt
                </Text>
            </Button>
        </View>
    )
}
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

export default NumberPage;
