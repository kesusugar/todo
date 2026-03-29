import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Todo } from '../types';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = memo(function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onToggle(todo.id)} style={styles.checkbox} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <View style={[styles.checkCircle, todo.completed && styles.checkCircleActive]}>
          {todo.completed && <Text style={styles.checkMark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <Text style={[styles.text, todo.completed && styles.textCompleted]} numberOfLines={3}>
        {todo.text}
      </Text>

      <TouchableOpacity
        onPress={() => onDelete(todo.id)}
        style={styles.deleteBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  checkbox: {
    marginRight: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 22,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#AEAEB2',
  },
  deleteBtn: {
    marginLeft: 12,
    padding: 4,
  },
  deleteText: {
    fontSize: 14,
    color: '#AEAEB2',
  },
});
