import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      axios.get(`http://localhost:3001/api/recipes?userId=${userId}`)
        .then(response => {
          setRecipes(response.data);
        })
        .catch(error => {
          console.error('Error fetching recipes:', error);
          setError('Error fetching recipes. Please try again later.');
        });
    }
  }, [userId, navigate]);

  const handleDelete = (recipeId) => {
    axios.delete(`http://localhost:3001/api/recipes/${recipeId}`)
      .then(() => {
        setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      })
      .catch(error => {
        console.error('Error deleting recipe:', error);
        setError('Error deleting recipe. Please try again later.');
      });
  };

  return (
    <div>
      <h2>My Recipes</h2>
      <Link to="/add-recipe">Add New Recipe</Link>
      {error && <p>{error}</p>}
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>
            <h3>{recipe.title}</h3>
            <p>{recipe.instructions}</p>
            <Link to={`/recipes/${recipe.id}`}>View Details</Link>
            <button onClick={() => handleDelete(recipe.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recipes;


