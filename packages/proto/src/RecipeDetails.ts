import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "./styles/reset.css.ts";

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

export class RecipeDetailsElement extends LitElement {
  @property() src?: string;
  @state() recipe?: Recipe;

  static styles = [reset.styles];

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }

  async hydrate(src: string) {
    try {
      const res = await fetch(src);
      this.recipe = await res.json();
    } catch (err) {
      console.error("Failed to fetch recipe:", err);
    }
  }

  computeNutrition() {
    if (!this.recipe) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

    return this.recipe.ingredients.reduce(
      (totals, i) => {
        totals.calories += i.calories || 0;
        totals.protein += i.protein || 0;
        totals.carbs += i.carbs || 0;
        totals.fat += i.fat || 0;
        return totals;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  render() {
    if (!this.recipe) return html`<p>Loading recipe...</p>`;

    const macros = this.computeNutrition();

    return html`
      <main class="main-grid section">
        <section class="col-span-6">
          <mpn-ingredients-list>
            ${this.recipe.ingredients.map(
              (i) =>
                html`<li>
                  ${i.name}${i.unit ? ` – ${i.amount} ${i.unit}` : ""}
                </li>`
            )}
          </mpn-ingredients-list>
        </section>

        <section class="col-span-6 card">
          <h2>Nutrition Summary</h2>
          <p>
            Calories: ${Math.round(macros.calories)} |
            Protein: ${Math.round(macros.protein)}g |
            Carbs: ${Math.round(macros.carbs)}g |
            Fat: ${Math.round(macros.fat)}g
          </p>
        </section>

        <section class="col-span-12 card section">
          <h2>Instructions</h2>
          <ol class="sequence">
            ${this.recipe.steps.map((step) => html`<li>${step}</li>`)}
          </ol>
        </section>
      </main>
    `;
  }
}
