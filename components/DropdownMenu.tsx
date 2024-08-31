import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import Theme from "@/appTheme";

interface DropdownItem {
    label: string,
    value: string
}

interface DropdownMenuProps {
    items: DropdownItem[]
    onItemChange: (item: string) => void
    defaultValue?: string
    dropdownLabel?: string
}

const DropdownMenu = (props: DropdownMenuProps) => {
    const [value, setValue] = useState<string | undefined>(props.defaultValue);

    return (
        <View style={styles.container}>
            {props.dropdownLabel && <Text style={styles.label}> {props.dropdownLabel} </Text>}
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={props.items}
                // search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select Item"
                searchPlaceholder="Search..."
                value={value}
                activeColor={Theme.colors.themeColor}
                onChange={item => {
                    setValue(item.value);
                    props.onItemChange(item.value);
                }}

                // renderLeftIcon={() => (
                //     <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
                // )}


            />
        </View>
    );
};

export default DropdownMenu;

const styles = StyleSheet.create({
    container: {
        marginBottom:20,
        flexDirection:"row",
        // alignItems:"baseline" // do a problem in personalInfo screen when press edit button
    },
    label: {
        marginBottom: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop:13
    },
    dropdown: {
        marginHorizontal: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
        width:"70%"
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});
