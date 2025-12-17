import { Button, FlatList, Text, View } from 'react-native';
import { useTodos } from '../context/TodoContext';

export default function TodayScreen() {
  const { todos, completeTodo } = useTodos();
  const todayTodos = todos.filter(t => t.today);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>今日やること</Text>
      <FlatList
        data={todayTodos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
            <Text style={{ flex: 1 }}>{item.text}</Text>
            <Button title="Complete" onPress={() => completeTodo(item.id)} />
          </View>
        )}
      />
    </View>
  );
}