
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const Card = ({ children, style }) => {
    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: SIZES.borderRadius,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // For Android
        marginBottom: 16,
    },
});

export default Card;
