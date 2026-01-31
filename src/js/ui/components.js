export function renderMeals(meals) {
  const grid = document.getElementById("recipes-grid");
  const count = document.getElementById("recipes-count");
  grid.innerHTML = "";

  if (!meals) {
    count.innerText = "0 Recipes";
    return;
  }
  count.innerText = meals.length + " Recipes";
  meals.forEach(meal => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    const image = meal.strMealThumb || "https://via.placeholder.com/150";

    card.innerHTML = `
      <img src="${image}" alt="${meal.strMeal || "Meal"}"/>
      <h3>${meal.strMeal || "Unknown Meal"}</h3>
      <button class="log-btn">Log This Meal</button>
    `;

    grid.appendChild(card);
  });
}

export function renderMealDetails(meal) {
  const details = document.getElementById("meal-details");
  if (!details) return;

  const image = meal.strMealThumb || "https://via.placeholder.com/150";
  const name = meal.strMeal || "Unknown Meal";
  const category = meal.strCategory || "Unknown";
  const area = meal.strArea || "Unknown";

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) ingredients.push(ingredient);
  }

  details.innerHTML = `
    <h2>${name}</h2>
    <img src="${image}" alt="${name}" />
    <p><strong>Category:</strong> ${category}</p>
    <p><strong>Area:</strong> ${area}</p>
    <h4>Ingredients:</h4>
    <ul>${ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
    <h4>Instructions:</h4>
    <p>${meal.strInstructions || "No instructions available"}</p>
    ${meal.strYoutube ? `<iframe src="${meal.strYoutube.replace("watch?v=", "embed/")}" frameborder="0" allowfullscreen></iframe>` : ""}
    <button id="log-this-meal-btn">Log This Meal</button>
  `;
}
