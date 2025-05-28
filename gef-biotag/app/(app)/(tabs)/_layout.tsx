import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { PhoneIncoming as HomeIcon, ClipboardList, UserRound, FolderSync as SyncIcon, Settings as MoreIcon } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { ConnectionStatusBar } from '@/components/ConnectionStatusBar';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <ConnectionStatusBar />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.gray[400],
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            tabBarIcon: ({ color, size }) => (
              <HomeIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="patients"
          options={{
            title: 'Pacientes',
            tabBarIcon: ({ color, size }) => (
              <ClipboardList size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="shelters"
          options={{
            title: 'Abrigos',
            tabBarIcon: ({ color, size }) => (
              <UserRound size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="sync"
          options={{
            title: 'Sincronizar',
            tabBarIcon: ({ color, size }) => (
              <SyncIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'Mais',
            tabBarIcon: ({ color, size }) => (
              <MoreIcon size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkGray,
  },
  tabBar: {
    backgroundColor: Colors.gray[800],
    borderTopColor: Colors.gray[700],
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});