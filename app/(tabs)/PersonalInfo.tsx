import React, {useEffect, useState} from "react";
import {ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {Button, Card, Dialog, IconButton, Paragraph, Portal, Provider as PaperProvider} from "react-native-paper";
import Theme from "@/appTheme";
import DropdownMenu from "@/components/DropdownMenu";
import DateRangePicker from "@/components/DateRangePicker";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {genderOptions} from "@/app/CreateNewPlan/UserData";
import {levelOptions} from "@/app/CreateNewPlan/UserLevel";
import {goalOptions} from "@/app/CreateNewPlan/UserGoal";
import {Gender, UserFitnessData, UserPreferences} from "@/app/types/user";
import {PlanAPI} from "@/serverAPI/PlanAPI";
import {HeightData, useGoogleFit, WeightData} from "@/app/context/GoogleFitContext";
import {defaultLoader} from "@/components/Loader";


const GENDER_OPTIONS = genderOptions;

const LEVEL_OPTIONS = levelOptions;

const GOAL_OPTIONS = goalOptions;

export const formatDate = (inputDate: string) => {
    const date = new Date(inputDate);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export default function MyTraining() {
    const [editMode, setEditMode] = useState(false);
    const [gender, setGender] = useState(Gender.male);
    const [age, setAge] = useState("25");
    const [level, setLevel] = useState("Beginner");
    const [goal, setGoal] = useState("Increase Distance");
    const [goalStartDate, setGoalStartDate] = useState("");
    const [goalEndDate, setGoalEndDate] = useState("");
    const [height, setHeight] = useState<number | undefined>(undefined);
    const [weight, setWeight] = useState<number | undefined>(undefined);
    const [userFitnessData, setUserFitnessData] = useState<UserFitnessData>({
        height: 0,
        weight: 0,
    })
    const [isLoading, setIsLoading] = useState(false);

    //google-fit context
    const {
        getCurrentHeight,
        getCurrentWeight,
        fetchSessionsDataFromGoogleFit
    } = useGoogleFit();

    // Calendar Dialog state
    const [visible, setVisible] = useState(false);
    const [selectedRange, setSelectedRange] = useState<{ start: string | undefined, end: string | undefined }>({
        start: undefined,
        end: undefined
    });
    const [error, setError] = useState<string | undefined>();

    //Confirmation Dialog state
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    useEffect(() => {
        initializeUserData();
    }, []);

    const initializeUserData = async () => {
        setIsLoading(true);
        try {
            const userData = await PlanAPI.getUserData();
            userData.age && setAge(userData.age);
            userData.gender && setGender(userData.gender);
            userData.userRunningLevel && setLevel(userData.userRunningLevel);
            userData.userRunningGoal && setGoal(userData.userRunningGoal);
            userData.startDate && setGoalStartDate(userData.startDate);
            userData.endDate && setGoalEndDate(userData.endDate);
            userData.startDate && userData.endDate && setSelectedRange({start: userData.startDate, end: userData.endDate});
            const endTime = Date.now();
            const lastNinetyDays = Date.now() - 90 * 24 * 60 * 60 * 1000; // Last 90 days
            const currentWeight = await getCurrentWeight(lastNinetyDays, endTime) as WeightData;
            setWeight(currentWeight.weight);
            const currentHeight = await getCurrentHeight(lastNinetyDays, endTime) as HeightData;
            setHeight(currentHeight.height);
            setUserFitnessData({height: currentHeight.height, weight: currentWeight.weight});
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const userDataToSave: UserPreferences = {
                gender,
                age,
                userRunningLevel: level,
                userRunningGoal: goal,
                startDate: goalStartDate,
                endDate: goalEndDate
            }
            const successToSaveUserData = await PlanAPI.setUserData(userDataToSave);
            if (successToSaveUserData.data) {
                const plan = await PlanAPI.generatePlan({userFitnessData: userFitnessData, userPreferences: userDataToSave});
                console.log(plan);
                toggleEditMode();
            } else {
                console.log("Failed to save user preferences data for some reason...");//todo: how to handle failer?
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const showDateRangePickerDialog = () => {
        setVisible(true);
    };

    const handleCalendarDialogSubmit = () => {
        if (selectedRange.start && selectedRange.end) {
            setGoalStartDate(selectedRange.start);
            setGoalEndDate(selectedRange.end);
            setSelectedRange({start: undefined, end: undefined});
            setVisible(false);
            setError(undefined);
        } else {
            setError("Please select a start and end date.");
        }
    };

    const onSavePress = () => {
        setShowConfirmationDialog(true);
    };

    const onConfirmationDialogConfirm = () => {
        setShowConfirmationDialog(false);
        handleSave();
    };

    const onConfirmationDialogCancel = () => {
        setShowConfirmationDialog(false);
    };

    const handleCalendarDialogCancel = () => {
        setVisible(false);
        setError(undefined);
    };

    const handleLevelChange = async (value: string) => {
        await new Promise(resolve => setTimeout(resolve, 300));

        setLevel(value);
    };
    const handleGoalChange = async (value: string) => {
        await new Promise(resolve => setTimeout(resolve, 300));

        setGoal(value);
    };

    const handleGenderChange = async (value: string) => {
        await new Promise(resolve => setTimeout(resolve, 300));

        // @ts-ignore
        setGender(value);
    };


    return (
        isLoading ? (defaultLoader()) : (
            <ScrollView>
                <PaperProvider>
                    <View style={styles.container}>
                        <View style={{marginVertical: 10}}>
                            <Text style={[styles.homeText, {fontWeight: "bold", fontSize: 25}]}>
                                Personal Info
                            </Text>
                        </View>


                        {!editMode && <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Height:</Text>
                            <Text style={styles.value}>{height ? height.toFixed(2) + " meter" : "-"}</Text>
                        </View>}


                        {!editMode && <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Weight:</Text>
                            <Text style={styles.value}>{weight ? weight + " kg" : "-"}</Text>
                        </View>}


                        <View style={styles.fieldContainer}>
                            {editMode ? (
                                <View style={styles.editableInputContainer}>
                                    <Text style={styles.label}>Age: </Text>
                                    <MaterialCommunityIcons name="pencil" size={20} color="#888"
                                                            style={styles.editIcon}/>
                                    <TextInput
                                        style={styles.ageInput}
                                        keyboardType="numeric"
                                        value={age}
                                        onChangeText={setAge}
                                        placeholder="Enter Age"
                                    />

                                </View>
                            ) : (
                                <View>
                                    <Text style={styles.label}>Age:</Text>
                                    <Text style={styles.value}>{age}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.fieldContainer}>
                            {editMode ? (
                                <DropdownMenu items={GENDER_OPTIONS}
                                              onItemChange={handleGenderChange}
                                              defaultValue={gender}
                                              dropdownLabel={"Gender:"}/>
                            ) : (
                                <View>
                                    <Text style={styles.label}>Gender:</Text>
                                    <Text style={styles.value}>{gender}</Text>
                                </View>
                            )}
                        </View>


                        <View style={styles.fieldContainer}>
                            {editMode ? (
                                <DropdownMenu items={LEVEL_OPTIONS}
                                              onItemChange={handleLevelChange}
                                              defaultValue={level}
                                              dropdownLabel={"Level:   "}/>
                            ) : (
                                <View>
                                    <Text style={styles.label}>Level:</Text>
                                    <Text style={styles.value}>{level}</Text>
                                </View>

                            )}
                        </View>

                        <View style={styles.fieldContainer}>
                            {editMode ? (
                                <DropdownMenu items={GOAL_OPTIONS}
                                              onItemChange={handleGoalChange}
                                              defaultValue={goal}
                                              dropdownLabel={"Goal:    "}/>
                            ) : (
                                <View>
                                    <Text style={styles.label}>Goal:</Text>
                                    <Text style={styles.value}>{goal}</Text></View>
                            )}
                        </View>

                        <Card style={{backgroundColor: 'white', paddingVertical: 10, marginVertical: 10}}>
                            <Text style={styles.dateLabel}>Dates of your plan:</Text>
                            <View>
                                <Text
                                    style={editMode ? styles.cardInputEdit : styles.cardInputDisplay}>{`From: ${formatDate(goalStartDate)}`}</Text>
                                <Text
                                    style={editMode ? styles.cardInputEdit : styles.cardInputDisplay}>{`To: ${formatDate(goalEndDate)}`}</Text>
                            </View>

                            {editMode && (
                                <Button
                                    mode="contained"
                                    onPress={showDateRangePickerDialog}
                                    style={styles.openDialogBtn}
                                    contentStyle={styles.buttonContent}
                                    textColor={'white'}
                                    labelStyle={{fontSize: 16}}>
                                    {"Reschedule "}
                                    <MaterialCommunityIcons name="calendar" size={18} color="white"/>
                                </Button>
                            )}
                        </Card>

                        {/* Dialog for Date Range Picker */}
                        <Portal>
                            <Dialog
                                visible={visible}
                                onDismiss={handleCalendarDialogCancel}
                                style={styles.dialog}
                            >
                                <Dialog.Title style={styles.dialogTitle}>Select Dates Range</Dialog.Title>
                                <Dialog.Content>
                                    <DateRangePicker
                                        dispatchDates={(startDate, endDate) => {
                                            setSelectedRange({start: startDate, end: endDate});
                                        }}/>
                                    {error && <Text style={styles.errorText}>{error}</Text>}
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={handleCalendarDialogCancel}
                                            style={[styles.dialogButtons, styles.cancelButton]}
                                            textColor={'white'}>Cancel</Button>
                                    <Button onPress={handleCalendarDialogSubmit}
                                            style={[styles.dialogButtons, styles.saveButton]}
                                            textColor={'white'}>Submit</Button>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>

                        {/* Confirmation Dialog */}
                        <Portal>
                            <Dialog visible={showConfirmationDialog} onDismiss={onConfirmationDialogCancel}
                                    style={styles.confirmationDialog}>
                                <Dialog.Title style={styles.confirmationDialogTitleText}>Warning!</Dialog.Title>
                                <Dialog.Content style={styles.confirmationDialogContent}>
                                    <IconButton icon="alert-circle" size={24} iconColor={"#2f93ab"}/>
                                    <Paragraph style={styles.confirmationDialogParagraph}>
                                        Are you sure you want to save changes? This will override all past plan data.
                                    </Paragraph>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={onConfirmationDialogCancel} style={styles.cancelButton}
                                            textColor={'white'}>
                                        {' Cancel '}
                                    </Button>
                                    <Button onPress={onConfirmationDialogConfirm} style={styles.saveButton}
                                            textColor={'white'}>
                                        Continue
                                    </Button>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>

                        <View style={styles.buttonContainer}>
                            {editMode ? (
                                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                                    <Button mode="contained" onPress={toggleEditMode}
                                            style={[styles.modeButton, styles.cancelButton]}
                                            textColor={'white'}
                                            labelStyle={styles.modeButtonText} contentStyle={styles.modeButtonContent}>
                                        Cancel
                                    </Button>
                                    <Button mode="contained" onPress={onSavePress}
                                            style={[styles.modeButton, styles.saveButton]}
                                            textColor={'white'}
                                            labelStyle={styles.modeButtonText} contentStyle={styles.modeButtonContent}>
                                        Save
                                    </Button>
                                </View>
                            ) : (
                                <Button mode="contained" onPress={toggleEditMode}
                                        style={[styles.modeButton, styles.saveButton]}
                                        textColor={'white'} labelStyle={styles.modeButtonText}
                                        contentStyle={styles.modeEditButtonContent}>
                                    Edit
                                </Button>
                            )}
                        </View>
                    </View>
                </PaperProvider>
            </ScrollView>
        )
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        direction: "ltr",
    },
    homeText: {
        color: "#2f93ab",
    },
    fieldContainer: {
        marginVertical: 8,
    },
    label: {
        marginBottom: 8,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 5
    },
    dateLabel: {
        marginBottom: 8,
        fontSize: 20,
        fontWeight: 'bold',
        color: Theme.colors.themeColor,
        alignSelf: "center"
    },
    input: {
        fontSize: 16,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    cardInputEdit: {
        fontSize: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        alignSelf: "center",
    },
    cardInputDisplay: {
        fontSize: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        alignSelf: "center",
        color: "#555"
    },
    value: {
        fontSize: 16,
        color: "#555",
        marginHorizontal: 5
    },
    buttonContainer: {
        marginTop: 20,
    },
    openDialogBtn: {
        backgroundColor: "#2f93ab",
        alignSelf: "center",
        paddingHorizontal: 4,
        paddingVertical: 2,
        flexDirection: 'row',
    },
    buttonContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dialog: {
        maxHeight: '80%',
        width: '100%',
        alignSelf: "center",
        alignItems: "center",
        backgroundColor: Theme.colors.white
    },
    dialogButtons: {
        width: 100

    },
    dialogTitle: {
        color: Theme.colors.themeColor,
        flexDirection: "row",
        alignSelf: "center"
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        alignSelf: "center"
    },
    modeButton: {
        position: 'relative',
        marginTop: 10,
        marginBottom: 20,
        alignSelf: 'center',
    },
    cancelButton: {
        backgroundColor: "#959e9f"
    },
    saveButton: {
        backgroundColor: Theme.colors.themeColor
    },
    modeButtonContent: {
        height: 55,
        width: 145,
    },
    modeEditButtonContent: {
        height: 55,
        width: 320,
    },
    modeButtonText: {
        fontSize: 20,
    },
    editableInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ageInput: {
        flex: 1,
        fontSize: 16,
        marginStart: 9,
        marginEnd: 3,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    editIcon: {
        justifyContent: "flex-end",
        marginBottom: 15

    },

    confirmationDialog: {
        width: '100%',
        paddingHorizontal: 15,
        alignSelf: "center",
        alignItems: "center",
        backgroundColor: Theme.colors.white
    },
    confirmationDialogTitleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#2f93ab",
        alignSelf: 'center'
    },
    confirmationDialogParagraph: {
        color: '#444',
        fontSize: 14,
        flexWrap: 'wrap',
        fontWeight: 'bold',
    },
    confirmationDialogContent: {
        flexDirection: 'row',

    },
});
