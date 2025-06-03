import React, { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import {StyleSheet} from "react-native";
import { View, Text, TouchableOpacity, TextField } from "react-native-ui-lib";

const RenderItem = ({item,remove}) => {

	return (
		<View style={styles.renderItem}>
			<Text white>
				{item}
			</Text>
			<TouchableOpacity onPress={remove} >
				<Text style={{color:"red"}}>
					Tabort
				</Text>
			</TouchableOpacity>
		</View>
	)
}

const IntrestsAndDetailsPage = ({onNext}) =>{
	const [newInterest, setNewInterest] = useState<string>("");
	const [interests, setIntrests] = useState([]);

	const addIntrest = () => {
		if(newInterest === "") return;
		setIntrests(prev => ([
			...prev,
			newInterest
		]));
		setNewInterest("")
	}
	const removeInterest = (index) => {
		setIntrests(prev => (
			prev.filter((_, i) => i !== index)
		));
	};

	return(
		<View>
			<Text white heading2>
				Mina intressen är
			</Text>
			<View>

				<FlatList
					style={styles.chiper}
						  data={interests}
						  keyExtractor={(item, index) => index.toString()} // Add this

					renderItem={({ item, index }) => (
						<RenderItem item={item} remove={() => removeInterest(index)} />
					)}
				/>
			</View>
			<View center>
				<TextField
					value={newInterest}
						  onChangeText={setNewInterest}
						  placeholder="Nytt intresse"
						  style={styles.input}
				/>
				<TouchableOpacity onPress={addIntrest}>
					<Text white>
						Lägg till intresse
					</Text>
				</TouchableOpacity>
			</View>
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
		marginBottom: 10,
		marginTop:5,
		borderRadius: 15
	},
	chiper: {
		backgroundColor: "#111",
		borderRadius: 12,
		flex: 1,           // Allow FlatList to grow and fill space
		overflow: "hidden",
		padding: 12,
	},
	renderItem:{
		padding:2,
		flexDirection:"row",
		justifyContent:"space-between"
	},
});

export default IntrestsAndDetailsPage;
