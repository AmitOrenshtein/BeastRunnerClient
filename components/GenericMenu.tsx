import React, {useState} from 'react';
import {TouchableOpacity, Image, StyleSheet, View} from 'react-native';
import {Menu, Provider} from 'react-native-paper';
import {GenericMenuProps} from "@/app/types/menu";
import appTheme from "@/appTheme";
import {Icon} from "react-native-elements";

const styles = StyleSheet.create({
    menuIcon: {
        width: 40,
        height: 40,
    },
    // menuItemContainer: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     paddingVertical: 10, // Adjust as needed
    // },
    // menuItemText: {
    //     fontSize: 16,
    //     color: 'black', // Adjust as needed
    // }
});

const GenericMenu = (props: GenericMenuProps) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    return (
        <Provider>
            <Menu
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={
                    <TouchableOpacity onPress={openMenu}>
                        <Icon
                            name="menu"
                            color={appTheme.colors.white}
                            style={styles.menuIcon}
                        />
                    </TouchableOpacity>
                }
            >
                {props.menuItems.map(value =>
                    <Menu.Item onPress={() => {
                        (!value.keepMenuOpen && closeMenu());
                        value.onItemPress();
                    }} title={value.title}/>
                )}
            </Menu>
        </Provider>
    );
};

export default GenericMenu;
