import React, { useState } from 'react';
import { Edit, Trash2, Clock, Check, X } from 'lucide-react';
import TodoForm from './TodoForm';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusToggle = async () => {
    setIsLoading(true);
    await onUpdate(todo._id, { ...todo, status: todo.status === 'pending' ? 'completed' : 'pending' });
    setIsLoading(false);
  };

  const handleEdit = async (formData) => {
    const result = await onUpdate(todo._id, { ...todo, ...formData });
    if (result.success) setIsEditing(false);
    return result;
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

  return (
    <div className={`p-6 rounded-2xl shadow-md transition border-l-4 ${todo.status === 'completed' ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-500'}`}>
      {isEditing ? (
        <>
          <TodoForm
            initialData={todo}
            isEditing={true}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
          />
        </>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className={`text-xl font-bold ${todo.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`mt-2 ${todo.status === 'completed' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {todo.description}
                </p>
              )}
              <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500">
                <span><Clock className="inline w-4 h-4 mr-1" />{formatDate(todo.createdAt)}</span>
                {todo.createdAt !== todo.updatedAt && (
                  <span><Edit className="inline w-4 h-4 mr-1" />{formatDate(todo.updatedAt)}</span>
                )}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${todo.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {todo.status}
            </span>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleStatusToggle}
              disabled={isLoading}
              className={`flex items-center px-4 py-2 rounded-xl font-semibold text-white ${
                todo.status === 'pending' ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'
              }`}
            >
              {isLoading ? 'Updating...' : (
                <>
                  {todo.status === 'pending' ? <Check className="w-4 h-4 mr-2" /> : <X className="w-4 h-4 mr-2" />}
                  {todo.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
                </>
              )}
            </button>
            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-1" />Edit
            </button>
            <button onClick={() => onDelete(todo._id)} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
              <Trash2 className="w-4 h-4 mr-1" />Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
