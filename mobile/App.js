
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { COLORS } from './src/constants/theme';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import DetailScreen from './src/screens/DetailScreen';
import SubDetailScreen from './src/screens/SubDetailScreen';
import CreateCourseScreen from './src/screens/CreateCourseScreen';
import DeletedMaterialsScreen from './src/screens/DeletedMaterialsScreen';
import SavedCoursesScreen from './src/screens/SavedCoursesScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      {user ? (
        // Authenticated Stack
        <>
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ title: 'Learning Support' }}
          />
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
            options={({ route }) => ({ title: route.params?.title || 'Material Detail' })}
          />
          <Stack.Screen
            name="SubDetail"
            component={SubDetailScreen}
            options={({ route }) => ({ title: route.params?.title || 'Sub Material' })}
          />
          <Stack.Screen
            name="CreateCourse"
            component={CreateCourseScreen}
            options={{ title: 'Create Course' }}
          />
          <Stack.Screen
            name="DeletedMaterials"
            component={DeletedMaterialsScreen}
            options={{ title: 'Deleted Materials' }}
          />
          <Stack.Screen
            name="SavedCourses"
            component={SavedCoursesScreen}
            options={{ title: 'Saved Courses' }}
          />
        </>
      ) : (
        // Auth Stack
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
