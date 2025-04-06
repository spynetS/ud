import React, { useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet,  } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { View, Button, Text, Assets, TouchableOpacity} from 'react-native-ui-lib';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const { height, width } = Dimensions.get('window');

const ImagePickerComponent = ({onImage}) => {
	const [imageUri, setImageUri] = useState(null);

  const pickImage = () => {
    // Open the image picker and allow the user to choose an image from the gallery
    launchImageLibrary(
      {
        mediaType: 'photo', // You can also allow videos by setting 'mediaType: 'video''
        includeBase64: false, // You can include base64 image as well if you need it
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const source = { uri: response.assets[0].uri }; // Image URI
          setImageUri(source.uri); // Set the URI of the selected image
			onImage(source)
        }
      }
    );
  };

  const takePhoto = () => {
    // Open the camera to take a photo
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera picker');
        } else if (response.errorCode) {
          console.log('Camera Error: ', response.errorMessage);
        } else {
          const source = { uri: response.assets[0].uri };
          setImageUri(source.uri); // Set the URI of the taken photo
        }
      }
    );
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
