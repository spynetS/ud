import React, { useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet,  } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { View, Button, Text, Assets, TouchableOpacity} from 'react-native-ui-lib';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import * as ImagePicker from 'expo-image-picker';

const { height, width } = Dimensions.get('window');

const ImagePickerComponent = ({onImage}) => {
	const [imageUri, setImageUri] = useState(null);

	const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
			base64:true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
			onImage(result.assets[0]);
			setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View style={{width:"100%", flexDirection:"row", justifyContent:"center"}}>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : (
				<TouchableOpacity onPress={pickImage} center style={styles.image}>
					<Text heading2 white >
						Välj en bild
					</Text>
				</TouchableOpacity>
			)}
    </View>
  );
};

const styles = StyleSheet.create({
	image:{
		width: width*0.8,
		minHeight: 100,
		marginTop: 20,
		backgroundColor:"gray",
		borderRadius:20
	}
})

export default ImagePickerComponent;
