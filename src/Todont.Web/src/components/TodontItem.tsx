import { useState } from 'react';
import type { TodontItem as TodontItemType } from '../types/todont.js';

interface TodontItemProps {
  item: TodontItemType;
  onToggle: (itemId: string, isChecked: boolean) => void;
  onUpdate: (itemId: string, description: string, avoidUntil: Date | null) => void;
  onDelete: (itemId: string) => void;
}

export function TodontItem({ item, onToggle, onUpdate, onDelete }: TodontItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(item.description);
  const [editAvoidUntil, setEditAvoidUntil] = useState(
    item.avoidUntil ? item.avoidUntil.split('T')[0] : ''
  );

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(item.id, e.target.checked);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleEdit = () => {
    setEditDescription(item.description);
    setEditAvoidUntil(item.avoidUntil ? item.avoidUntil.split('T')[0] : '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditDescription(item.description);
    setEditAvoidUntil(item.avoidUntil ? item.avoidUntil.split('T')[0] : '');
  };

  const handleSave = () => {
    if (!editDescription.trim()) return;
    const avoidUntilDate = editAvoidUntil ? new Date(editAvoidUntil + 'T00:00:00') : null;
    onUpdate(item.id, editDescription.trim(), avoidUntilDate);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(item.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Disable checkbox if item is checked and can't be unchecked yet
  const isDisabled = item.isChecked && !item.canUncheck;

  if (isEditing) {
    return (
      <div className="flex items-center gap-3 py-2 px-3 rounded bg-gray-50">
        <input
          type="checkbox"
          checked={item.isChecked}
          disabled
          className="w-5 h-5 accent-blue-600 opacity-50"
        />
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <input
            type="date"
            value={editAvoidUntil}
            onChange={(e) => setEditAvoidUntil(e.target.value)}
            onKeyDown={handleKeyDown}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={!editDescription.trim()}
          className="p-1 text-green-600 hover:text-green-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          title="Save"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={handleCancel}
          className="p-1 text-gray-500 hover:text-gray-700"
          title="Cancel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 py-2 px-3 rounded group hover:bg-gray-50 ${
        item.isActive ? 'text-gray-900' : 'text-gray-400 italic'
      }`}
    >
      <input
        type="checkbox"
        checked={item.isChecked}
        onChange={handleCheckboxChange}
        disabled={isDisabled}
        className={`w-5 h-5 accent-blue-600 ${
          isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
      />
      <div className="flex-1">
        <span className={item.isActive ? 'font-normal' : 'font-light'}>
          {item.description}
        </span>
        {item.avoidUntil && (
          <span className="ml-2 text-sm text-gray-500">
            (avoid until {formatDate(item.avoidUntil)})
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEdit}
          className="p-1 text-gray-400 hover:text-blue-600"
          title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          className="p-1 text-gray-400 hover:text-red-600"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
