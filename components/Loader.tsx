import React from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {StyleSheet, View, ViewStyle} from 'react-native';
import Theme from "@/appTheme";

type LoaderProps = {
    animating?: boolean; // Whether the loader is animating (default is true)
    size?: 'small' | 'large' | number;
    color?: string;
    style?: ViewStyle;
};

const Loader: React.FC<LoaderProps> = ({
                                           animating = true,
                                           size = 'large',
                                           color = Theme.colors.themeColor, // Default color can be customized here
                                           style,
                                       }) => {
    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator
                animating={animating}
                size={size}
                color={color}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});

export default Loader;

export const defaultLoader = () => {
    return(
        <View style={{ flex: 1 }}>
            <Loader size={70} color={Theme.colors.themeColor} />
        </View>
    );
}
