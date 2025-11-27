import type { TodontItem as TodontItemType } from '../types/todont.js';

interface TodontItemProps {
  item: TodontItemType;
  onToggle: (itemId: string, isChecked: boolean) => void;
}

export function TodontItem({ item, onToggle }: TodontItemProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(item.id, e.target.checked);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div
      className={`flex items-center gap-3 py-2 px-3 rounded ${
        item.isActive ? 'text-gray-900' : 'text-gray-400 italic'
      }`}
    >
      <input
        type="checkbox"
        checked={item.isChecked}
        onChange={handleCheckboxChange}
        className="w-5 h-5 accent-blue-600 cursor-pointer"
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
    </div>
  );
}
