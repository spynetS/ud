import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, StyleSheet, SafeAreaView, SafeAreaViewBase } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import API, {endPoint} from "@/components/api";
import { Button, Text, TextField } from "react-native-ui-lib";

import {router} from "expo-router";
import ProgressBar from 'react-native-progress/Bar';



const NamePage = ({onNext}) =>{

    const [name, setName] = useState("");
    const [about, setAbout] = useState<String>("");
    const [showAbout, setShowAbout] = useState<Boolean>(false);
    const [error, setError] = useState('');

    const validateName = (value: string) => {
        const nameRegex = /^[A-Za-z]+(?:[-'][A-Za-z]+)?\s+[A-Za-z]+(?:[-'][A-Za-z]+)?$/;
        if (!nameRegex.test(value)) {
            setError('Please enter a valid first and last name');
        } else {
            setError('');
        }
        setName(value);
    };

    const next = () => {

        if(showAbout && about !== "") onNext()
        else
            setShowAbout(true && name !== "" && error === "")
    }

    return(
        <View >
            <Text white heading>
                Jag heter
            </Text>
            <TextField
                marginT-20
                placeholder="För och efternamn"
				value={name}  // Bind to local input state
                onChangeText={validateName}
                enableErrors
                validateOnChange
                validationMessage={error ? [error] : []}
				style={styles.input} />
            <Text white>
                Detta kommer visas på din profil
            </Text>

            {showAbout ? (
                <View>

                    <Text marginT-10 white heading2>
                        och detta är en beskrivning om mig
                    </Text>
                    <TextField
                        multiline={true}
                        placeholder="Om dig själv"
				        value={about}  // Bind to local input state
				        onChangeText={setAbout}
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

export default NamePage;
