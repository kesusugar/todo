import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTodos } from '../hooks/useTodos';
import { TodoItem } from '../components/TodoItem';
import { Filter } from '../types';

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'すべて', value: 'all' },
  { label: '未完了', value: 'active' },
  { label: '完了', value: 'completed' },
];

export default function HomeScreen() {
  const {
    todos,
    filter,
    activeCount,
    hasCompleted,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    setFilter,
  } = useTodos();
  const [inputText, setInputText] = useState('');

  const handleAdd = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    addTodo(text);
    setInputText('');
  }, [inputText, addTodo]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Todos</Text>
          <Text style={styles.count}>{activeCount}件残り</Text>
        </View>

        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[styles.filterTab, filter === f.value && styles.filterTabActive]}
              onPress={() => setFilter(f.value)}
            >
              <Text style={[styles.filterLabel, filter === f.value && styles.filterLabelActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}

          {hasCompleted && (
            <TouchableOpacity onPress={clearCompleted} style={styles.clearBtn}>
              <Text style={styles.clearText}>完了を削除</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Todo list */}
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoItem todo={item} onToggle={toggleTodo} onDelete={deleteTodo} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {filter === 'completed'
                  ? '完了したタスクはありません'
                  : filter === 'active'
                    ? 'すべてのタスクが完了しています！'
                    : 'タスクを追加してください'}
              </Text>
            </View>
          }
          style={styles.list}
          contentContainerStyle={todos.length === 0 ? styles.listEmpty : undefined}
          keyboardShouldPersistTaps="handled"
        />

        {/* Input area */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="新しいタスクを入力..."
            placeholderTextColor="#AEAEB2"
            onSubmitEditing={handleAdd}
            returnKeyType="done"
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.addBtn, !inputText.trim() && styles.addBtnDisabled]}
            onPress={handleAdd}
            disabled={!inputText.trim()}
          >
            <Text style={styles.addBtnText}>追加</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  count: {
    fontSize: 14,
    color: '#8E8E93',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E5E5EA',
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3C3C43',
  },
  filterLabelActive: {
    color: '#FFFFFF',
  },
  clearBtn: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  clearText: {
    fontSize: 13,
    color: '#FF3B30',
  },
  list: {
    flex: 1,
  },
  listEmpty: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 15,
    color: '#AEAEB2',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#1C1C1E',
  },
  addBtn: {
    height: 44,
    paddingHorizontal: 18,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    backgroundColor: '#AEAEB2',
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
