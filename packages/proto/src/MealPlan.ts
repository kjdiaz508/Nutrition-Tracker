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
    const res = await fetch(src);
    if (res.ok) {
      this.mealPlan = await res.json();
    }
  }

  render() {
    if (!this.mealPlan) return html`<p>Loading meal plan...</p>`;

    return html`
      <section class="col-span-12 sequence">
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
