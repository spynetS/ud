import React, { useEffect, useState, useRef } from 'react';
import { Image, StyleSheet, Dimensions, ScrollView, View } from 'react-native';
import Swiper from 'react-native-deck-swiper';

import axios from "axios"
import { PaperProvider, Text, IconButton, SegmentedButtons} from 'react-native-paper';
import { Chip } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const { height, width } = Dimensions.get('window');

const ProfileCard = ({ card }) => {
  const scrollViewRef = useRef(null);

  const handleScrollDown = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 200, animated: true }); // Adjust `y` value as needed
    }
  };


	if(!card) {return (<Text>Loading</Text>)}
	else {
	return (
		<ScrollView ref={scrollViewRef} style={styles.cardContainer}>
			<View style={styles.card}>
				<Image source={card.profile_picture} style={styles.image} />
				<View style={styles.overlay}>
					<Text style={styles.name}>{card.username}</Text>
					<Text style={styles.pronoun}>{card.pronoun}</Text>
					<Text style={styles.category}>{card.category}</Text>
					<View style={{width:"100%",flex:1, flexDirection:"row",justifyContent:"space-evenly"}} >
						<IconButton
							icon="bookmark"
										size={40}
										onPress={() => console.log('Pressed!')}
										mode="contained" // Optional: Adds a filled background

						/>
						<IconButton
							icon="chevron-down"
										size={40}
										onPress={handleScrollDown}
										mode="contained" // Optional: Adds a filled background

						/>
					</View>

				</View>
			</View>

			{/* Profile Details */}
			<View style={styles.detailsContainer}>
				<View style={{display:"flex", flexDirection:"row", justifyContent:"center"}} >
					<Text variant="titleLarge">📍</Text>
					<Text variant="bodyLarge">{card.location}</Text>
				</View>

				<View>
					<Text variant="titleLarge">About Me</Text>
					<Text variant="bodyLarge">{card.about}</Text>
				</View>
				<View>
					<Text variant="titleLarge">My Details</Text>
					<View style={styles.tagsContainer}>
						{card.details.map((detail, index) => (
							<Chip key={index} mode="outlined" >{detail}</Chip>
						))}
					</View>
				</View>

				<View>
					<Text variant="titleLarge">I enjoy</Text>
					<View style={styles.tagsContainer}>
						{card.interests.map((interest, index) => (
							<Chip mode="outlined" key={index} >
								{interest}
							</Chip>
						))}
					</View>
				</View>
				<View>
					<Text variant="titleLarge">More Photos</Text>
					<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
						{card.more_images.map((img, index) => (
							<Image key={index} source={img} style={styles.smallImage} />
						))}
					</ScrollView>
				</View>

			</View>
		</ScrollView>);
	}
}

const SwipeScreen = () => {

	const [profiles, setProfile] = useState([]);
  const [value, setValue] = React.useState('');

	useEffect(()=>{
		axios.get('http://192.168.1.119:8000/api/users')
			 .then(function (response) {
				 // handle success
				 setProfile(response.data);
			 })
			 .catch(function (error) {
				 // handle error
				 console.log(error);
			 })
			 .finally(function () {
				 // always executed
			 });

	},[])



	return (

		<View style={{ flex: 1 }}>
			{/* Wrap SegmentedButtons in a dedicated View */}
			<View style={{ padding: 16 }}>
				<SegmentedButtons
					value={value}
								onValueChange={setValue}
								buttons={[
									{ value: 'sverige', label: 'Sverige' },
									{ value: 'university', label: 'Universitet' },

								]}
				/>
			</View>

			{/* Swiper should take the rest of the space */}
			<View style={{ flex: 1 }}>
				<Swiper
					cards={profiles}
								renderCard={(card) => <ProfileCard card={card} />}
								stackSize={3}
								verticalSwipe={false}
					containerStyle={{ backgroundColor: 'transparent' }} // Ensures no blue background

				/>
			</View>
		</View>

	);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
		width:"100%",
  },
  card: {
    width: width,
    height: height-150,

  },
  image: {
    width: '90%',
    height: '100%',
		borderRadius:20,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 5,
    padding: 10,
    borderRadius: 10,
		width:"100%",
  },
  name: {
    fontSize: 22,
		marginBottom:5,
    fontWeight: 'bold',
    color: '#fff',
  },
  pronoun: {
    fontSize: 18,
    color: '#ddd',
  },
  category: {
    fontSize: 16,
    color: '#bbb',
  },
  detailsContainer: {
    padding: 20,
		backgroundColor:'white',
		flex:1,
		gap:32,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
		gap: 5,
  },
  tag: {
    //backgroundColor: '#F2F2FC',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 10,
    fontSize: 14,
  },
  imageRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  smallImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
});

export default SwipeScreen;
