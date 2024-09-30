import { useState } from 'react';

const AddTag = ({ onAddTag }) => {
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#628A62');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tagName) {
      const newTag = { name: tagName, color: tagColor };
      try {
        const token = localStorage.getItem('access_token');
        if (!token || token.split('.').length !== 3) {
          console.error('Invalid token:', token);
          return;
        }

        const res = await fetch('http://127.0.0.1:5000/tags', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Ensure token is sent
          },
          body: JSON.stringify(newTag),
        });

        if (res.ok) {
          const data = await res.json();
          onAddTag(data.tag);
          setTagName('');
          setTagColor('#628A62');
        } else {
          const errorData = await res.json();
          console.error('Failed to add tag:', errorData);
        }
      } catch (error) {
        console.error('Error during tag submission:', error);
      }
    }
  };

  return (
    <div className="p-4 bg-background dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-md mb-2">
      <h3 className="mb-2 font-semibold">Create New Tag</h3>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          className="flex-1 p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-opacity-50"
          placeholder="Tag name"
        />
        <input
          type="color"
          value={tagColor}
          onChange={(e) => setTagColor(e.target.value)}
        />
        <button type="submit" className="p-2 bg-primary dark:bg-primary-dark text-white rounded-md bg-opacity-50">
          Add Tag
        </button>
      </form>
    </div>
  );
};

export default AddTag;