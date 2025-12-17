import { FlatList, Text, View } from 'react-native';
import { useTodos } from '../context/TodoContext';

export default function EndScreen() {
  const { completedTodos } = useTodos();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>完了タスク一覧</Text>
      <FlatList
        data={completedTodos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 5 }}>
            <Text>{item.text}</Text>
            <Text style={{ fontSize: 12, color: 'gray' }}>Completed at: {item.completedAt}</Text>
          </View>
        )}
      />
    </View>
  );
}