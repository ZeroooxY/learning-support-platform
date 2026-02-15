
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import api from '../services/api';
import { COLORS, SIZES } from '../constants/theme';
import Button from '../components/Button';
import Card from '../components/Card';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Assuming Expo

const DetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params;

    const [material, setMaterial] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMaterialDetail();
    }, [id]);

    const fetchMaterialDetail = async () => {
        try {
            const response = await api.get(`/materials/${id}`);
            setMaterial(response.data);
        } catch (error) {
            console.error('Error fetching detail:', error);
            Alert.alert('Error', 'Failed to load material details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            "Delete Material",
            "Are you sure you want to delete this material?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/materials/${id}`);
                            navigation.goBack();
                        } catch (error) {
                            console.error('Delete error:', error);
                            Alert.alert('Error', 'Failed to delete material');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!material) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Material not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Detail Card */}
            <Card style={styles.detailCard}>
                <Text style={styles.title}>{material.title}</Text>
                <Text style={styles.subject}>{material.subject}</Text>
                <Text style={styles.content}>{material.content}</Text>

                <View style={styles.actions}>
                    {/* Add Save/Unsave logic if needed, web has SavedCourse page but maybe not explicit button here? 
               Web Detail.jsx doesn't seem to show save button in the snippet I saw earlier (it was dashboard).
               Actually SavedCourse.jsx suggests saving is possible. Let's check if Detail.jsx has save.
               I'll skip save button for now to match exactly what I saw or keep it simple.
           */}
                    <Button
                        title="Delete Material"
                        type="danger"
                        onPress={handleDelete}
                        style={{ marginTop: 20 }}
                    />
                </View>
            </Card>

            {/* Sub Materials */}
            <Text style={styles.sectionTitle}>Sub-Materials</Text>
            {material.subMaterials && material.subMaterials.length > 0 ? (
                material.subMaterials.map((sub, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('SubDetail', { id: material.id, subId: sub.id, title: sub.title })}
                    >
                        <Card style={styles.subCard}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.subTitle}>{sub.title}</Text>
                                    <Text style={styles.subDesc}>{sub.description}</Text>
                                </View>
                                {/* Icon or indicator */}
                                <Text style={{ fontSize: 20, color: COLORS.textLight }}>›</Text>
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.emptyText}>No sub-materials available.</Text>
            )}

            {/* Logic to add sub-material could go here if we want to match full admin capability */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailCard: {
        marginBottom: 24,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    subject: {
        fontSize: 16,
        color: COLORS.primary,
        marginBottom: 16,
        fontWeight: '600',
    },
    content: {
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 24,
    },
    actions: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 16,
    },
    subCard: {
        padding: 16,
        marginBottom: 12,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    subDesc: {
        fontSize: 14,
        color: COLORS.textLight,
    },
    emptyText: {
        color: COLORS.textLight,
        fontStyle: 'italic',
    }
});

export default DetailScreen;
