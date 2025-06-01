import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "../styles/reset.css";
import { Auth, Observer } from "@calpoly/mustang";

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

export class PlanView extends LitElement {
  @property({ type: String }) id = "";
  @state() mealPlan?: MealPlan;

  static styles = [reset.styles];

  _authObserver = new Observer<Auth.Model>(this, "mpn:auth");
  _user?: Auth.User;

  get src() {
    return `/api/mealplans/${this.id}`
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
        Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`,
      };
    else return {};
  }

  async hydrate(src: string) {
    fetch(src, { headers: this.authorization })
      .then((res) => res.json())
      .then((data) => {
        this.mealPlan = data;
      })
      .catch((err) => console.error("Error fetching meal plan:", err));
  }

  render() {
    return html`
      <mpn-header
        title=${this.mealPlan?.name}
        href="/app/discover/plans"
        icon="icon-meal-plan"
        label="← Back to Shared Meal Plans"
      ></mpn-header>

      <mpn-main-grid>
        <section class="col-span-12">
          <mpn-meal-plan .mealPlan=${this.mealPlan}></mpn-meal-plan>
        </section>

        <section class="col-span-12">
          <mpn-button-link href="/app/shopping-list">
            <svg class="icon">
              <use href="/icons/nutrition.svg#icon-grocery-bag" />
            </svg>
            View Shopping List
          </mpn-button-link>
        </section>
      </mpn-main-grid>
    `;
  }
}
