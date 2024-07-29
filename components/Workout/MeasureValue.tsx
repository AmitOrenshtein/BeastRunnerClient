
import { Text, View, StyleSheet } from "react-native";
export default function MeasureValue(props: {flex:number, text:string, value:(number|string), fontSize?: number}) {

    const basicFontSize = props.fontSize || 25;
    const styles = StyleSheet.create({
        text: {
            color: 'white'
        }
      });

    return (
        <View style={{flex: props.flex, justifyContent:"center", alignItems:"center"}}>
            <Text style={[styles.text, {fontSize: (basicFontSize + 10), fontWeight:"bold"}]}>{props.value}</Text>
            <Text style={[styles.text, {fontSize: basicFontSize}]}>{props.text}</Text>
        </View>
    );
}