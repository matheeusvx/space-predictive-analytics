import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MissionProvider } from '@/context/MissionContext';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <MissionProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '900' },
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: 'Configuracoes da Missao', presentation: 'modal' }} />
      </Stack>
    </MissionProvider>
  );
}
