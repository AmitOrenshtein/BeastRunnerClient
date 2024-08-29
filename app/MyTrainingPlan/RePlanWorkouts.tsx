import { Text, View, StyleSheet, Pressable, Modal, Dimensions } from "react-native";
import { IsRePlanNeededValues, WeeklyPlan } from "../types/training";
import { PlanAPI } from "@/serverAPI/PlanAPI";
const { width, height } = Dimensions.get("window");

export default function RePlanWorkouts({isRePlanNeeded, setIsRePlanNeeded, setPlan}: {
    isRePlanNeeded: IsRePlanNeededValues, 
    setIsRePlanNeeded: React.Dispatch<React.SetStateAction<IsRePlanNeededValues>>,
    setPlan: React.Dispatch<React.SetStateAction<WeeklyPlan[]>>}) {

    const rePlan = () => {
        PlanAPI.rePlanWorkoutPlan(isRePlanNeeded).then((res) => {
            console.log(res);
            setPlan(res.data.plan);
            setIsRePlanNeeded(IsRePlanNeededValues.NoNeedForRePlan);
        });
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isRePlanNeeded != IsRePlanNeededValues.NoNeedForRePlan}
            onRequestClose={() => {
                setIsRePlanNeeded(IsRePlanNeededValues.NoNeedForRePlan);
            }
        }>
            <View style={styles.modalView}>
                <Text style={styles.titleText}>Let me help!</Text>
                <Text style={styles.contentText}>
                    I see the last few trainings were {isRePlanNeeded === IsRePlanNeededValues.ToEasy ? 'easy' : 'difficult'} for you.
                    Would you like us to readujst your training plan?
                </Text>
                <View style={{flexDirection:"row", alignSelf:"center"}}>
                    <Pressable
                    style={[styles.button, {backgroundColor: "#78CFE4"}]}
                    onPress={() => rePlan()}>
                        <Text>Yes</Text>
                    </Pressable>
                    <Pressable
                    style={[styles.button, {backgroundColor: "red"}]}
                    onPress={() => setIsRePlanNeeded(IsRePlanNeededValues.NoNeedForRePlan)}>
                        <Text>No</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalView: {
        marginHorizontal:'10%',
        marginVertical: height / 5,
        minHeight: height / 2.5,
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
    titleText: {
        fontWeight: "bold", 
        fontSize: 25,
        color: "#2f93ab",
    },
    contentText: {
        marginVertical: 20,
        fontSize: 18,
        lineHeight:30
    },
    button: {
      borderRadius: 5,
      padding: 8,
      marginHorizontal:30,
      flex: 1,
      alignItems: "center"
    }

});