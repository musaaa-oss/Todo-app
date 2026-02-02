import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTodos } from '../context/TodoContext';

export default function AllScreen() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo, markToday, tags, addTag, deleteTag } = useTodos();
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [filterTagId, setFilterTagId] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isTagInputFocused, setIsTagInputFocused] = useState(false);

  const handleAddOrUpdate = () => {
    if (!input.trim()) return;
    if (editingId) {
      updateTodo(editingId, input, selectedTagId ?? undefined);
      setEditingId(null);
    } else {
      addTodo(input, false, selectedTagId ?? undefined);
    }
    setInput('');
    setSelectedTagId(null);
  };

  const handleAddRoutine = () => {
    if (!input.trim()) return;
    addTodo(input, true, selectedTagId ?? undefined);
    setInput('');
  };

  const handleSaveTag = () => {
    if (!tagInput.trim()) return;
    const id = addTag(tagInput);
    if (id) setSelectedTagId(id);
    setTagInput('');
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ marginBottom: 14 }}>
        <View style={{ backgroundColor: '#F8F9FA', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="assignment" size={22} color="#6366F1" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#1a1a1a' }}>全てのタスク</Text>
            </View>
            <View style={{ backgroundColor: '#6366F1', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14 }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>{todos.length} 件</Text>
            </View>
          </View>
        </View>
      </View>

      <TextInput
        value={input}
        onChangeText={setInput}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        placeholder="やることを入力"
        style={{ borderColor: isInputFocused ? '#4F46E5' : '#A5B4FC', backgroundColor: "#F9FAFF", borderWidth: 2, padding: 10, marginBottom: 10, borderRadius: 8 }}
      />

      <View style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'center' }}>
        <TextInput
          value={tagInput}
          onChangeText={setTagInput}
          onFocus={() => setIsTagInputFocused(true)}
          onBlur={() => setIsTagInputFocused(false)}
          placeholder="タグ名を入力して保存"
          style={{ borderColor: isTagInputFocused ? '#4F46E5' : '#E5E7EB', backgroundColor: '#fff', borderWidth: 1, padding: 6, borderRadius: 5, flex: 1, marginRight: 8 }}
        />
        <TouchableOpacity onPress={handleSaveTag} style={{ backgroundColor: '#8B5CF6', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, width: 90, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 12 }}>新規タグ</Text>
        </TouchableOpacity>
      </View>

      {tags.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
          {tags.map(t => (
            <View key={t.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: selectedTagId === t.id ? '#A5B4FC' : '#F3F4F6', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, marginRight: 6, marginBottom: 6 }}>
              <TouchableOpacity onPress={() => setSelectedTagId(t.id)} style={{ paddingRight: 6 }}>
                <Text>{t.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { deleteTag(t.id); if (selectedTagId === t.id) setSelectedTagId(null); }} style={{ paddingLeft: 4 }}>
                <MaterialIcons name="close" size={14} color="#555" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 8 }}>
        <TouchableOpacity onPress={handleAddOrUpdate} style={{ backgroundColor: '#10B981', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, width: 130, alignItems: 'center', marginRight: 8 }}>
          <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center' }}>{editingId ? 'Todo編集' : 'Todo追加'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddRoutine} style={{ backgroundColor: '#3B82F6', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, width: 130, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 13 }}>日課の追加</Text>
        </TouchableOpacity>
      </View>

      {tags.length > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ marginRight: 8, fontSize: 14 }}>フィルター:</Text>
          <TouchableOpacity onPress={() => setFilterTagId(null)} style={{ padding: 6, backgroundColor: filterTagId === null ? '#A5B4FC' : '#F3F4F6', borderRadius: 8, marginRight: 6 }}>
            <Text style={{ fontSize: 14 }}>すべて</Text>
          </TouchableOpacity>
          {tags.map(t => (
            <TouchableOpacity key={t.id} onPress={() => setFilterTagId(prev => prev === t.id ? null : t.id)} style={{ padding: 6, backgroundColor: filterTagId === t.id ? '#A5B4FC' : '#F3F4F6', borderRadius: 8, marginRight: 6 }}>
              <Text style={{ fontSize: 14 }}>{t.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      


      <FlatList
        data={todos.filter(t => !filterTagId || t.tagId === filterTagId)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#fff', borderWidth: 1, borderRadius: 6, borderColor: '#e0e0e0', flexDirection: 'row', alignItems: 'center', marginVertical: 6, paddingVertical: 8 }}>
            <TouchableOpacity onPress={() => toggleTodo(item.id)} style={{ flex: 1 }}>
              <Text style={{ textDecorationLine: item.done ? 'line-through' : 'none' , marginLeft: 10, fontSize: 14 }}>
                {item.tagId ? `[${(tags.find(x => x.id === item.tagId)?.name) ?? ''}] ` : ''}{item.text}
              </Text>
            </TouchableOpacity>
             <TouchableOpacity onPress={() => markToday(item.id)} style={{ backgroundColor: '#10B981', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 6, margin: 2, marginRight: 4, minWidth: 52, alignItems: 'center', justifyContent: 'center' }}>
               <Text style={{ color: '#fff', fontSize: 12 }}>今日</Text>
             </TouchableOpacity>

             <TouchableOpacity onPress={() => { setEditingId(item.id); setInput(item.text); setSelectedTagId(item.tagId ?? null); }} style={{ backgroundColor: '#3B82F6', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 6, margin: 2, marginRight: 4, minWidth: 52, alignItems: 'center', justifyContent: 'center' }}>
               <Text style={{ color: '#fff', fontSize: 12 }}>編集</Text>
             </TouchableOpacity>

             <TouchableOpacity onPress={() => deleteTodo(item.id)} style={{ backgroundColor: '#DC2626', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 6, margin: 2, marginRight: 4, minWidth: 44, alignItems: 'center', justifyContent: 'center' }}>
               <MaterialIcons name="delete" size={16} color="#fff" />
             </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}