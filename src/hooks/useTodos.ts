import { useReducer, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo, Filter } from '../types';

const STORAGE_KEY = '@todo_app/todos';

interface State {
  todos: Todo[];
  filter: Filter;
}

type Action =
  | { type: 'LOAD'; todos: Todo[] }
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: string }
  | { type: 'DELETE'; id: string }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'SET_FILTER'; filter: Filter };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD':
      return { ...state, todos: action.todos };

    case 'ADD': {
      const text = action.text.trim();
      if (!text) return state;
      const todo: Todo = {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: Date.now(),
      };
      return { ...state, todos: [todo, ...state.todos] };
    }

    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.id ? { ...t, completed: !t.completed } : t,
        ),
      };

    case 'DELETE':
      return { ...state, todos: state.todos.filter((t) => t.id !== action.id) };

    case 'CLEAR_COMPLETED':
      return { ...state, todos: state.todos.filter((t) => !t.completed) };

    case 'SET_FILTER':
      return { ...state, filter: action.filter };

    default:
      return state;
  }
}

const initialState: State = { todos: [], filter: 'all' };

export function useTodos() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted todos on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          dispatch({ type: 'LOAD', todos: JSON.parse(raw) });
        } catch {
          // ignore corrupt data
        }
      }
    });
  }, []);

  // Debounced save whenever todos change
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
    }, 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state.todos]);

  const filteredTodos = state.todos.filter((t) => {
    if (state.filter === 'active') return !t.completed;
    if (state.filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = state.todos.filter((t) => !t.completed).length;
  const hasCompleted = state.todos.some((t) => t.completed);

  const addTodo = useCallback((text: string) => dispatch({ type: 'ADD', text }), []);
  const toggleTodo = useCallback((id: string) => dispatch({ type: 'TOGGLE', id }), []);
  const deleteTodo = useCallback((id: string) => dispatch({ type: 'DELETE', id }), []);
  const clearCompleted = useCallback(() => dispatch({ type: 'CLEAR_COMPLETED' }), []);
  const setFilter = useCallback((filter: Filter) => dispatch({ type: 'SET_FILTER', filter }), []);

  return {
    todos: filteredTodos,
    filter: state.filter,
    activeCount,
    hasCompleted,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    setFilter,
  };
}
