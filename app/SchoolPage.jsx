import React, { useEffect, useState } from "react";
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

import API, { endPoint } from "@/components/api.js";
import axios from "axios";

const SchoolPage = ({ user, onNext }: Props) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [value, setValue] = useState(user.school.id);

  const [program, setProgram] = useState(user.programe);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(endPoint + "/api/schools").then((response) => {
      const formattedItems = response.data.map((school) => ({
        label: school.name,
        value: school.id,
        color: school.color, // optional, for custom styling
      }));
      setItems(formattedItems);
    });
  }, []);

  const next = () => {
    const selectedSchool = items.find((item) => item.value === value);

    const updatedUser = {
      ...user,
      programe: program,
      school: {
        id: selectedSchool.value,
        name: selectedSchool.label,
        color: selectedSchool.color,
      },
    };
    console.log(updatedUser);
    onNext(updatedUser);
  };

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
        onChangeValue={(val) => {
          console.log("Selected value:", val);
          setValue(val);
        }}
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

      <Button marginT-50 onPress={next}>
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
