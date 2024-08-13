import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Badge, Header} from 'react-native-elements';
import appTheme from '../appTheme';
import NotificationModal from '../components/NotificationsModal';
import {useAccessTokenAndUserId} from "@/app/context/IdentifiersContext";
import GenericMenu from "@/components/GenericMenu";
import {GenericMenuItemProps} from "@/app/types/menu";
import {logoutFromServer} from "@/serverAPI/AuthAPI";
import {clearAllDataFromAsyncStorage} from "@/app/utils/AsyncStorageUtil";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import { NotificationAPI } from '@/serverAPI/NotificationAPI';

const styles = StyleSheet.create({
    title: {
        color: appTheme.colors.white,
        fontSize: 22,
        fontFamily: 'Eras ITC',
        fontStyle: 'italic',
        fontWeight: 'bold'
    },
    notifications: {
        width: 40,
        height: 40
    },
    headerContainer: {
        zIndex: 1000,
    }
});

export default function AppHeader() {
  const [notificationsNumber, setNotificationsNumber] = useState(0);
  const {accessTokenState, userIdState, setAccessToken, setUserId} = useAccessTokenAndUserId();
  const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const fetchNotificationsNumber = async () => {
      await NotificationAPI.getNotificationsNumber().then((res) => {
        setNotificationsNumber(res.data)
      });
    }

    useEffect(() => {
      fetchNotificationsNumber();

      const intervalId = setInterval(fetchNotificationsNumber, 60000);

      return () => clearInterval(intervalId);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutFromServer();
            await clearAllDataFromAsyncStorage();
            await GoogleSignin.revokeAccess();//TODO: check about the premissions
            await GoogleSignin.signOut();
            setAccessToken(null);
            setUserId(null);
            console.log("user is now Logout");
            alert("user is now Logout");
        } catch (error) {
            console.log("Failed in logout.. error: ", error);
            alert("Failed in logout");
        }
    }

    const getMenuItems: GenericMenuItemProps[] = [{title: 'Logout', keepMenuOpen: false, onItemPress: handleLogout}]//Add All Items Here!!

    return (
        <View style={styles.headerContainer}>
            {accessTokenState && userIdState ? (
                <>
                    <Header
                        backgroundColor={appTheme.colors.themeColor}
                        leftComponent={
                            <TouchableOpacity onPress={toggleModal}>
                                <Image
                                    source={require('../assets/assistent.png')}
                                    style={styles.notifications}
                                />
                                <Badge value={notificationsNumber} status="error" containerStyle={{ position: 'absolute', top: -4, right: 1 }} />
                            </TouchableOpacity>
                        }
                        centerComponent={{
                            text: 'Beast Runner',
                            style: {...styles.title}
                        }}
                        rightComponent={<GenericMenu menuItems={getMenuItems}/>}
                    />
                    <NotificationModal isVisible={isModalVisible} onClose={toggleModal} setNotificationsNumber={setNotificationsNumber}/>
                </>
            ) : (
                <Header
                    backgroundColor={appTheme.colors.themeColor}
                    centerComponent={{
                        text: 'Beast Runner',
                        style: {...styles.title}
                    }}
                />
            )}
        </View>
    );
}
