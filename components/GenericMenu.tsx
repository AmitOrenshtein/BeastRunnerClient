import {useState} from 'react';
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
    menuContainer:{
        top: 35,
        left: -122,
        position: "absolute",
        zIndex: 100,
        width: 150,
        // justifyContent: "flex-end",
    },
    // menuItem: {
    //     backgroundColor: "#2f93ab",
    //     color:'white',
    // },
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
                style={styles.menuContainer}
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
                    <Menu.Item 
                        key={value.title}
                        // style={styles.menuItem}
                        onPress={() => {
                        (!value.keepMenuOpen && closeMenu());
                        value.onItemPress();
                    }} title={value.title}/>
                )}
            </Menu>
        </Provider>
    );
};

export default GenericMenu;
