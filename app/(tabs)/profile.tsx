import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import axios from "axios"
import { FontAwesome } from '@expo/vector-icons';
import { Link, router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';

import {Image, View, TextField, Button, Text, Avatar, Chip } from 'react-native-ui-lib';
import { useFocusEffect } from '@react-navigation/native';


import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API, { endPoint, getProfile } from '@/components/api';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImagePickerComponent from '@/components/ImagePicker';
import { Asset } from 'react-native-image-picker';

const Divider = ({ color = '#D3D3D3', height = 1, marginV = 10 }) => (
	<View style={{ height, backgroundColor: color, width: '100%', marginVertical: marginV }} />
);

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

const ProfileScreen = () => {
	const [profile, setProfile] = useState({});
	const [loading, setLoading] = useState(false);
	const [newDetail, setNewDetail] = useState<string>("");
	const [newInterest, setNewInterest] = useState<string>("");
	const [image,setImage] = useState<Asset>(null);

	const [removeImages,setRemoveImages] = useState<[]>([]);

	const [user,setUser] = useState(null);
	useFocusEffect(useCallback(() => {
		getProfile().then(response=>{
			setUser(response);
		})
	},[]));

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			setProfile({ ...profile, profile_picture: result.assets[0].uri });
		}
	};

	// Function to update user info (mock save)
	const saveProfile = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			alert('Profile updated successfully!');
		}, 1500);
	};

	const logout = () => {
		AsyncStorage.setItem("access_token", "");

	}

	const Entry = ({label,value,onChange}) => {
		const [inputValue, setInputValue] = useState(value);  // Store the input locally

		const handleChange = (text) => {
			setInputValue(text); // Update local input state
		};

		return(
			<View >
				<Text white>
					{label}
				</Text>
				<TextField placeholder="Skriv"
						   value={inputValue}  // Bind to local input state
						   onChangeText={handleChange}
						   onBlur={() => onChange(inputValue)}  // Update parent on blur
						   style={styles.input} />

			</View>
		)
	}

	const addDetail = () => {
		if(newDetail === "") return;
		setUser(prev => ({
			...prev,
			details: [...prev.details, newDetail]
		}));
		setNewDetail("");
	}

	const addIntrest = () => {
		if(newInterest === "") return;
		setUser(prev => ({
			...prev,
			interests: [...prev.interests, newInterest]
		}));
		setNewInterest("")
	}

	const removeInterest = (index) => {
		setUser(prev => ({
			...prev,
			interests: prev.interests.filter((_, i) => i !== index)
		}));
	};
	const removeDetail = (index) =>{
		setUser(prev => ({
			...prev,
			details: prev.details.filter((_, i) => i !== index)
		}));
	}

	const removeImageLocal = (id) => {

	}


	const save = () =>{
		const { profile_picture,matches, images, bookmarks, swipes, ...cleanedUser } = user;

		API.post("/update/",{
			user:cleanedUser
		}).then(response=>{
			API.post("edit_image_positions/",{
				images:user?.images
			}).then(response=>{})

			if(image!==null){
				handleAddImage();
				setImage(null);
			}
			for(let i = 0; i < removeImages?.length; i ++){
				removeImage(removeImages[i]);
			}
		}).catch(error=>{

		})
	}

	const handleReorder = (data) => {
		const updated = data.map((item, index) => ({ ...item, position: index }));
		setUser(prev => ({...prev,images:data}));
		// send to backend here if needed
	};

	const moveUp = (id) => {
		if (!user?.images) return;

		const index = user.images.findIndex(img => img.id === id);
		if (index <= 0) return; // already at top

		const newImages = [...user.images];
		// swap with the one above
		[newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];

		// update positions
		const updated = newImages.map((item, i) => ({ ...item, position: i }));
		setUser(prev => ({ ...prev, images: updated }));
	};
	const moveDown = (id) => {
		if (!user?.images) return;

		const index = user.images.findIndex(img => img.id === id);
		if (index < 0 || index === user.images.length - 1) return; // already at bottom

		const newImages = [...user.images];
		// swap with the one below
		[newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];

		// update positions
		const updated = newImages.map((item, i) => ({ ...item, position: i }));
		setUser(prev => ({ ...prev, images: updated }));
	};

	const removeImage = (id) => {
		API.post("/remove_image/",{"image":id}).then(response=>{

		})
	};

	const handleAddImage = async () => {

		API.post("/add_image/",{
			image:image?.base64
		}).then(response=>{

		}).catch(error=>{})

	};


	const renderItem = ({ item, drag }) => (
		<TouchableOpacity onLongPress={drag} style={styles.imageContainer}>
			<Image source={{ uri:"http://192.168.1.119:8000"+ item.image }} style={styles.image} />
			<View row spread>

				<Button title="Remove" color="white" onPress={() => moveUp(item.id)} >
					<Text  white>
						Up
					</Text>
				</Button>
				<Button title="Remove" color="white" onPress={() => removeImageLocal(item.id)} >
					<Text  white>
						Remove
					</Text>
				</Button>
				<Button title="Remove" color="white" onPress={() => moveDown(item.id)} >
					<Text  white>
						Down
					</Text>
				</Button>
			</View>
		</TouchableOpacity>
	);

	// TODO Remove image pos

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View row spread paddingH-15 centerV style={{height:80, width:"100%"}}>
				<Link href="/">
					<FontAwesome name="arrow-left"  color="white" size={24}/>
				</Link>
				<View flex row center >
					<Text white heading2>
						Profile
					</Text>
				</View>

				<View>
				</View>

			</View>
			<View row center>
				<Entry
					label={"Förnamn"}
						  value={user?.first_name}
						  onChange={(text) => setUser(prev => ({ ...prev, first_name: text }))}
				/>
				<Entry
					label={"Efternamn"}
						  value={user?.last_name}
						  onChange={(text) => setUser(prev => ({ ...prev, last_name: text }))}
				/>
			</View>

			<Entry
				label={"Email"}
					  value={user?.email}
					  onChange={(text) => setUser(prev => ({ ...prev, email: text }))}
			/>
			<Entry
				label={"Bor"}
					  value={user?.location}
					  onChange={(text) => setUser(prev => ({ ...prev, location: text }))}
			/>
			<Entry
				label={"Program"}
					  value={user?.programe}
					  onChange={(text) => setUser(prev => ({ ...prev, programe: text }))}
			/>
			<Entry
				label={"Skola"}
					  value={user?.school}
					  onChange={(text) => setUser(prev => ({ ...prev, school: text }))}
			/>

			<Text white>
				Detaljer
			</Text>
			<View>
				<FlatList
					style={styles.chiper}
					data={user?.details}
					keyExtractor={(item, index) => index.toString()} // Add this
					renderItem={({ item, index }) => (
						<RenderItem item={item} remove={() => removeDetail(index)} />
					)}
				/>
			</View>

			<View center>
				<TextField
					value={newDetail}
					onChangeText={setNewDetail}
					placeholder="Ny detalj"
					style={styles.input}
				/>
				<TouchableOpacity onPress={addDetail}>
					<Text white>
						Lägg till detalj
					</Text>
				</TouchableOpacity>
			</View>

			<Text white>
				Intressen
			</Text>
			<View>

				<FlatList
					style={styles.chiper}
						  data={user?.interests}
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


			<View center marginT-10 marginB-12 height-10 style={{overflow:"hidden",flex:1}}>
				<View style={styles.container}>
					<Text white style={styles.title}>Redigera bilder (Längst upp är första)</Text>

					{user?.images && (
						<FlatList
							data={user.images}
							keyExtractor={(item) => item.id.toString()}
							renderItem={renderItem}
							onDragEnd={({ data }) => handleReorder(data)}
						/>
					)}

					<ImagePickerComponent onImage={setImage} />
				</View>
			</View>
			<View>
				<Button onPress={save} loading={loading} style={styles.saveButton}>
					<Text>
						Spara ändringar
					</Text>
				</Button>
				<Button onPress={logout} loading={loading} style={styles.saveButton}>
					<Text>
						Logout
					</Text>
				</Button>

			</View>
			<View style={{ height: 100 }}></View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor:"#000"
	},
	profileContainer: {
		alignItems: 'center',
		marginBottom: 20,
	},
	name: {
		marginTop: 10,
	},
	divider: {
		marginVertical: 20,
	},
	form: {
		gap: 15,
	},
	saveButton: {
		marginTop: 20,
	},
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
	title: { fontSize: 20, marginBottom: 10, fontWeight: 'bold' },
	imageContainer: { marginBottom: 15, alignItems: 'center' },
	image: { width: 200, height: 120, borderRadius: 10, marginBottom: 5 }
});

export default ProfileScreen;
