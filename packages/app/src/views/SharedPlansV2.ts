import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css";
import { state } from "lit/decorators.js";
import { MealPlan } from "../types";
import { Auth, Observer } from "@calpoly/mustang";

export class SharedPlansView extends LitElement {
  @state() mealPlans?: MealPlan[];

  static styles = [
    reset.styles,
    css`
      h2 {
        margin-bottom: var(--space-md);
        font-family: var(--font-family-heading);
      }

      ul {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--space-md);
        list-style: none;
        padding: 0;
      }

      li {
        list-style: none;
      }

      mpn-card {
        padding: var(--space-md);
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        height: 100%;
      }

      a {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        text-decoration: none;
        color: var(--color-link);
        font-weight: 600;
        font-size: 1.05rem;
      }

      a:hover {
        text-decoration: underline;
      }

      svg.icon {
        width: 1.2rem;
        height: 1.2rem;
        fill: currentColor;
      }

      .empty-state {
        text-align: center;
        padding: var(--space-lg);
        color: var(--color-muted);
      }
    `
  ];

  _authObserver = new Observer<Auth.Model>(this, "mpn:auth");
  _user?: Auth.User;

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: Auth.Model) => {
      this._user = auth.user;
      this.hydrate();
    });
  }

  get authorization(): { Authorization?: string } {
    return this._user?.authenticated
      ? { Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}` }
      : {};
  }

  async hydrate() {
    try {
      const res = await fetch("/api/mealplans", { headers: this.authorization });
      const data = await res.json();
      this.mealPlans = data.filter((plan: MealPlan) => plan.public);
    } catch (err) {
      console.error("Error fetching meal plans:", err);
    }
  }

  renderPlanList() {
    if (!this.mealPlans) {
      return html`<p class="empty-state">Loading meal plans...</p>`;
    }

    if (this.mealPlans.length === 0) {
      return html`<p class="empty-state">No public meal plans found.</p>`;
    }

    return html`
      <ul>
        ${this.mealPlans.map(
          (mealPlan) => html`
            <li>
              <mpn-card>
                <a href="/app/discover/plans/${mealPlan._id}">
                  <svg class="icon">
                    <use href="/icons/nutrition.svg#icon-meal-plan"></use>
                  </svg>
                  ${mealPlan.name}
                </a>
                <p style="color: var(--color-muted); font-size: 0.9rem;">
                  Created by: ${mealPlan.owner || "Unknown"}
                </p>
              </mpn-card>
            </li>
          `
        )}
      </ul>
    `;
  }

  render() {
    return html`
      <mpn-header title="Public Meal Plan Library"></mpn-header>
      <mpn-main-grid>
        <section class="col-span-12">
          <h2>Explore Public Meal Plans</h2>
          ${this.renderPlanList()}
        </section>
      </mpn-main-grid>
    `;
  }
}
