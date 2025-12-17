import { Stack } from 'expo-router';
import { TodoProvider } from './context/TodoContext';

export default function RootLayout() {
  return (
    <TodoProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TodoProvider>
  );
}