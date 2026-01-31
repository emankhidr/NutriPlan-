const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export async function searchMeals(name) {
  const response = await fetch(`${BASE_URL}/search.php?s=${name}`);
  const data = await response.json();
  return data.meals;
}

export async function getMealById(id) {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data = await response.json();
  return data.meals[0];
}

export async function filterByCategory(category) {
  const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);
  const data = await response.json();
  return data.meals;
}
export async function filterByArea(area) {
  const response = await fetch(`${BASE_URL}/filter.php?a=${area}`);
  const data = await response.json();
  return data.meals;
}
