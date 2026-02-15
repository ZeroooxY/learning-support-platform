
import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigation = useNavigation();

    const handleRegister = async () => {
        if (!username || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        const result = await register({ name: username, email, password });
        setLoading(false);

        if (!result.success) {
            Alert.alert('Registration Failed', JSON.stringify(result.error));
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Register</Text>

                <Input
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Choose a username"
                />

                <Input
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                />

                <Input
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Choose a password"
                    secureTextEntry
                />

                <Button
                    title="Register"
                    onPress={handleRegister}
                    loading={loading}
                    style={styles.registerBtn}
                />

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.link}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        backgroundColor: COLORS.surface,
        padding: 24,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 24,
        textAlign: 'center',
    },
    registerBtn: {
        marginTop: 8,
    },
    footer: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        color: COLORS.textLight,
    },
    link: {
        color: COLORS.primary,
        fontWeight: '600',
    },
});

export default RegisterScreen;
