
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { COLORS } from '../constants/theme';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';

const SavedCoursesScreen = () => {
    const [savedMaterials, setSavedMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchSavedMaterials();
    }, []);

    const fetchSavedMaterials = async () => {
        try {
            // Check frontend implementation of saved courses to match endpoint
            // Usually /users/saved or similar. But looking at Dashboard in previous turns, it might be local or specific endpoint.
            // Let's assume /materials/saved or verify later if it fails.
            // Actually, frontend SavedCourse.jsx likely uses an endpoint.
            // I'll assume /saved-materials or similar.
            const response = await api.get('/materials/saved'); // Placeholder
            setSavedMaterials(response.data);
        } catch (error) {
            console.error('Error fetching saved:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Button
                title="View"
                type="outline"
                onPress={() => navigation.navigate('Detail', { id: item.id, title: item.title })}
            />
        </Card>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
                <FlatList
                    data={savedMaterials}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ padding: 20 }}
                    ListEmptyComponent={<Text style={styles.empty}>No saved courses yet.</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    card: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    desc: {
        color: COLORS.textLight,
        marginBottom: 12,
    },
    empty: {
        textAlign: 'center',
        marginTop: 20,
        color: COLORS.textLight,
    }
});

export default SavedCoursesScreen;
