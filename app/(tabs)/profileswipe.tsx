import {View, Text, Colors, Chip} from "react-native-ui-lib";

import {StyleSheet} from 'react-native'
import { useLocalSearchParams } from "expo-router";

const ProfileSwipeScreen = ({route, navigation}) =>{

	const { userId } = useLocalSearchParams(); // Retrieve params

	return (
		<View style={{backgroundColor:Colors.$backgroundDefault, paddingTop:15, paddingBottom:50, flex:1,flexDirection:"column", gap:12}} >
			<Text>
				{userId}
			</Text>
			{/* <Text text70>
				Om mig
				</Text>
				<Text>
				{user.about}
				</Text>
				<Text text70>
				Intressen
				</Text>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
				{user.interests.map((chip, index) => (
				<Chip key={index} label={chip} />
				))}
				</View>
				<Text text70>
				Ditaljer
				</Text>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
				{user.details.map((chip, index) => (
				<Chip key={index} label={chip} />
				))}
				</View> */}
		</View>
	)
}

export default ProfileSwipeScreen;
