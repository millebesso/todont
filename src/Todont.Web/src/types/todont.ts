export type TodontItem = {
  id: string;
  description: string;
  avoidUntil: string | null;
  isChecked: boolean;
  isActive: boolean;
  canUncheck: boolean;
  createdAt: string;
};

export type TodontList = {
  id: string;
  name: string;
  items: TodontItem[];
  createdAt: string;
};

export type CreateListRequest = {
  name: string;
};

export type CreateListResponse = {
  id: string;
  name: string;
  url: string;
  createdAt: string;
};

export type CreateItemRequest = {
  description: string;
  avoidUntil?: string;
};

export type UpdateItemRequest = {
  isChecked?: boolean;
  description?: string;
  avoidUntil?: string | null;
};

// This export ensures the module is not empty
export {};
