import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Swiper from 'react-native-deck-swiper';

import axios from "axios"

const { height, width } = Dimensions.get('window');

const ProfileCard = ({ card }) => {
	if(!card) {return (<Text>Loading</Text>)}
	else {
		return (
			<ScrollView style={styles.cardContainer}>
				<View style={styles.card}>
					<Image source={card.profile_picture} style={styles.image} />
					<View style={styles.overlay}>
						<Text style={styles.name}>{card.name}</Text>
						<Text style={styles.pronoun}>{card.pronoun}</Text>
						<Text style={styles.category}>{card.category}</Text>
					</View>
				</View>

				{/* Profile Details */}
				<View style={styles.detailsContainer}>
					<Text style={styles.sectionTitle}>📍 Location</Text>
					<Text style={styles.sectionText}>{card.location}</Text>

					<Text style={styles.sectionTitle}>📝 About Me</Text>
					<Text style={styles.sectionText}>{card.about}</Text>

					<Text style={styles.sectionTitle}>🔍 My Details</Text>
					<View style={styles.tagsContainer}>
						{card.details.map((detail, index) => (
							<Text key={index} style={styles.tag}>{detail}</Text>
						))}
					</View>

					<Text style={styles.sectionTitle}>❤️ I Enjoy</Text>
					<View style={styles.tagsContainer}>
						{card.interests.map((interest, index) => (
							<Text key={index} style={styles.tag}>{interest}</Text>
						))}
					</View>

					<Text style={styles.sectionTitle}>📷 More Photos</Text>
					<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
						{card.more_images.map((img, index) => (
							<Image key={index} source={img} style={styles.smallImage} />
						))}
					</ScrollView>
				</View>
			</ScrollView>
		);
	}
}

const SwipeScreen = () => {

	const [profiles, setProfile] = useState([]);

	useEffect(()=>{
		axios.get('http://localhost:8000/api/users')
			 .then(function (response) {
				 // handle success
				 setProfile(response.data);
				 console.log(profiles)
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
		<View style={styles.container}>
			<Swiper
				cards={profiles}
				renderCard={(card) => <ProfileCard card={card} />}
				stackSize={3}
				verticalSwipe={false}
				backgroundColor={'#fff'}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
	backgroundColor:'white',
  },
  card: {
    width: width,
    height: height-150,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 10,
  },
  name: {
    fontSize: 22,
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 10,
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
