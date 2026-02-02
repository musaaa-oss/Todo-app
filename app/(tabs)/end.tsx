import { MaterialIcons } from '@expo/vector-icons';
import { FlatList, Text, View } from 'react-native';
import { useTodos } from '../context/TodoContext';

export default function EndScreen() {
  const { completedTodos, tags } = useTodos();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ marginBottom: 14 }}>
        <View style={{ backgroundColor: '#F8F9FA', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="menu" size={22} color="#8B5CF6" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1a1a1a' }}>完了タスク一覧</Text>
            </View>
            <View style={{ backgroundColor: '#8B5CF6', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14 }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>{completedTodos.length} 件</Text>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={completedTodos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 5 }}>
            <Text>{item.tagId ? `[${(tags.find(x => x.id === item.tagId)?.name) ?? ''}] ` : ''}{item.text}</Text>
            <Text style={{ fontSize: 12, color: 'gray' }}>Completed at: {item.completedAt}</Text>
          </View>
        )}
      />
    </View>
  );
}