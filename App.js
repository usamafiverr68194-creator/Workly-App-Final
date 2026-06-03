import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './src/screens/LoginScreen';
import AdminDashboard from './src/screens/AdminDashboard';
import WorkerHome from './src/screens/WorkerHome';
import { AuthProvider } from './src/context/AuthContext';
import { DataProvider } from './src/context/DataContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#8892b0',
      }}>
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboard}
        options={{ tabBarLabel: '🏠 Dashboard' }}
      />
      <Tab.Screen
        name="Users"
        component={AdminDashboard}
        options={{ tabBarLabel: '👥 Users' }}
      />
      <Tab.Screen
        name="Jobs"
        component={AdminDashboard}
        options={{ tabBarLabel: '📋 Jobs' }}
      />
      <Tab.Screen
        name="Reports"
        component={AdminDashboard}
        options={{ tabBarLabel: '📊 Reports' }}
      />
    </Tab.Navigator>
  );
}

function WorkerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#8892b0',
      }}>
      <Tab.Screen
        name="Home"
        component={WorkerHome}
        options={{ tabBarLabel: '🏠 Home' }}
      />
      <Tab.Screen
        name="Jobs"
        component={WorkerHome}
        options={{ tabBarLabel: '💼 Jobs' }}
      />
      <Tab.Screen
        name="Chat"
        component={WorkerHome}
        options={{ tabBarLabel: '💬 Chat' }}
      />
      <Tab.Screen
        name="Profile"
        component={WorkerHome}
        options={{ tabBarLabel: '👤 Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="AdminTabs" component={AdminTabs} />
            <Stack.Screen name="WorkerTabs" component={WorkerTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </DataProvider>
  );
}
