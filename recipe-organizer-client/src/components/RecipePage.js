// RecipePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/recipes');
        setRecipes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Error fetching recipes. Please try again later.');
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>
            <h2>{recipe.title}</h2>
            <p><strong>Category:</strong> {recipe.category}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
            {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} />}
            <Link to={`/recipes/${recipe.id}`}>View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipePage;

