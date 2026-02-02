import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useTodos } from '../context/TodoContext';

export default function TodayScreen() {
  const { todos, completeTodo, tags, toggleTodo, unmarkToday } = useTodos();
  const [filterTagId, setFilterTagId] = useState<string | null>(null);

  const todayTodos = todos.filter(t => t.today && (!filterTagId || t.tagId === filterTagId));

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ marginBottom: 14 }}>
        <View style={{ backgroundColor: '#F8F9FA', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="check-circle" size={22} color="#10B981" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1a1a1a' }}>今日やること</Text>
            </View>
            <View style={{ backgroundColor: '#10B981', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14 }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>{todayTodos.length} 件</Text>
            </View>
          </View>
        </View>
      </View>

      {tags.length > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ marginRight: 8 }}>フィルター:</Text>
          <TouchableOpacity onPress={() => setFilterTagId(null)} style={{ padding: 6, backgroundColor: filterTagId === null ? '#A5B4FC' : '#F3F4F6', borderRadius: 8, marginRight: 6 }}>
            <Text>すべて</Text>
          </TouchableOpacity>
          {tags.map(t => (
            <TouchableOpacity key={t.id} onPress={() => setFilterTagId(prev => prev === t.id ? null : t.id)} style={{ padding: 6, backgroundColor: filterTagId === t.id ? '#A5B4FC' : '#F3F4F6', borderRadius: 8, marginRight: 6 }}>
              <Text>{t.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={todayTodos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#fff', borderWidth: 1, borderRadius: 6, borderColor: '#e0e0e0', flexDirection: 'row', alignItems: 'center', marginVertical: 6, paddingVertical: 8 }}>
            <TouchableOpacity onPress={() => toggleTodo(item.id)} style={{ flex: 1 }}>
              <Text style={{ textDecorationLine: item.done ? 'line-through' : 'none', marginLeft: 10, fontSize: 14 }}>{item.tagId ? `[${(tags.find(x => x.id === item.tagId)?.name) ?? ''}] ` : ''}{item.text}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => unmarkToday(item.id)} style={{ backgroundColor: '#64748B', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 6, margin: 2, marginRight: 4, minWidth: 68, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 12 }}>戻す</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => completeTodo(item.id)} style={{ backgroundColor: '#10B981', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 6, margin: 2, marginRight: 4, minWidth: 68, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 12 }}>完了</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}