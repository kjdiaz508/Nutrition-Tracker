import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import reset from "../styles/reset.css";
import { Auth, Observer } from "@calpoly/mustang";
import { MealPlan, Recipe, User } from "../types";

export class HomeView extends LitElement {
  @state() user?: User;
  @state() mealPlan?: MealPlan;
  @state() todayRecipes: Recipe[] = [];

  static styles = [
    reset.styles,
    css`
      h3 {
        margin-bottom: var(--space-sm);
      }

      ul {
        padding-left: 1rem;
      }

      li {
        margin-bottom: 0.5rem;
      }

      a {
        color: var(--color-link);
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      .link-group {
        margin-top: var(--space-md);
        display: flex;
        gap: var(--space-md);
        flex-wrap: wrap;
      }

      .button-link {
        display: inline-block;
        background-color: var(--color-accent);
        color: white;
        padding: var(--space-sm) var(--space-md);
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        transition: background-color 0.2s ease;
      }

      .button-link:hover {
        background-color: #c75c1d;
      }

      .mealplan-link {
        font-weight: bold;
        color: var(--color-accent);
      }
    `
  ];

  _authObserver = new Observer<Auth.Model>(this, "mpn:auth");
  _user?: Auth.AuthenticatedUser;

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: Auth.Model) => {
      if (auth.user?.authenticated) {
        this._user = auth.user as Auth.AuthenticatedUser;
        this.hydrate();
      }
    });
  }

  get authorization(): { Authorization?: string } {
    return this._user?.authenticated
      ? { Authorization: `Bearer ${this._user.token}` }
      : {};
  }

  async hydrate() {
    try {
      const res = await fetch(`/api/users/${this._user!.username}`, {
        headers: this.authorization,
      });
      const data = await res.json();
      this.user = data;
      this.mealPlan = data.currentMealPlan;
      console.log("mp:", this.mealPlan);
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const day = this.mealPlan!.days.find(
        (d) => d.weekday.toLowerCase() === today.toLowerCase()
      );
      this.todayRecipes = day?.recipes || [];
      console.log(this.todayRecipes);
    } catch (err) {
      console.error("Error fetching current user or meal plan:", err);
    }
  }

  renderToday() {
    if (!this.todayRecipes.length) return html`<p>No meals planned for today.</p>`;
    return html`
      <ul>
        ${this.todayRecipes.map(
          (r) => html`
            <li>
              <a href="/app/my-recipes/${r._id}">${r.name}</a>
            </li>
          `
        )}
      </ul>
    `;
  }

  render() {
    return html`
      <mpn-header title="Meal Prep & Nutrition Organizer" hideBack></mpn-header>
      <mpn-main-grid>
        <mpn-card class="col-span-12">
          <h2>Welcome!</h2>
          <p>
            Use this app to explore meal plans, view detailed nutrition info,
            and prep your week efficiently.
          </p>
          <div class="link-group">
            <a class="button-link" href="/app/my-plans/create">Create Meal Plan</a>
            <a class="button-link" href="/app/my-plans">My Meal Plans</a>
          </div>
        </mpn-card>

        ${this.mealPlan
          ? html`
              <mpn-card class="col-span-12">
                <h3>Current Meal Plan:</h3>
                <p>
                  <a class="mealplan-link" href="/app/my-plans/${this.mealPlan._id}">
                    ${this.mealPlan.name}
                  </a>
                </p>
              </mpn-card>

              <mpn-card class="col-span-12">
                <h3>Today's Meals (${new Date().toLocaleDateString(undefined, {
                  weekday: "long"
                })}):</h3>
                ${this.renderToday()}
              </mpn-card>
            `
          : html`
              <mpn-card class="col-span-12">
                <p>You don't have a current meal plan set.</p>
                <p>
                  <a href="/app/my-plans">Choose one from your plans</a>
                  or
                  <a href="/app/discover/plans">browse public plans</a>.
                </p>
              </mpn-card>
            `}
      </mpn-main-grid>
    `;
  }
}
