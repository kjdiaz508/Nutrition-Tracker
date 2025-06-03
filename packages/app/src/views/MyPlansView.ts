import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css";
import { state } from "lit/decorators.js";
import { MealPlan } from "../types";
import { Auth, Observer } from "@calpoly/mustang";

export class MyPlansView extends LitElement {
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
    fetch("/api/mealplans/private", { headers: this.authorization })
      .then((res) => res.json())
      .then((data) => {
        this.mealPlans = data;
      })
      .catch((err) => console.error("Error fetching personal meal plans:", err));
  }

  renderPlanList() {
    if (!this.mealPlans) {
      return html`Loading your meal plans...`;
    }
    return html`
      <ul>
        ${this.mealPlans.map((mealPlan) => {
          return html`
            <li>
              <mpn-card>
                <a href="/app/my-plans/${mealPlan._id}">
                  <svg class="icon">
                    <use href="/icons/nutrition.svg#icon-meal-plan"></use>
                  </svg>
                  ${mealPlan.name}
                </a>
              </mpn-card>
            </li>
          `;
        })}
      </ul>
    `;
  }

  render() {
    return html`
      <mpn-header title="My Meal Plans"></mpn-header>
      <mpn-main-grid>
        <section class="col-span-12">
          ${this.renderPlanList()}
        </section>
      </mpn-main-grid>

       <section class="col-span-12">
          <mpn-button-link href="/app/my-plans/create">
            Create New Plan
          </mpn-button-link>
        </section>
      </mpn-main-grid>
    `;
  }
}
