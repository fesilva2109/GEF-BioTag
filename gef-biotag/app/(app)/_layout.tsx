import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="patient/register" options={{ headerShown: false }} />
      <Stack.Screen name="patient/details" options={{ headerShown: false }} />
      <Stack.Screen name="patient/edit" options={{ headerShown: false }} />
    </Stack>
  );
}