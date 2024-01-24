import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { WizardStore } from "../store";
// import { Divider, Button as PaperButton, Card } from "react-native-paper";
import { Divider, Button as PaperButton, Card, MD3Colors, ProgressBar } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import Confirmation from "./ConfirmationScreen";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
export default function OperationalMachine({ navigation }) {
  // ... (previous code)
  React.useLayoutEffect(() => {
      navigation.setOptions({
          headerLeft: () => null,
          headerTitle: 'Machinery', 
        });
        navigation.setOptions({ title: "" });
      }, [navigation]);
  
    const {
      handleSubmit,
      control,
      formState: { errors },
    } =  useForm({ 
      defaultValues: WizardStore.useState((s) => {
        console.log("IRSRT"+JSON.stringify(s)); // Log 's' here
        return s;
      })
    });
    const isFocused = useIsFocused();
  
    useEffect(() => {
      isFocused &&
        WizardStore.update((s) => {
          s.progress = "0.9";
        });
  
    }, [isFocused]);
  
    
  
  const [formData, setFormData] = useState([
    { Machine: "", OpeningKM: "", ClosingKM: "", FuelQty: "", FuelCostPerLiter: "" }
  ]);

  const FloatingButton = ({ onPress }) => {
    return (
      <TouchableOpacity style={styles.floatingButton} onPress={addRow}>
        {/* <Text style={styles.buttonText}>Button</Text> */}
          <FontAwesome   name="plus" color='white' size={20}>
          </FontAwesome>
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

  const PreviousButton = ({ onPress }) => {
    return (
      <TouchableOpacity style={styles.PreviousButton} onPress={() => navigation.goBack()}>
          <FontAwesome name="chevron-left" color="white" size={20} style={styles.nextIcon} />
      </TouchableOpacity>
    );
  };

  const addRow = () => {
      setFormData([...formData, { description: "", quantity: "" }]);
    };
  
    const removeRow = (indexToRemove) => {
      const newFormData = [...formData];
      newFormData.splice(indexToRemove, 1);
      setFormData(newFormData);
    };
  

  // ... (previous code)

  const handleMachineChange = (index, value) => {
    const newFormData = [...formData];
    newFormData[index].Machine = value;
    setFormData(newFormData);
  };

  const handleOpeningKMChange = (index, value) => {
    const newFormData = [...formData];
    newFormData[index].OpeningKM = value;
    setFormData(newFormData);
  };

  const handleClosingKMChange = (index, value) => {
    const newFormData = [...formData];
    newFormData[index].ClosingKM = value;
    setFormData(newFormData);
  };

  const handleFuelQtyChange = (index, value) => {
    const newFormData = [...formData];
    newFormData[index].FuelQty = value;
    setFormData(newFormData);
  };

  const handleFuelCostPerLiterChange = (index, value) => {
    const newFormData = [...formData];
    newFormData[index].FuelCostPerLiter = value;
    setFormData(newFormData);
  };

  
  const onSubmit = (data) => {

    const machine = formData.map((item, index) => ({
      Machine: data[`Machine${index}`],
      OpeningKM: data[`OpeningKM${index}`],
      ClosingKM: data[`ClosingKM${index}`],
      FuelQty: data[`FuelQty${index}`],
      FuelCostPerLiter: data[`FuelCostPerLiter${index}`],
    }))
    .filter((item) => 
    item.Machine && item.OpeningKM &&
    item.ClosingKM && item.FuelQty &&
    item.Machine &&
    item.Machine.trim() !== '' && item.OpeningKM.trim() !== '' &&
    item.ClosingKM.trim() !== '' && item.FuelQty.trim() !== '' &&
    item.FuelCostPerLiter.trim() !== ''
  );
    WizardStore.update((s) => {
      s.progress = "0.9";
      console.log(machine.length)
      if (machine.length > 0) {
        s.machine = machine;
      }
    });
      navigation.navigate(Confirmation);
    };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      <ProgressBar
        style={styles.progressBar}
        progress={WizardStore.getRawState().progress}
        color={MD3Colors.primary60}
      />
      <View style={{ paddingHorizontal: 16 }}>
        {/* Dynamic form for Machine, Opening KM, Closing KM, Fuel Qty, and Fuel Cost per Liter */}
        <View style={styles.formEntry}>
          {formData.map((item, index) => (
            <Card key={index} style={styles.card}>
              <Card.Content>
                <View style={styles.row_machine}>
                  <View style={styles.column}>
                    <Text style={styles.heading}>Machine</Text>
                    <Controller
                      control={control}
                      name={`Machine${index}`}
                      defaultValue={item.Machine}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          placeholder={`Machine`}
                          value={field.value}
                          onChangeText={(value) => {
                            field.onChange(value);
                            handleMachineChange(index, value);
                          }}
                        />
                      )}
                    />
                  </View>
                </View>
                <View style={styles.row}>
                 <View style={styles.column}>
                    <Text style={styles.heading}>Opening KM</Text>
                    <Controller
                      control={control}
                      name={`OpeningKM${index}`}
                      defaultValue={item.OpeningKM}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          placeholder={`Opening KM`}
                          value={field.value}
                          onChangeText={(value) => {
                            field.onChange(value);
                            handleOpeningKMChange(index, value);
                          }}
                        />
                      )}
                    />
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.heading}>Closing KM</Text>
                    <Controller
                      control={control}
                      name={`ClosingKM${index}`}
                      defaultValue={item.ClosingKM}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          placeholder={`Closing KM`}
                          value={field.value}
                          onChangeText={(value) => {
                            field.onChange(value);
                            handleClosingKMChange(index, value);
                          }}
                        />
                      )}
                    />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <Text style={styles.heading}>Fuel Cost / Lt</Text>
                    <Controller
                      control={control}
                      name={`FuelCostPerLiter${index}`}
                      defaultValue={item.FuelCostPerLiter}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          placeholder={`Fuel Cost / Lt`}
                          value={field.value}
                          onChangeText={(value) => {
                            field.onChange(value);
                            handleFuelCostPerLiterChange(index, value);
                          }}
                        />
                      )}
                    />
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.heading}>Fuel Qty</Text>
                    <Controller
                      control={control}
                      name={`FuelQty${index}`}
                      defaultValue={item.FuelQty}
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          placeholder={`Fuel Qty`}
                          value={field.value}
                          onChangeText={(value) => {
                            field.onChange(value);
                            handleFuelQtyChange(index, value);
                          }}
                        />
                      )}
                    />
                  </View>
                  {/* <View style={styles.column}>
                    <Text style={styles.heading}></Text>
                  </View> */}
                </View>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                {/* <PaperButton
                  mode="outlined"
                  onPress={() => {
                    removeRow(index);
                  }}
                  style={{ backgroundColor: '#D22B2B' }}
                >
                  <Text style={styles.titleStyle}>Delete</Text>
                </PaperButton> */}
                <FontAwesome
                  name="trash"
                  color="#FF0000"
                  size={20}
                  onPress={() => {
                    removeRow(index);
                  }}>
                </FontAwesome>
              </Card.Actions>
            </Card>
          ))}
          {/* <PaperButton mode="outlined" onPress={addRow} style={{ backgroundColor: '#097969' }}>
          <Text style={styles.titleStyle}>Add Row</Text>
          </PaperButton> */}
          
        </View>

        <Divider />
        <FloatingButton />

        {/* <View style={{ flexDirection: 'row', justifyContent:'space-between' }}>
          <PaperButton
            mode="outlined"
            style={[styles.actionButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.titleStyle}>Back</Text>
          </PaperButton>
          <View style={[styles.iconContainer, styles.actionButton1]}>
          <FontAwesome  
            name="plus"
            color="white"
            onPress={addRow}
            size={20} 
            style={[styles.actionIcon]}>
          </FontAwesome>
          </View>
          
          <PaperButton
            mode="outlined"
            onPress={handleSubmit(onSubmit)}
            style={[styles.actionButton]}>
            <Text style={styles.titleStyle}>Next</Text>
          </PaperButton>
        </View> */}

        {/* <PaperButton
          mode="outlined"
          style={[styles.button, styles.goBackButton, { marginTop: 40 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.titleStyle}>Back</Text>
        </PaperButton>
        <PaperButton
          mode="outlined"
          onPress={handleSubmit(onSubmit)}
          style={[styles.button, styles.nextButton]}
        >
          <Text style={styles.titleStyle}>Confirmation</Text>
        </PaperButton> */}
      </View>
      <PreviousButton />
      <NextButton />
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    scrollContainer: {
    flexGrow: 1,
  },
  floatingButton: {
    backgroundColor: 'green', 
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'absolute',
    top: 10, 
    left: 305, 
    elevation: 8, 
  },
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
  cardActions: {
    position: 'fixed',
    bottom:135,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor:'#FBFAEB'
  },
  card: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  row_machine:{
    flexDirection: 'row',
    width:100
  },
  column: {
    flex: 1,
    margin: 4,
  },
  heading: {
    fontWeight: 'bold',
  },
  button: {
    margin: 0,
  },
  goBackButton: {
    backgroundColor: '#665208',
    color: 'white',
  },
  nextButton: {
    backgroundColor: '#665208',
    // color: "white",
  },
  progressBar: {
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  formEntry: {
    margin: 3,
  },
  actionButton: {
    backgroundColor: '#665208',
    marginTop: 10 ,
    width:70, 
    height: 32,
    margin:10
  },
  titleStyle: {
    color: 'white',
    fontSize:12,
    margin:0,
    fontWeight:'bold',
    paddingHorizontal: 10,
    paddingVertical:0,
    marginHorizontal:0,
    marginVertical:5
 },
 actionIcon: {
  backgroundColor: 'transparent', // Set a transparent background
  borderWidth: 0, // Remove any border or styling that might interfere
  // padding: 8,
  paddingHorizontal: 10,
  paddingVertical:2,
  marginHorizontal:5,
  marginVertical:5,
  justifyContent: 'center',
  alignItems: 'center',
},
actionIcon: { 
  paddingHorizontal: 3,
  paddingVertical:0,
  justifyContent: 'center',
  alignItems: 'center',
},
iconContainer: {
  backgroundColor: 'green',
  borderRadius: 20,
},
actionButton1: {
  alignItems:'center',
  justifyContent:'center',
  backgroundColor: 'green',
  marginTop: 10 ,
  width:30, 
  height: 30,
},
});