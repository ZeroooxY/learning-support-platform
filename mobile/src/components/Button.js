
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const Button = ({ title, onPress, type = 'primary', loading = false, style }) => {
    const getButtonStyle = () => {
        switch (type) {
            case 'secondary':
                return styles.secondaryBtn;
            case 'outline':
                return styles.outlineBtn;
            case 'danger':
                return styles.dangerBtn;
            default:
                return styles.primaryBtn;
        }
    };

    const getTextStyle = () => {
        switch (type) {
            case 'secondary':
                return styles.secondaryText;
            case 'outline':
                return styles.outlineText;
            case 'danger':
                return styles.dangerText;
            default:
                return styles.primaryText;
        }
    };

    return (
        <TouchableOpacity
            style={[styles.btn, getButtonStyle(), style, loading && styles.disabled]}
            onPress={onPress}
            disabled={loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={type === 'primary' ? '#fff' : COLORS.primary} />
            ) : (
                <Text style={[styles.text, getTextStyle()]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    btn: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: SIZES.btnRadius,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    disabled: {
        opacity: 0.7,
    },
    text: {
        fontWeight: '600',
        fontSize: 16,
    },
    // Primary
    primaryBtn: {
        backgroundColor: COLORS.primary,
    },
    primaryText: {
        color: '#fff',
    },
    // Secondary
    secondaryBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    secondaryText: {
        color: COLORS.primary,
    },
    // Outline
    outlineBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    outlineText: {
        color: COLORS.text,
    },
    // Danger
    dangerBtn: {
        backgroundColor: COLORS.error,
    },
    dangerText: {
        color: '#fff',
    },
});

export default Button;
