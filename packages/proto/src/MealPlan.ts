import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "./styles/reset.css";

interface Ingredient {
  name: string;
  unit: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Recipe {
  _id: string;
  name: string;
  href: string;
  ingredients: Ingredient[];
  steps: string[];
}

interface MealDay {
  weekday: string;
  recipes: Recipe[];
}


interface MealPlan {
  _id: string;
  name: string;
  owner: string;
  public: boolean;
  days: MealDay[];
}

export class MealPlanElement extends LitElement {
  @property() src?: string;
  @state() mealPlan?: MealPlan;

  static styles = [reset.styles];

  connectedCallback() {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }

  async hydrate(src: string) {
    fetch(src)
    .then(res => res.json())
    .then(data => {
      this.mealPlan = data;
    })
    .catch(err => console.error("Error fetching meal plan:", err));
  }

  computeNutrition(recipes: Recipe[]) {
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

    for (const recipe of recipes) {
      for (const ing of recipe.ingredients) {
        totals.calories += ing.calories || 0;
        totals.protein += ing.protein || 0;
        totals.carbs += ing.carbs || 0;
        totals.fat += ing.fat || 0;
      }
    }

    // Return as strings to match component expectations
    return {
      calories: Math.round(totals.calories).toString(),
      protein: Math.round(totals.protein).toString(),
      carbs: Math.round(totals.carbs).toString(),
      fat: Math.round(totals.fat).toString(),
    };
  }

  render() {
    if (!this.mealPlan) return html`<p>Loading meal plan...</p>`;

    return html`
      <section>
        ${this.mealPlan.days.map((day) => {
          const totals = this.computeNutrition(day.recipes);
          return html`
            <mpn-meal-day
              day=${day.weekday}
              calories=${totals.calories}
              protein=${totals.protein}
              carbs=${totals.carbs}
              fat=${totals.fat}
            >
              ${day.recipes.map(
                (recipe) => html`
                  <mpn-recipe-link
                    href=${recipe.href}
                    title=${recipe.name}
                  ></mpn-recipe-link>
                `
              )}
            </mpn-meal-day>
          `;
        })}
      </section>
    `;
  }
}
