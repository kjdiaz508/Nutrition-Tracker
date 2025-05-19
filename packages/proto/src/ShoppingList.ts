import { Auth, Observer } from "@calpoly/mustang";
import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";

interface Ingredient {
  name: string;
  unit: string;
  amount: number;
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

export class ShoppingListElement extends LitElement {
  @property() src?: string;
  @state() mealPlan?: MealPlan;

  _authObserver = new Observer<Auth.Model>(this, "mpn:auth");
  _user?: Auth.User;

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: Auth.Model) => {
      this._user = auth.user;
      if (this.src) this.hydrate(this.src);
    });
  }

  get authorization(): { Authorization?: string } {
    if (this._user && this._user.authenticated)
      return {
        Authorization:
          `Bearer ${(this._user as Auth.AuthenticatedUser).token}`
      };
    else return {};
  }

  async hydrate(src: string) {
    try {
      const res = await fetch(src, { headers: this.authorization });
      this.mealPlan = await res.json();
    } catch (err) {
      console.error("Error loading meal plan for shopping list:", err);
    }
  }

  computeShoppingList() {
    const ingredientsMap = new Map<string, Ingredient>();

    this.mealPlan?.days.forEach((day) => {
      day.recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
          const key = `${ingredient.name}|${ingredient.unit}`;
          const existing = ingredientsMap.get(key);
          if (existing) {
            existing.amount += ingredient.amount;
          } else {
            ingredientsMap.set(key, { ...ingredient });
          }
        });
      });
    });

    return Array.from(ingredientsMap.values());
  }

  render() {
    if (!this.mealPlan) return html`<p>Loading shopping list...</p>`;

    const ingredients = this.computeShoppingList();

    return html`
      <section class="card">
        <h2>For: ${this.mealPlan.name}</h2>
        <ul class="sequence">
          ${ingredients.map(
            (ing) => html`<li>${ing.name} – ${ing.amount} ${ing.unit}</li>`
          )}
        </ul>
      </section>
    `;
  }
}
