import { Text, View, StyleSheet, Button, Pressable, SafeAreaView, FlatList, Modal, TextInput } from "react-native";
import {Workout } from "../types/training";
import React, { SetStateAction, useEffect, useState } from "react";
import moment from "moment";
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { Icon } from 'react-native-elements';


export default function EditWorkout({workout, setWorkout, modalVisible, setModalVisible}: {workout: Workout, setWorkout: React.Dispatch<React.SetStateAction<Workout>>, modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>}) {
    const [editedWorkout, setEditedWorkout] = useState<string>(workout.workout);

    useEffect(() => {
        workout && setEditedWorkout(workout.workout)
    }, [workout])

    const onSaveHandler = () => {
        console.log(`Saves workout for date: ${workout.date}`);
        console.log(`Workout: ${editedWorkout}`);
        setModalVisible(!modalVisible);
    }


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }
        }>
        <View style={styles.modalView}>
            <Text style={styles.modalText}>{moment(workout.date).format("DD/MM/YY")}</Text>
            <TextInput
                editable
                multiline
                numberOfLines={4}
                style={styles.input}
                onChangeText={setEditedWorkout}
                value={editedWorkout}
            />
          <View style={{flexDirection:"row"}}>
            <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}>
                <Icon color="white" name='close' />
            </Pressable>
            <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => onSaveHandler()}>
                <Icon color="white" name='save' />
            </Pressable>
            </View>
        </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalView: {
        marginHorizontal:width / 2.75,
        marginVertical: height / 3,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        flex: 1,
        justifyContent: 'center',
    },
    button: {
      borderRadius: 5,
      padding: 8,
      marginHorizontal:10,
      elevation: 2,
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    input: {
        width: width / 5,
        margin: 15,
        borderWidth: 1,
        padding: 10,
      },
  });
  