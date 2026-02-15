
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Assuming Expo, or use react-native-vector-icons

import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SIZES } from '../constants/theme';
import Input from '../components/Input';
import Card from '../components/Card';
import Button from '../components/Button';

const DashboardScreen = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const { user, logout } = useContext(AuthContext);
    const navigation = useNavigation();

    const fetchMaterials = async () => {
        try {
            const query = search ? `?search=${search}` : '';
            const response = await api.get(`/materials${query}`);
            setMaterials(response.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchMaterials();
        }, [search])
    );

    useEffect(() => {
        // Set header options
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={logout} style={{ marginRight: 16 }}>
                    <Text style={{ color: COLORS.error, fontWeight: '600' }}>Logout</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchMaterials();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Detail', { id: item.id, title: item.title })}
        >
            <Card style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc} numberOfLines={3}>{item.description}</Text>
                <Text style={styles.spec} numberOfLines={1}>{item.subject} • {item.type}</Text>
                <Button
                    title="Read More"
                    type="outline"
                    onPress={() => navigation.navigate('Detail', { id: item.id, title: item.title })}
                    style={{ marginTop: 12, paddingVertical: 8, minHeight: 36 }}
                />
            </Card>
        </TouchableOpacity>
    );

    const isAdmin = user?.role === 'admin' || user?.userRole === 'admin'; // Check both structures just in case

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcome}>Welcome, {user?.username}!</Text>
                {/* Navigation Buttons */}
                <View style={styles.navButtons}>
                    <Button
                        title="Saved"
                        type="secondary"
                        onPress={() => navigation.navigate('SavedCourses')}
                        style={styles.navBtn}
                    />
                    {isAdmin && (
                        <Button
                            title="Deleted"
                            type="secondary"
                            onPress={() => navigation.navigate('DeletedMaterials')}
                            style={styles.navBtn}
                        />
                    )}
                </View>
            </View>

            <View style={styles.searchContainer}>
                <Input
                    placeholder="Search materials..."
                    value={search}
                    onChangeText={setSearch}
                    style={{ marginBottom: 0 }}
                />
            </View>

            {loading && !refreshing ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={materials}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No materials found.</Text>
                    }
                />
            )}

            {isAdmin && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('CreateCourse')}
                >
                    <Text style={styles.fabText}>+</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        padding: 20,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    welcome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
    },
    navButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    navBtn: {
        flex: 1,
        paddingVertical: 8,
        minHeight: 36,
    },
    searchContainer: {
        padding: 20,
        paddingBottom: 0,
    },
    listContent: {
        padding: 20,
    },
    card: {
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    cardDesc: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 12,
    },
    spec: {
        fontSize: 12,
        color: COLORS.textLight,
        fontStyle: 'italic',
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.textLight,
        marginTop: 20,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary, // Green like web? Web uses #10b981
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    fabText: {
        fontSize: 32,
        color: '#fff',
        marginTop: -4,
    },
});

export default DashboardScreen;
