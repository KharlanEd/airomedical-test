'use client'
import useRecipeStore from '@/app/store';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

import styled from '../app/style/recipeList.module.css';

const RecipeList = () => {
  const recipes = useRecipeStore((state) => state.recipes);
  const selectedRecipes = useRecipeStore((state) => state.selectedRecipes);
  const visibleRecipes = useRecipeStore((state) => state.visibleRecipes);
  const addRecipe = useRecipeStore((state) => state.addRecipe);
  const removeRecipe = useRecipeStore((state) => state.removeRecipe);
  const toggleRecipeSelection = useRecipeStore((state) => state.toggleRecipeSelection);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('https://api.punkapi.com/v2/beers?page=1');
        const data = await response.json();
        addRecipe(data);
      } catch (error) {
        console.error('Ошибка при загрузке рецептов', error);
      }
    };

    fetchRecipes();
  }, [addRecipe]);

  

  const handleRecipeContextMenu = (recipeId, e) => {
    e.preventDefault();
    toggleRecipeSelection(recipeId);
  };

  const handleDeleteSelected = () => {
    selectedRecipes.forEach((recipeId) => {
      removeRecipe(recipeId);
    });
  };

  const handleLoadMoreRecipes = async () => {
    try {
      const response = await fetch('https://api.punkapi.com/v2/beers?page=2&per_page=25');
      const data = await response.json();
      addRecipe(data);
    } catch (error) {
      console.error('Ошибка при загрузке дополнительных рецептов', error);
    }
  };

  return (
    <div>
      {selectedRecipes.length > 0 && (
        <button onClick={handleDeleteSelected}>Удалить выбранные</button>
      )}
      <ul className={styled.container}>
        {visibleRecipes.map((recipe) => (
          <li
            className={styled.card}
            key={recipe.id}
            onContextMenu={(e) => handleRecipeContextMenu(recipe.id, e)}
          >
            <Link className={styled.link} href={`/recipe/${recipe.id}`}>
              <h3>{recipe.name}</h3>
              <p>{recipe.tagline}</p>
              <Image src={recipe.image_url} alt={recipe.name} width={50} height={50} />
              {selectedRecipes.includes(recipe.id) && (
                <span className={styled.selected}>Выбрано</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {recipes.length > visibleRecipes.length && (
        <button onClick={handleLoadMoreRecipes}>Загрузить еще рецепты</button>
      )}
    </div>
  );
};

export default RecipeList;
