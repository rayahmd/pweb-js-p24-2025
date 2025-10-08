// Ambil list resep
async function getRecipes(limit = 10, skip = 0) {
  const res = await fetch(`https://dummyjson.com/recipes?limit=${limit}&skip=${skip}`);
  return await res.json();
}

// Ambil detail resep
async function getRecipeById(id) {
  const res = await fetch(`https://dummyjson.com/recipes/${id}`);
  return await res.json();
}

module.exports = { getRecipes, getRecipeById };
