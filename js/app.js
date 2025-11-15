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
    document.getElementById("calories-remaining").textContent =
      this._calorieLimit - this._totalCalories;
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
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

const run = new Workout("Morning run", 300);

tracker.addWorkout(run);

console.log(tracker._meals);
console.log(tracker._workouts);
console.log(tracker._totalCalories);
