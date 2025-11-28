import { Stack } from 'expo-router';
import { AuthProvider, AlertProvider } from '@/template';

export default function RootLayout() {
  return (
    <AlertProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="lobby" />
          <Stack.Screen name="game" />
        </Stack>
      </AuthProvider>
    </AlertProvider>
  );
}
