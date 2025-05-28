import { Tabs } from 'expo-router';
import { useColorScheme, Platform } from 'react-native';
import { Chrome as Home, ClipboardList, Plus, Heart, Menu } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import ConnectionStatusBar from '@/components/ConnectionStatusBar';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <View style={styles.container}>
      <ConnectionStatusBar />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: '#888888',
          tabBarStyle: {
            backgroundColor: '#2A2A2A',
            borderTopColor: '#3A3A3A',
            height: 60,
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            paddingTop: 5,
          },
          tabBarLabelStyle: {
            fontFamily: 'Poppins-Regular',
            fontSize: 12,
          },
          headerStyle: {
            backgroundColor: '#424242',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="register"
          options={{
            title: 'Registrar',
            tabBarIcon: ({ color, size }) => <Plus size={size} color={color} />,
            headerTitle: 'Registrar Vítima',
          }}
        />
        <Tabs.Screen
          name="victims"
          options={{
            title: 'Vítimas',
            tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
            headerTitle: 'Lista de Vítimas',
          }}
        />
        <Tabs.Screen
          name="monitoring"
          options={{
            title: 'Vitais',
            tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
            headerTitle: 'Monitoramento Vital',
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'Mais',
            tabBarIcon: ({ color, size }) => <Menu size={size} color={color} />,
            headerTitle: 'Mais Opções',
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#424242',
  },
});