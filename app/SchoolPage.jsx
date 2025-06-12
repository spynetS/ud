import React, { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  TextField,
  Picker,
  Colors,
} from "react-native-ui-lib";

import DropDownPicker from "react-native-dropdown-picker";
import { Props } from "./signup";

const SchoolPage = ({ user, onNext }: Props) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "skola", value: "none" },
    { label: "Banana", value: "banana" },
  ]);
  const [value, setValue] = useState(user.school);

  const [program, setProgram] = useState(user.programe);
  const [error, setError] = useState("");
  return (
    <View>
      <Text white heading2>
        Jag går på {value}
      </Text>
      <DropDownPicker
        placeholder="Välj skola"
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
      />
      {value !== null ? (
        <View>
          <Text white heading2>
            och jag går
          </Text>
          <TextField
            marginT-20
            placeholderTextColor="gray"
            placeholder="Civilekonom"
            value={program}
            onChangeText={setProgram}
            enableErrors
            validateOnChange
            validationMessage={error ? [error] : []}
            style={styles.input}
          />
        </View>
      ) : null}

      <Button marginT-50 onPress={onNext}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Fortsätt</Text>
      </Button>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    backgroundColor: "#000",
    borderColor: "gray",
    borderWidth: 1,
    color: "#a2a2a2",
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginBottom: 10,
    marginTop: 5,
    borderRadius: 15,
  },
  chiper: {
    backgroundColor: "#111",
    borderRadius: 12,
    flex: 1, // Allow FlatList to grow and fill space
    overflow: "hidden",
    padding: 12,
  },
  renderItem: {
    padding: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default SchoolPage;
