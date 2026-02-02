import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs initialRouteName="all">
      <Tabs.Screen
        name="all"
        options={{
          title: '全てのタスク',
          tabBarIcon: ({ color, size }: any) => <MaterialIcons name="assignment" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="today"
        options={{
          title: '今日',
          tabBarIcon: ({ color, size }: any) => <MaterialIcons name="check-circle" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="end"
        options={{
          title: '完了',
          tabBarIcon: ({ color, size }: any) => <MaterialIcons name="menu" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}