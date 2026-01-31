export const appState = {
  meals: [],
  currentMeal: null,
  foodLog: []
};

export function loadFoodLog() {
  const stored = localStorage.getItem("nutriplan_foodlog");
  if (stored) {
    appState.foodLog = JSON.parse(stored);
  }

  const list = document.getElementById("logged-items-list");
  if (list) {
    list.innerHTML = "";
    appState.foodLog.forEach(item => {
      const div = document.createElement("div");
      div.className = "foodlog-item";
      div.innerHTML = `
        ${item.name} - ${item.calories || 0} kcal
        <button class="remove-btn">Remove</button>
      `;
      list.appendChild(div);

      // زر إزالة
      div.querySelector(".remove-btn").addEventListener("click", () => {
        list.removeChild(div);
        appState.foodLog = appState.foodLog.filter(f => f.id !== item.id);
        localStorage.setItem("nutriplan_foodlog", JSON.stringify(appState.foodLog));
      });
    });
  }
}
