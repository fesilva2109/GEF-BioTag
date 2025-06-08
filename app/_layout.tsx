import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { UserProvider, UserContext } from '@/contexts/UserContext';
import { DataProvider } from '@/contexts/DataContext';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { 
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold 
} from '@expo-google-fonts/inter';
import React, { useContext } from 'react';


SplashScreen.preventAutoHideAsync();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useContext(UserContext);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoading) {
      if (!user && segments[0] !== '(auth)') {
        router.replace('/(auth)');
      }
      if (user && segments[0] === '(auth)') {
        router.replace('/(app)/(tabs)');
      }
    }
  }, [user, isLoading, segments]);

  if (isLoading) return null;

  return <>{children}</>;
}

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <UserProvider>
      <DataProvider>
        <StatusBar style="light" />
        <AuthGate>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </AuthGate>
      </DataProvider>
    </UserProvider>
  );
}