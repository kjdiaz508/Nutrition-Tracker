import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "./styles/reset.css";

interface RecipeRef {
  id: string;
  title: string;
  href: string;
}

interface MealDay {
  day: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  recipes: RecipeRef[];
}

interface MealPlan {
  id: string;
  title: string;
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

  render() {
    if (!this.mealPlan) return html`<p>Loading meal plan...</p>`;

    return html`
      <section>
        ${this.mealPlan.days.map(
          (day) => html`
            <mpn-meal-day
              day=${day.day}
              calories=${day.calories}
              protein=${day.protein}
              carbs=${day.carbs}
              fat=${day.fat}
            >
              ${day.recipes.map(
                (recipe) => html`
                  <mpn-recipe-link
                    href=${recipe.href}
                    title=${recipe.title}
                  ></mpn-recipe-link>
                `
              )}
            </mpn-meal-day>
          `
        )}
      </section>
    `;
  }
}
