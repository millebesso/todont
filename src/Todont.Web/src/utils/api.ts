import type {
  TodontList,
  TodontItem,
  CreateListRequest,
  CreateListResponse,
  CreateItemRequest,
  UpdateItemRequest,
} from '../types/todont.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function createList(name: string): Promise<CreateListResponse> {
  const request: CreateListRequest = { name };

  const response = await fetch(`${API_BASE_URL}/api/lists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  return handleResponse<CreateListResponse>(response);
}

export async function getList(id: string): Promise<TodontList> {
  const response = await fetch(`${API_BASE_URL}/api/lists/${id}`);
  return handleResponse<TodontList>(response);
}

export async function addItem(
  listId: string,
  description: string,
  avoidUntil?: Date
): Promise<TodontItem> {
  const request: CreateItemRequest = {
    description,
    ...(avoidUntil && { avoidUntil: avoidUntil.toISOString() }),
  };

  const response = await fetch(`${API_BASE_URL}/api/lists/${listId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  return handleResponse<TodontItem>(response);
}

export async function updateItemStatus(
  listId: string,
  itemId: string,
  isChecked: boolean
): Promise<void> {
  const request: UpdateItemRequest = { isChecked };

  const response = await fetch(
    `${API_BASE_URL}/api/lists/${listId}/items/${itemId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  );

  return handleResponse<void>(response);
}
