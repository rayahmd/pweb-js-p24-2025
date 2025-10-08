const recipeGrid = document.querySelector(".recipe-grid");
const pageInfo = document.querySelector(".page-info");
const showMoreBtn = document.querySelector(".show-more-btn");
const searchInput = document.querySelector(".search-input");
const filterSelect = document.querySelector(".filter-select");
const darkmodeBtn = document.querySelector(".darkmode-btn");

const modal = document.getElementById("recipe-modal");
const closeBtn = document.querySelector(".close");

// elemen modal
const modalTitle = document.getElementById("modal-title");
const modalImage = document.getElementById("modal-image");
const modalPrepTime = document.getElementById("modal-prep-time");
const modalCookTime = document.getElementById("modal-cook-time");
const modalServings = document.getElementById("modal-servings");
const modalDifficulty = document.getElementById("modal-difficulty");
const modalCuisine = document.getElementById("modal-cuisine");
const modalCalories = document.getElementById("modal-calories");
const modalRatingStars = document.getElementById("modal-rating-stars");
const modalRatingText = document.getElementById("modal-rating-text");
const modalReviewCount = document.getElementById("modal-review-count");
const modalTags = document.getElementById("modal-tags");
const modalIngredients = document.getElementById("modal-ingredients");
const modalInstructions = document.getElementById("modal-instructions");

// state
let recipes = [];
let limit = 12;
let skip = 0;
let total = 0;
let currentCuisine = "all";

// === DARK MODE TOGGLE ===
darkmodeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    darkmodeBtn.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    darkmodeBtn.innerHTML = `<span class="material-symbols-outlined">dark_mode</span>`;
    localStorage.setItem("theme", "light");
  }
});

// cek preference tersimpan
window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    darkmodeBtn.textContent = "☀️";
  }
});

// === FETCH RECIPES ===
async function fetchRecipes() {
  let url = `https://dummyjson.com/recipes?limit=${limit}&skip=${skip}`;
  const res = await fetch(url);
  const data = await res.json();
  recipes = [...recipes, ...data.recipes];
  total = data.total;
  renderRecipes();

  // sembunyikan tombol jika semua sudah ditampilkan
  if (recipes.length >= total) {
    showMoreBtn.style.display = "none";
  } else {
    showMoreBtn.style.display = "flex";
    showMoreBtn.style.margin = "20px auto";
  }
}

// === RENDER RECIPES ===
function renderRecipes(list = recipes) {
  recipeGrid.innerHTML = "";

  const filtered = currentCuisine === "all"
    ? list
    : list.filter(r => r.cuisine.toLowerCase() === currentCuisine.toLowerCase());

  if (filtered.length === 0) {
    recipeGrid.innerHTML = `<p class="not-found">No recipes found 🍳</p>`;
    pageInfo.textContent = `Showing 0 of ${total} recipes`;
    return;
  }

  filtered.forEach(recipe => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.name}">
      <div class="recipe-info">
        <h3>${recipe.name}</h3>
        <div class="recipe-meta">
          <span>⏱ ${recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins</span>
          <span>${recipe.difficulty}</span>
          <span>${recipe.cuisine}</span>
        </div>
        <p><strong>Ingredients:</strong> ${recipe.ingredients.slice(0,3).join(", ")} +${Math.max(0, recipe.ingredients.length-3)} more</p>
        <div class="rating">⭐⭐⭐⭐⭐ (${recipe.rating})</div>
        <button class="view-btn" data-id="${recipe.id}">VIEW FULL RECIPE</button>
      </div>
    `;
    recipeGrid.appendChild(card);
  });

  pageInfo.textContent = `Showing ${filtered.length} of ${total} recipes`;

  // tambahin event listener ke tombol view
  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      openRecipe(id);
    });
  });
}

// === DETAIL RECIPE ===
async function openRecipe(id) {
  const res = await fetch(`https://dummyjson.com/recipes/${id}`);
  const recipe = await res.json();

  modalTitle.textContent = recipe.name;
  modalImage.src = recipe.image;
  modalPrepTime.textContent = `${recipe.prepTimeMinutes} mins`;
  modalCookTime.textContent = `${recipe.cookTimeMinutes} mins`;
  modalServings.textContent = recipe.servings;
  modalDifficulty.textContent = recipe.difficulty;
  modalCuisine.textContent = recipe.cuisine;
  modalCalories.textContent = `${recipe.caloriesPerServing} cal/serving`;
  modalRatingStars.textContent = "⭐⭐⭐⭐⭐".slice(0, Math.round(recipe.rating));
  modalRatingText.textContent = `(${recipe.rating})`;
  modalReviewCount.textContent = `${recipe.reviewCount || "--"} reviews`;
  modalTags.textContent = recipe.tags ? recipe.tags.join(", ") : "";

  modalIngredients.innerHTML = "";
  recipe.ingredients.forEach(ing => {
    const li = document.createElement("li");
    li.textContent = ing;
    modalIngredients.appendChild(li);
  });

  modalInstructions.innerHTML = "";
  recipe.instructions.forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    modalInstructions.appendChild(li);
  });

  modal.classList.add("show");
}

// === CLOSE MODAL ===
closeBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

// === DEBOUNCE ===
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// === SEARCH REALTIME ===
const handleSearch = debounce(() => {
  const keyword = searchInput.value.toLowerCase();

  if (!keyword) {
    renderRecipes(recipes);
    return;
  }

  const filtered = recipes.filter(r =>
    r.name.toLowerCase().includes(keyword) ||
    r.cuisine.toLowerCase().includes(keyword) ||
    r.ingredients.some(ing => ing.toLowerCase().includes(keyword)) ||
    (r.tags && r.tags.some(tag => tag.toLowerCase().includes(keyword)))
  );

  renderRecipes(filtered);
}, 500);

searchInput.addEventListener("input", handleSearch);

// === FILTER CUISINE ===
filterSelect.addEventListener("change", async () => {
  currentCuisine = filterSelect.value;
  if (currentCuisine === "all") {
    renderRecipes(recipes);
  } else {
    const res = await fetch(`https://dummyjson.com/recipes/search?q=${currentCuisine}`);
    const data = await res.json();
    renderRecipes(data.recipes || []);
    // sembunyikan tombol show more kalau filter
    showMoreBtn.style.display = "none";
  }
});

// === SHOW MORE ===
showMoreBtn.addEventListener("click", () => {
  skip += limit;
  fetchRecipes();
});

// === INITIAL LOAD ===
fetchRecipes();
