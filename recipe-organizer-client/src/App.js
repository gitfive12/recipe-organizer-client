import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import AddRecipe from './components/AddRecipe';
import Recipes from './components/Recipes';
import RecipePage from './components/RecipePage';
import './App.css'; // Import the CSS file

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    document.body.className = ""; // Reset the class
    const path = location.pathname.replace("/", "");
    if (path) {
      document.body.classList.add(path);
    } else {
      document.body.classList.add("home");
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

  return (
    <div>
      <header>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            {!isAuthenticated && <li><Link to="/signup">Signup</Link></li>}
            {!isAuthenticated && <li><Link to="/login">Login</Link></li>}
            {isAuthenticated && <li><Link to="/recipes">My Recipes</Link></li>}
            {isAuthenticated && <li><Link to="/all-recipes">All Recipes</Link></li>} {/* New link to all recipes */}
            {isAuthenticated && <li><button onClick={handleLogout}>Logout</button></li>}
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <div className="main-content home">
                <h1>Welcome to Recipe Organizer!</h1>
                <p>
                  Do you love to cook, but find yourself drowning in a sea of recipe clippings, handwritten notes, and bookmarked websites? We've all been there. Scrambling to find that perfect dish, only to get lost in a chaotic recipe collection.
                  This is where we come in. We are your one-stop shop for transforming your recipe collection into a streamlined and delicious digital haven. Recipe Organizer is a recipe organizer designed to make your culinary life easier, tastier, and more organized.
                </p>
              </div>
            }
          />
          <Route
            path="/signup"
            element={
              <div className="main-content signup">
                <Signup />
              </div>
            }
          />
          <Route
            path="/login"
            element={
              <div className="main-content login">
                <Login setIsAuthenticated={setIsAuthenticated} />
              </div>
            }
          />
          <Route
            path="/add-recipe"
            element={
              isAuthenticated ? (
                <div className="main-content add-recipe">
                  <AddRecipe />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/recipes"
            element={
              isAuthenticated ? (
                <div className="main-content recipes">
                  <Recipes />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/all-recipes"
            element={
              <div className="main-content recipes">
                <RecipePage />
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
