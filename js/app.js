class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories();
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }

  // Public Methods/API

  addMeal(meal) {
    this._meals.push(meal);
    Storage.updateMeals(this._meals);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    Storage.updateWorkouts(this._workouts);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    this._displayNewWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);
    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1);
      Storage.updateMeals(this._meals);
      this._render();
    }
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);
    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._workouts.splice(index, 1);
      Storage.updateWorkouts(this._workouts);
      this._render();
    }
  }

  reset() {
    this._calorieLimit = 2000;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._render();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._displayCaloriesLimit();
    this._render();
  }

  loadItems() {
    for (const meal of this._meals) {
      this._displayNewMeal(meal);
    }

    for (const workout of this._workouts) {
      this._displayNewWorkout(workout);
    }
  }

  // Private Methods

  _displayCaloriesLimit() {
    document.getElementById("calories-limit").textContent = this._calorieLimit;
  }

  _displayCaloriesTotal() {
    document.getElementById("calories-total").textContent = this._totalCalories;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumed = this._meals.reduce((acc, curr) => {
      return acc + curr.calories;
    }, 0);
    document.getElementById("calories-consumed").textContent = caloriesConsumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurned = this._workouts.reduce(
      (acc, curr) => acc + curr.calories,
      0
    );
    document.getElementById("calories-burned").textContent = caloriesBurned;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById("calories-remaining");
    caloriesRemainingEl.textContent = this._calorieLimit - this._totalCalories;
    if (this._calorieLimit - this._totalCalories <= 0) {
      caloriesRemainingEl.parentElement.parentElement.classList.replace(
        "bg-light",
        "bg-danger"
      );
      document.getElementById("calorie-progress").classList.add("bg-danger");
    } else {
      caloriesRemainingEl.parentElement.parentElement.classList.replace(
        "bg-danger",
        "bg-light"
      );
      document.getElementById("calorie-progress").classList.remove("bg-danger");
    }
  }

  _displayCaloriesProgress() {
    const progressEl = document.getElementById("calorie-progress");
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    progressEl.style.width = `${width}%`;
  }

  _displayNewMeal(meal) {
    const mealItemsEl = document.getElementById("meal-items");
    const newMealEl = document.createElement("div");
    newMealEl.classList.add("card", "my-2");
    newMealEl.setAttribute("data-id", meal.id);
    newMealEl.innerHTML = `<div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>`;
    mealItemsEl.append(newMealEl);
  }

  _displayNewWorkout(workout) {
    const workoutItemsEl = document.getElementById("workout-items");
    const newWorkoutEl = document.createElement("div");
    newWorkoutEl.classList.add("card", "my-2");
    newWorkoutEl.setAttribute("data-id", workout.id);
    newWorkoutEl.innerHTML = `<div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>`;
    workoutItemsEl.append(newWorkoutEl);
  }

  _render() {
    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Storage {
  static getCalorieLimit(defaultCalorieLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem("calorieLimit") === null) {
      calorieLimit = defaultCalorieLimit;
    } else {
      calorieLimit = +localStorage.getItem("calorieLimit");
    }
    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem("calorieLimit", calorieLimit);
  }

  static getTotalCalories(defaultTotalCalories = 0) {
    let totalCalories;
    if (localStorage.getItem("totalCalories") === null) {
      totalCalories = defaultTotalCalories;
    } else {
      totalCalories = +localStorage.getItem("totalCalories");
    }
    return totalCalories;
  }

  static updateTotalCalories(totalCalories) {
    localStorage.setItem("totalCalories", totalCalories);
  }

  static getMeals(defaultMeals = []) {
    let meals;
    if (localStorage.getItem("meals") === null) {
      meals = defaultMeals;
    } else {
      meals = JSON.parse(localStorage.getItem("meals"));
    }
    return meals;
  }

  static getWorkouts(defaultWorkouts = []) {
    let workouts;
    if (localStorage.getItem("workouts") === null) {
      workouts = defaultWorkouts;
    } else {
      workouts = JSON.parse(localStorage.getItem("workouts"));
    }
    return workouts;
  }

  static updateMeals(meals) {
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static updateWorkouts(workouts) {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static clearAll() {
    localStorage.clear();
  }
}

class App {
  constructor() {
    this._tracker = new CalorieTracker();

    this._tracker.loadItems();

    this._loadEventListeners();
  }

  _loadEventListeners() {
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newItem.bind(this, "meal"));

    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newItem.bind(this, "workout"));

    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"));

    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"));

    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));

    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));

    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));

    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();

    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    // Validate inputs
    if (name.value === "" || calories.value === "") {
      alert("Please fill in all fields!");
      return;
    }

    if (type === "meal") {
      const meal = new Meal(name.value, Number(calories.value));
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, Number(calories.value));
      this._tracker.addWorkout(workout);
    }

    name.value = "";
    calories.value = "";

    const collapseForm = document.getElementById(`collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapseForm, {
      toggle: true,
    });
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure?")) {
        const id = e.target.closest(".card").getAttribute("data-id");

        type === "meal"
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);

        e.target.closest(".card").remove();
      }
    }
  }

  _filterItems(type, e) {
    const filterInput = e.target.value.toLowerCase();
    const items = document.querySelectorAll(`#${type}-items .card`);
    for (const item of items) {
      item.classList.remove("hidden");
      const name = item.querySelector("h4").textContent.toLowerCase();
      if (!name.includes(filterInput)) {
        item.classList.add("hidden");
      }
    }
  }

  _reset() {
    if (confirm("Are you sure you want to reset?")) {
      this._tracker.reset();

      document
        .querySelectorAll("#meal-items .card")
        .forEach((item) => item.remove());
      document
        .querySelectorAll("#workout-items .card")
        .forEach((item) => item.remove());
      document.getElementById("filter-meals").value = "";
      document.getElementById("filter-workouts").value = "";
    }
  }

  _setLimit(e) {
    e.preventDefault();

    const limit = document.getElementById("limit");

    if (limit.value === "") {
      alert("Please add a limit.");
      return;
    }

    this._tracker.setLimit(+limit.value);
    limit.value = "";

    const modalEl = document.getElementById("limit-modal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App();
