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
      a {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        text-decoration: none;
        color: var(--color-link);
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
    if (this._user && this._user.authenticated)
      return {
        Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`,
      };
    else return {};
  }

  async hydrate() {
    fetch("/api/mealplans", { headers: this.authorization })
      .then((res) => res.json())
      .then((data) => {
        this.mealPlans = data;
      })
      .catch((err) => console.error("Error fetching meal plan:", err));
  }

  renderPlanList() {
    if (!this.mealPlans) {
      return html`Loading meal plans...`;
    }
    return html`
      <ul>
        ${this.mealPlans?.map((mealPlan) => {
          return html`
            <li>
              <mpn-card>
                <a href="/app/discover/plans/${mealPlan._id}">
                  <svg class="icon">
                    <use href="/icons/nutrition.svg#icon-meal-plan"></use>
                  </svg>
                  ${mealPlan.name}
                </a>
              </mpn-card>
            </li>
          `
        })}
      </ul>
    `
  }

  render() {
    return html`
      <mpn-header
          title="Public Meal Plan Library"
          href="/app"
          icon="icon-profile"
          label="← Back to Home"
      ></mpn-header>
      <mpn-main-grid>
        <section class="col-span-12">
          ${this.renderPlanList()}
        </section>
      </mpn-main-grid>
    `;
  }
}
