
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Alert } from 'react-native';
import api from '../services/api';
import { COLORS } from '../constants/theme';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';

const CreateCourseScreen = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [subject, setSubject] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    const handleCreate = async () => {
        if (!title || !description || !content || !subject) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await api.post('/materials', {
                title,
                description,
                content,
                subject,
                type: 'MATERIAL'
            });
            Alert.alert('Success', 'Course created successfully');
            navigation.goBack();
        } catch (error) {
            console.error('Create error:', error);
            Alert.alert('Error', 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.headerTitle}>Create New Course</Text>

            <Input
                label="Title"
                value={title}
                onChangeText={setTitle}
                placeholder="Course Title"
            />

            <Input
                label="Subject"
                value={subject}
                onChangeText={setSubject}
                placeholder="e.g. Mathematics"
            />

            <Input
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="Short description"
                style={{ height: 100 }} // Multiline check needed in Input component ideally, but basic works
            />

            <Input
                label="Content"
                value={content}
                onChangeText={setContent}
                placeholder="Course content..."
            // In real app, might want a richer editor or bigger input
            />

            <Button
                title="Create Course"
                onPress={handleCreate}
                loading={loading}
                style={{ marginTop: 20 }}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 24,
    },
});

export default CreateCourseScreen;
