import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/business/store';
import SafetyApp from './src/presentation/SafetyApp';
export default function App() { return <Provider store={store}><SafeAreaProvider><SafetyApp /></SafeAreaProvider></Provider>; }
