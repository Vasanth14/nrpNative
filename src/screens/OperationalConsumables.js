import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { WizardStore } from "../store";
import DropDownPicker from "react-native-dropdown-picker";
import { Divider, Button as PaperButton, Card, MD3Colors, ProgressBar } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import OperationalToolsTackles from "./OperationalToolsTackles";
import Icon from 'react-native-vector-icons/FontAwesome';
import environment from "../env";
import * as SecureStore from "expo-secure-store";

const { apiUrl } = environment();
const DropdownPickerItem = ({ index, projectOptions, onChangeItem }) => {
  const [openProject, setOpenProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <DropDownPicker
      open={openProject}
      value={selectedProject}
      items={projectOptions}
      setOpen={(value) => {
        setOpenProject(value);
      }}
      setValue={(value) => {
        setSelectedProject(value);
        onChangeItem(index, value); // Pass the index and value to the parent component
      }}
      placeholder="Description"
      searchable={true}
      onChangeItem={(item) => {
        console.log(`Selected Project ${index}:`, item);
        // Add additional logic if needed
      }}
    />
  );
};

export default function OperationalConsumables({ navigation }) {
  // Keep back arrow from showing
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerTitle: 'Consumables', 
    });
    navigation.setOptions({ title: "" });
  }, [navigation]);

  const isFocused = useIsFocused();

  const [openProject, setOpenProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectOptions, setProjectOptions] = useState([]);

  useEffect(() => {
    isFocused &&
      WizardStore.update((s) => {
        s.progress = "0.4";
      });
    const projectCodeId = WizardStore.getRawState().Project;
    console.log("Project Code:", projectCodeId);

    console.log("updated state...", WizardStore.getRawState().progress);
    fetchProjectCode(projectCodeId)
  }, [isFocused]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onBlur",
    defaultValues: WizardStore.useState((s) => s),
  });

  const [formData, setFormData] = useState([
    { Description: "", Specification: "", Quantity: "" }
  ]);

  const fetchProjectCode = async (projectCodeId) => {
    try {
      const getToken = async () => {
        try {
          return await SecureStore.getItemAsync("token");
        } catch (error) {
          console.error("Error getting token:", error);
          return null;
        }
      };
      const token = await getToken();
      if (token) {
        const response = await fetch(apiUrl + 'projectCode/' + projectCodeId, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        const projectCode = data.projectCode
        console.log(projectCode)
        fetchDescription(projectCode, token)
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  }

  const fetchDescription = async (projectCode, token) => {
    try {
      const response = await fetch(apiUrl + `toolsandtackles?projectCode=` + projectCode, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.results && data.results.length > 0) {
        const descriptions = data.results.map(result => ({ label: result.description, value: result.description }));
        console.log(descriptions)
        setProjectOptions(descriptions);
      }
    } catch (error) {
      console.error("Additional API Error:", error);
    }
  }

  const addRow = () => {
    setFormData([...formData, { description: "", specification: "", quantity: "" }]);
  };

  const FloatingButton = ({ onPress }) => {
    return (
      <TouchableOpacity style={styles.floatingButton} onPress={addRow}>
        {/* <Text style={styles.buttonText}>Button</Text> */}
          <FontAwesome   name="plus" color='white' size={20}>
          </FontAwesome>
      </TouchableOpacity>
      
    );
  };

  const PreviousButton = ({ onPress }) => {
    return (
      <TouchableOpacity style={styles.PreviousButton} onPress={() => navigation.goBack()}>
          <FontAwesome name="chevron-left" color="white" size={20} style={styles.nextIcon} />
      </TouchableOpacity>
    );
  };

  const NextButton = ({ onPress }) => {
    return (
      <TouchableOpacity style={styles.NextButton} onPress={handleSubmit(onSubmit)}>
          <FontAwesome name="chevron-right" color="white" size={20} style={styles.nextIcon} />
      </TouchableOpacity>
      
    );
  };

  const removeRow = (indexToRemove) => {
    const newFormData = [...formData];
    newFormData.splice(indexToRemove, 1);
    setFormData(newFormData);
  };

  const handleDescriptionChange = (index, value) => {
    const newFormData = [...formData];
    newFormData[index].description = value;
    setFormData(newFormData);
  };

  const handleSpecificationChange = (index, value) => {
    const newFormData = [...formData];
    newFormData[index].specification = value;
    setFormData(newFormData);
  };

  const handleQuantityChange = (index, value) => {
    const newFormData = [...formData];
    newFormData[index].quantity = value;
    setFormData(newFormData);
  };

  const onSubmit = (data) => {
     console.log("Form Data:", data);
    const consumablesData = formData.map((item, index) => ({
      Description: typeof data[`description${index}`] === 'function'
        ? data[`description${index}`]()  // If it's a function, call it to get the value
        : data[`description${index}`],
      Quantity: data[`quantity${index}`],
      Specification: data[`specification${index}`],
    })).filter((item) =>
      item.Description && item.Quantity && item.Specification &&
      item.Description.trim() !== '' && item.Quantity.trim() !== '' && item.Specification.trim() !== ''
    );
  
    if (consumablesData.length > 0) {
      WizardStore.update((s) => {
        s.progress = "1";
        s.consumablesData = consumablesData;
      });
      navigation.navigate("OperationalToolsTackles");
    } else {
      setShowErrorAlert(true);
    }
  };
  
  

  useEffect(() => {
    console.log("Descriptions:", projectOptions);
  }, [projectOptions]);

  return (
    <View style={styles.container}>
      <ProgressBar
        style={styles.progressBar}
        progress={WizardStore.getRawState().progress}
        color={MD3Colors.primary60}
      />
      <View style={{ paddingHorizontal: 16 }}>
        {/* Dynamic form for Description, Specification, and Quantity */}
        <View style={styles.formEntry}>
          {formData.map((item, index) => (
            <Card key={index} style={styles.card}>
              <Card.Content>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text style={styles.heading}>Description</Text>
                    <Controller
                      control={control}
                      name={`description${index}`}
                      defaultValue=''
                      rules={{ required: 'Description is required' }}
                      render={({ field }) => (
                        <>
                          <DropdownPickerItem
                            index={index}
                            projectOptions={projectOptions}
                            onChangeItem={(index, value) => {
                              field.onChange(value);
                              setSelectedProject(value);
                              // Add additional logic if needed
                            }}
                          />
                          {errors[`description${index}`] && (
                            <Text style={{ color: 'red', paddingTop: 2, fontSize: 12 }}>
                              {errors[`description${index}`].message}
                            </Text>
                          )}
                        </>
                      )}
                    />
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.heading}>Specification</Text>
                    <Controller
                      control={control}
                      name={`specification${index}`}
                      defaultValue={item.specification}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          placeholder={`Specification`}
                          value={field.value}
                          onChangeText={(value) => {
                            field.onChange(value);
                            handleSpecificationChange(index, value);
                          }}
                        />
                      )}
                    />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text style={styles.heading}>Quantity</Text>
                    <Controller
                      control={control}
                      name={`quantity${index}`}
                      defaultValue={item.quantity}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          placeholder={`Quantity`}
                          value={field.value}
                          onChangeText={(value) => {
                            field.onChange(value);
                            handleQuantityChange(index, value);
                          }}
                        />
                      )}
                    />
                  </View>
                  <Card.Actions>
                  <Card.Actions style={styles.cardActions}>
                  <FontAwesome
                    name="trash"
                    color="#FF0000"
                    size={20}
                    onPress={() => {
                      removeRow(index);
                    }}>
                  </FontAwesome>
                </Card.Actions>
                </Card.Actions>
                  </View>
              </Card.Content>
            </Card>
          ))}
          <FloatingButton />
        </View>
      </View>
      <PreviousButton />
      <NextButton />
    </View>
  );
}

const styles = StyleSheet.create({
  NextButton: {
    backgroundColor: '#665208', 
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20, 
    right: 20, 
    elevation: 8, 
  },
  PreviousButton: {
    backgroundColor: '#665208', 
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20, 
    left: 20, 
    elevation: 8, 
  },
  floatingButton: {
    backgroundColor: 'green', 
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    top: 10, 
    left: 305, 
    elevation: 8, 
  },
  cardActions: {
    position: 'fixed',
    bottom:55,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#FBFAEB'
  },
  card: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    margin: 4,
  },
  heading: {
    fontWeight: 'bold',
  },
  button: {
    margin: 8,
  },
  titleStyle: {
    color: '#FFFFFF'
 },
  goBackButton: {
    backgroundColor: '#665208',
    color: 'white',
  },
  nextButton: {
    backgroundColor: '#665208',
  },
  progressBar: {
    marginBottom: 16,
  },
  formEntry: {
    margin: 3,
  },
  titleStyle: {
    color: 'white',
    fontSize:16,
    fontWeight:'bold'
 },
});
