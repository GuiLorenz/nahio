import 'react-native-gesture-handler'; 
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
return (

<GestureHandlerRootView style={{ flex: 1 }}>
<AuthProvider>
<StatusBar style="light" backgroundColor="#1A1A1A" />
<AppNavigator />
</AuthProvider>
</GestureHandlerRootView>
);
}