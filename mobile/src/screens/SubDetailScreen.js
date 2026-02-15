
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Linking } from 'react-native';
import api from '../services/api';
import { COLORS } from '../constants/theme';
import Button from '../components/Button';
import Card from '../components/Card';
import { useRoute } from '@react-navigation/native';

const SubDetailScreen = () => {
    const route = useRoute();
    const { id, subId } = route.params; // Main ID and Sub ID

    const [subMaterial, setSubMaterial] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubDetail();
    }, [id, subId]);

    const fetchSubDetail = async () => {
        try {
            // Assuming existing backend has an endpoint for specific submaterial or we fetch main and find sub.
            // Based on typical REST, maybe /materials/:id/sub/:subId or just filtering from main.
            // Let's try fetching main and filtering for now if no specific endpoint is known from snippet.
            // Wait, snippet for backend showed materialRoutes.
            // I'll assume we might need to filter.
            const response = await api.get(`/materials/${id}`);
            const mainMaterial = response.data;
            const sub = mainMaterial.subMaterials.find(s => s.id === subId || s._id === subId);
            setSubMaterial(sub);
        } catch (error) {
            console.error('Error fetching sub-detail:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!subMaterial) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Sub-material not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Card>
                <Text style={styles.title}>{subMaterial.title}</Text>
                <Text style={styles.desc}>{subMaterial.description}</Text>
                <View style={styles.divider} />
                <Text style={styles.content}>{subMaterial.content}</Text>

                {subMaterial.pdfUrl && (
                    <Button
                        title="Download/View PDF"
                        onPress={() => Linking.openURL(subMaterial.pdfUrl)}
                        style={{ marginTop: 24 }}
                    />
                )}
            </Card>
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
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    desc: {
        fontSize: 16,
        color: COLORS.textLight,
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginBottom: 16,
    },
    content: {
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 24,
    },
});

export default SubDetailScreen;
