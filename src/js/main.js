import { renderMeals, renderMealDetails } from "./ui/components.js";
import { appState, loadFoodLog } from "./state/appState.js";
import { searchMeals, getMealById, filterByCategory, filterByArea } from "./api/mealdb.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("===== NutriPlan App Started =====");

  loadFoodLog();
  console.log("Food Log Loaded:", appState.foodLog);

  try {
    const meals = await searchMeals(""); 
    appState.meals = meals || [];
    renderMeals(appState.meals);
    console.log("Meals Loaded:", appState.meals.length);

    attachMealCardEvents();
  } catch (error) {
    console.error("Error loading meals:", error);
  }

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("keyup", async (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (!query) return;

        try {
          const results = await searchMeals(query);
          appState.meals = results || [];
          renderMeals(appState.meals);
          console.log("Search Results:", appState.meals.length);

          attachMealCardEvents(); // إعادة ربط الكروت بعد البحث
        } catch (err) {
          console.error("Search Error:", err);
        }
      }
    });
  }


  const categoryButtons = document.querySelectorAll(".category-btn");
  categoryButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const category = btn.dataset.category;
      if (!category) return;

      const results = await filterByCategory(category);
      appState.meals = results || [];
      renderMeals(appState.meals);
      attachMealCardEvents();
    });
  });


  const areaButtons = document.querySelectorAll(".area-btn");
  areaButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const area = btn.dataset.area;
      if (!area) return;

      const results = await filterByArea(area);
      appState.meals = results || [];
      renderMeals(appState.meals);
      attachMealCardEvents();
    });
  });

  function attachMealCardEvents() {
    const recipesGrid = document.getElementById("recipes-grid");
    if (!recipesGrid) return;

    const cards = recipesGrid.querySelectorAll(".recipe-card");
    cards.forEach((card, index) => {
      card.addEventListener("click", async () => {
        const meal = appState.meals[index];
        if (!meal) return;

        const fullMeal = await getMealById(meal.idMeal);
        appState.currentMeal = fullMeal;
        renderMealDetails(fullMeal);
        console.log("Meal Details Rendered:", fullMeal.strMeal);

        const logBtn = document.getElementById("log-this-meal-btn");
        if (logBtn) {
          logBtn.replaceWith(logBtn.cloneNode(true));
          const newLogBtn = document.getElementById("log-this-meal-btn");

          newLogBtn.addEventListener("click", () => {
            const item = {
              id: fullMeal.idMeal,
              name: fullMeal.strMeal || "Unknown Meal",
              calories: fullMeal.calories || 0,
              protein: fullMeal.protein || 0,
              carbs: fullMeal.carbs || 0,
              fats: fullMeal.fats || 0,
              date: new Date().toLocaleDateString()
            };

            appState.foodLog.push(item);
            localStorage.setItem("nutriplan_foodlog", JSON.stringify(appState.foodLog));

            const list = document.getElementById("logged-items-list");
            if (list) {
              const div = document.createElement("div");
              div.className = "foodlog-item";
              div.innerHTML = `
                ${item.name} - ${item.calories} kcal
                <button class="remove-btn">Remove</button>
              `;
              list.appendChild(div);

              div.querySelector(".remove-btn").addEventListener("click", () => {
                list.removeChild(div);
                appState.foodLog = appState.foodLog.filter(f => f.id !== item.id);
                localStorage.setItem("nutriplan_foodlog", JSON.stringify(appState.foodLog));
              });
            }

            updateDailyTotals();
          });
        }
      });
    });
  }


  function updateDailyTotals() {
    let calories = 0, protein = 0, carbs = 0, fats = 0;
    appState.foodLog.forEach(item => {
      calories += item.calories || 0;
      protein += item.protein || 0;
      carbs += item.carbs || 0;
      fats += item.fats || 0;
    });

    const calEl = document.getElementById("total-calories");
    const proEl = document.getElementById("total-protein");
    const carbEl = document.getElementById("total-carbs");
    const fatEl = document.getElementById("total-fats");

    if (calEl) calEl.innerText = calories;
    if (proEl) proEl.innerText = protein;
    if (carbEl) carbEl.innerText = carbs;
    if (fatEl) fatEl.innerText = fats;
  }
  updateDailyTotals();
});
