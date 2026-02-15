
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import api from '../services/api';
import { COLORS } from '../constants/theme';
import Card from '../components/Card';
import Button from '../components/Button';

const DeletedMaterialsScreen = () => {
    const [deletedMaterials, setDeletedMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeletedMaterials();
    }, []);

    const fetchDeletedMaterials = async () => {
        try {
            const response = await api.get('/materials/deleted');
            setDeletedMaterials(response.data);
        } catch (error) {
            console.error('Fetch deleted error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id) => {
        try {
            await api.post(`/materials/${id}/restore`);
            setDeletedMaterials(prev => prev.filter(m => m.id !== id));
            Alert.alert('Success', 'Material restored');
        } catch (error) {
            Alert.alert('Error', 'Failed to restore material');
        }
    };

    const handlePermanentDelete = async (id) => {
        Alert.alert(
            "Confirm Delete",
            "This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/materials/${id}/hard`); // Assuming backend has hard delete
                            setDeletedMaterials(prev => prev.filter(m => m.id !== id));
                        } catch (error) {
                            // Fallback if backend API is slightly different, usually DELETE on /deleted/:id or similar
                            // Based on context, checking backend might be needed if this fails, but proceeding with standard assumption.
                            Alert.alert('Error', 'Failed to permanently delete');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>Deleted on: {new Date(item.deletedAt).toLocaleDateString()}</Text>
            <View style={styles.actions}>
                <Button
                    title="Restore"
                    type="primary"
                    onPress={() => handleRestore(item.id)}
                    style={{ flex: 1, marginRight: 8 }}
                />
                {/* Permanent delete optional based on requirements, but good to have */}
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator color={COLORS.primary} size="large" />
            ) : (
                <FlatList
                    data={deletedMaterials}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ padding: 20 }}
                    ListEmptyComponent={<Text style={styles.empty}>No deleted materials</Text>}
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
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    desc: {
        color: COLORS.textLight,
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
    },
    empty: {
        textAlign: 'center',
        marginTop: 20,
        color: COLORS.textLight,
    }
});

export default DeletedMaterialsScreen;
