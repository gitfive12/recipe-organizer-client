import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddRecipe() {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/api/add-recipe', { userId, title, instructions, category, imageUrl })
      .then(() => {
        navigate('/recipes');
      })
      .catch(error => {
        console.error('There was an error adding the recipe!', error);
      });
  };

  return (
    <div>
      <h2>Add Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Instructions</label>
          <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} required></textarea>
        </div>
        <div>
          <label>Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div>
          <label>Image URL</label>
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
}

export default AddRecipe;


