// RecipeDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/recipes/${id}`);
        setRecipe(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError('Error fetching recipe');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <div>
      <h1>{recipe.title}</h1>
      <p>{recipe.instructions}</p>
      <p>Category: {recipe.category}</p>
      {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} />}
    </div>
  );
};

export default RecipeDetails;

