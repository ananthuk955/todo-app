import React, { useState, useEffect } from 'react';
import { Plus, Save } from 'lucide-react';

const TodoForm = ({ onSubmit, initialData = null, isEditing = false, onCancel = null }) => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    setIsLoading(true);
    const result = await onSubmit(formData);
    if (result.success && !isEditing) {
      setFormData({ title: '', description: '' });
    } else if (!result.success) {
      setError(result.error || 'Failed to save todo');
    }
    setIsLoading(false);
  };

  return (
    <div className={`${isEditing ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200' : 'bg-white'} rounded-2xl p-6 shadow-lg`}>
      {isEditing && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Save className="w-5 h-5 mr-2 text-blue-600" /> Edit Todo
          </h3>
          {onCancel && (
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition">
              Cancel
            </button>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-700">Title *</label>
          <input
            name="title"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
            placeholder="What needs to be done?"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
            placeholder="Add more details..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : (
              <>
                {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {isEditing ? 'Update Todo' : 'Create Todo'}
              </>
            )}
          </button>

          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TodoForm;
