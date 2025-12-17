import { useState } from 'react';
import { Button, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTodos } from '../context/TodoContext';

export default function AllScreen() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodo, markToday } = useTodos();
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddOrUpdate = () => {
    if (!input.trim()) return;
    if (editingId) {
      updateTodo(editingId, input);
      setEditingId(null);
    } else {
      addTodo(input);
    }
    setInput('');
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>全てのタスク</Text>

      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Enter todo"
        style={{ borderWidth: 2, padding: 8, marginBottom: 10, borderRadius: 5 }}
      />
      
       <View style={{borderWidth: 1, borderColor: '#fff', borderRadius: 5, marginVertical: 10, width: 130, alignSelf: 'center', backgroundColor: 'lightgreen' }}>
        <Button title={editingId ? "Todo編集" : "Todo追加"} onPress={handleAddOrUpdate} color="#fff"/>
      </View>


      <FlatList
        data={todos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{borderWidth: 1,borderRadius: 5, borderColor: '#13d723f2', flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
            <TouchableOpacity onPress={() => toggleTodo(item.id)} style={{ flex: 1 }}>
              <Text style={{ textDecorationLine: item.done ? 'line-through' : 'none' , marginLeft: 10, fontSize: 16 }}>
                {item.text}
              </Text>
            </TouchableOpacity>
             <View style={{ borderWidth: 1,borderColor: '#13d723f2',borderRadius:50,margin:2, marginRight: 5 }}>
              <Button title="編集" onPress={() => { setEditingId(item.id); setInput(item.text); }} />
             </View>

             <View style={{ borderWidth: 1,borderColor: '#13d723f2',borderRadius:50,margin:2, marginRight: 5}}>
              <Button title="削除" onPress={() => deleteTodo(item.id)} />
              </View>

             <View style={{ borderWidth: 1,borderColor: '#13d723f2',borderRadius:50,margin:2, marginRight: 5}}>
             <Button title="今日" onPress={() => markToday(item.id)} />
              </View>
          </View>
        )}
      />
    </View>
  );
}