class CalorieTracker {
  constructor() {
    this._calorieLimit = 2500;
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];

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
    this._totalCalories += meal.calories;
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._render();
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

  _render() {
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

const tracker = new CalorieTracker();

const breakfast = new Meal("Breakfast", 400);

tracker.addMeal(breakfast);

const lunch = new Meal("Lunch", 750);

tracker.addMeal(lunch);

const dinner = new Meal("Dinner", 850);

tracker.addMeal(dinner);

const run = new Workout("Morning run", 300);

tracker.addWorkout(run);

const gymSession = new Workout("Gym Session", 550);

tracker.addWorkout(gymSession);

const hugeMeal = new Meal("Huge Meal", 2500);

tracker.addMeal(hugeMeal);

console.log(tracker._meals);
console.log(tracker._workouts);
console.log(tracker._totalCalories);
