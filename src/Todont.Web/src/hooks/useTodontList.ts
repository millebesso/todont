import { useState, useEffect, useCallback } from 'react';
import type { TodontList } from '../types/todont.js';
import * as api from '../utils/api';

interface UseTodontListResult {
  list: TodontList | null;
  loading: boolean;
  error: string | null;
  addItem: (description: string, avoidUntil?: Date) => Promise<void>;
  toggleItem: (itemId: string, isChecked: boolean) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useTodontList(listId: string | undefined): UseTodontListResult {
  const [list, setList] = useState<TodontList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    if (!listId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await api.getList(listId);
      setList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch list');
      setList(null);
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const addItem = useCallback(
    async (description: string, avoidUntil?: Date) => {
      if (!listId || !list) return;

      try {
        setError(null);
        const newItem = await api.addItem(listId, description, avoidUntil);
        setList((prev) =>
          prev ? { ...prev, items: [...prev.items, newItem] } : null
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add item');
        throw err;
      }
    },
    [listId, list]
  );

  const toggleItem = useCallback(
    async (itemId: string, isChecked: boolean) => {
      if (!listId || !list) return;

      // Optimistic update
      setList((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  isChecked,
                  isActive: isChecked || Boolean(item.avoidUntil && new Date(item.avoidUntil) > new Date()),
                }
              : item
          ),
        };
      });

      try {
        setError(null);
        await api.updateItemStatus(listId, itemId, isChecked);
      } catch (err) {
        // Revert on error
        setError(err instanceof Error ? err.message : 'Failed to update item');
        await fetchList();
      }
    },
    [listId, list, fetchList]
  );

  return {
    list,
    loading,
    error,
    addItem,
    toggleItem,
    refetch: fetchList,
  };
}
