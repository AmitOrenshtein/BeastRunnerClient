import Theme from "@/appTheme";
import { Text, View, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import { router } from "expo-router";

export default function HomePageCard(props: {imageSrc:ImageSourcePropType, title: string, content: string, link?:string}) {
    function onClick() {
        if(props.link) {
            router.replace(props.link);
        }
    }

    return (        
        <TouchableOpacity style={[styles.container]} onPress={onClick}>
            <View style={[styles.cardSection, {flex:4}]}>
                <Image source={props.imageSrc} style={{width:"100%", height: undefined, aspectRatio: 1,resizeMode:"contain"}}></Image>
            </View>
            <View style={[styles.cardSection, {flex:3}]}>
                <View style={{justifyContent:"center"}}>
                    <Text style={{color: Theme.colors.themeColor, fontSize:17, lineHeight:24}}>{props.title}</Text>
                    <Text style={{fontSize:15, lineHeight:24}}>{props.content}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection:"row",
        backgroundColor: "white",
        borderStyle: 'solid',
        borderWidth:2,
        borderColor: 'lightgrey',
        borderRadius:20,
        marginBottom:10,
        marginTop:10
    },
    cardSection: {
        padding:10,
    }
  });