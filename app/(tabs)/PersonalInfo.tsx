import React, {useState} from "react";
import {ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {Button, Card, Dialog, Portal, Provider as PaperProvider} from "react-native-paper";
import Theme from "@/appTheme";
import DropdownMenu from "@/components/DropdownMenu";
import DateRangePicker from "@/components/DateRangePicker";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {genderOptions} from "@/app/CreateNewPlan/UserData";
import {levelOptions} from "@/app/CreateNewPlan/UserLevel";
import {goalOptions} from "@/app/CreateNewPlan/UserGoal";
import {Gender} from "@/app/types/user";


const GENDER_OPTIONS = genderOptions;

const LEVEL_OPTIONS = levelOptions;

const GOAL_OPTIONS = goalOptions;

export default function MyTraining() {
    const [editMode, setEditMode] = useState(false);
    const [gender, setGender] = useState(Gender.male);
    const [age, setAge] = useState("25");
    const [level, setLevel] = useState("Beginner");
    const [goal, setGoal] = useState("Increase Distance");
    const [goalStartDate, setGoalStartDate] = useState("");
    const [goalEndDate, setGoalEndDate] = useState("");

    // Dialog state
    const [visible, setVisible] = useState(false);
    const [selectedRange, setSelectedRange] = useState<{ start: string | undefined, end: string | undefined }>({
        start: undefined,
        end: undefined
    });
    const [error, setError] = useState<string | undefined>();

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const handleSave = () => {
        toggleEditMode();
    };

    const showDateRangePickerDialog = () => {
        setVisible(true);
    };

    const handleDialogSubmit = () => {
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

    const handleDialogCancel = () => {
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
        <ScrollView>
            <PaperProvider>
                <View style={styles.container}>
                    <View style={{marginVertical: 10}}>
                        <Text style={[styles.homeText, {fontWeight: "bold", fontSize: 25}]}>
                            Personal Info
                        </Text>
                    </View>

                    <View style={styles.fieldContainer}>
                        {editMode ? (
                            <View style={styles.editableInputContainer}>
                                <Text style={styles.label}>Age: </Text>
                                <MaterialCommunityIcons name="pencil" size={20} color="#888" style={styles.editIcon}/>
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
                                          defaultValue={Gender.male}
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
                                          defaultValue={"Beginner"}
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
                                          defaultValue={"Increase Distance"}
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
                                style={editMode ? styles.cardInputEdit : styles.cardInputDisplay}>{`From: ${goalStartDate}`}</Text>
                            <Text
                                style={editMode ? styles.cardInputEdit : styles.cardInputDisplay}>{`To: ${goalEndDate}`}</Text>
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
                            onDismiss={handleDialogCancel}
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
                                <Button onPress={handleDialogCancel} style={styles.dialogButtons}
                                        textColor={'white'}>Cancel</Button>
                                <Button onPress={handleDialogSubmit} style={styles.dialogButtons}
                                        textColor={'white'}>Submit</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>

                    <View style={styles.buttonContainer}>
                        {editMode ? (
                            <Button mode="contained" onPress={handleSave} style={styles.modeButton} textColor={'white'}
                                    labelStyle={styles.modeButtonText} contentStyle={styles.modeButtonContent}>
                                Save
                            </Button>
                        ) : (
                            <Button mode="contained" onPress={toggleEditMode} style={styles.modeButton}
                                    textColor={'white'} labelStyle={styles.modeButtonText}
                                    contentStyle={styles.modeButtonContent}>
                                Edit
                            </Button>
                        )}
                    </View>
                </View>
            </PaperProvider>
        </ScrollView>
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
        flexDirection: 'row-reverse',
    },
    buttonContent: {
        flexDirection: 'row-reverse',
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
        backgroundColor: Theme.colors.themeColor,
        width: 100

    },
    dialogTitle: {
        color: Theme.colors.themeColor,
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
        backgroundColor: Theme.colors.themeColor,
    },
    modeButtonContent: {
        height: 55,
        width: 320,
    },
    modeButtonText: {
        fontSize: 20,
    },
    editableInputContainer: {
        flexDirection: 'row-reverse',
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
});
