import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs initialRouteName="all">
      <Tabs.Screen name="all" options={{ title: 'ALL Todos' }} />
      <Tabs.Screen name="today" options={{ title: 'TODAY' }} />
      <Tabs.Screen name="end" options={{ title: 'Completed' }} />
    </Tabs>
  );
}