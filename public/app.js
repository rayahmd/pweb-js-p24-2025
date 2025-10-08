let allRecipes = [];

async function fetchRecipes() {
  try {
    const res = await fetch("/api/recipes");
    const data = await res.json();
    allRecipes = data.recipes;
    renderRecipes(allRecipes);
  } catch (err) {
    console.error("Error fetching recipes", err);
  }
}

function renderRecipes(recipes) {
  const modal = document.getElementById("recipe-modal");
  const closeBtn = document.querySelector(".close");

  const grid = document.querySelector(".recipe-grid");
  grid.innerHTML = "";

  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.name}">
      <div class="recipe-info">
        <h3>${recipe.name}</h3>
        <div class="recipe-meta">
          <span>⏱ ${recipe.prepTimeMinutes ?? 0} mins</span>
          <span>${recipe.difficulty ?? "N/A"}</span>
          <span>${recipe.cuisine ?? "Unknown"}</span>
        </div>
        <p><strong>Ingredients:</strong> ${recipe.ingredients?.slice(0, 4).join(", ")}...</p>
        <div class="rating">⭐ ${recipe.rating ?? "N/A"}</div>
        <button class="view-btn" data-id="${recipe.id}">VIEW FULL RECIPE</button>
      </div>
    `;
    grid.appendChild(card);
  });

  document.querySelector(".page-info").textContent =
    `Showing ${recipes.length} recipes`;

  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.id));
  });
}

async function openModal(id) {
  const res = await fetch(`/api/recipes/${id}`);
  const recipe = await res.json();

  document.getElementById("modal-title").textContent = recipe.name;
  document.getElementById("modal-image").src = recipe.image;
  document.getElementById("modal-prep-time").textContent = `${recipe.prepTimeMinutes} mins`;
  document.getElementById("modal-cook-time").textContent = `${recipe.cookTimeMinutes} mins`;
  document.getElementById("modal-servings").textContent = recipe.servings;
  document.getElementById("modal-difficulty").textContent = recipe.difficulty;
  document.getElementById("modal-cuisine").textContent = recipe.cuisine;
  document.getElementById("modal-calories").textContent = `${recipe.caloriesPerServing} cal/serving`;

  const ul = document.getElementById("modal-ingredients");
  ul.innerHTML = "";
  recipe.ingredients.forEach(ing => {
    const li = document.createElement("li");
    li.textContent = ing;
    ul.appendChild(li);
  });

  const ol = document.getElementById("modal-instructions");
  ol.innerHTML = "";
  recipe.instructions.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    ol.appendChild(li);
  });

  document.getElementById("recipe-modal").style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  fetchRecipes();

  document.querySelector(".close").addEventListener("click", () => {
    document.getElementById("recipe-modal").style.display = "none";
  });
});
