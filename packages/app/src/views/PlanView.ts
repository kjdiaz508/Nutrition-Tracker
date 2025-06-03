import { html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "../styles/reset.css";
import { Auth, Observer } from "@calpoly/mustang";
import { MealPlan } from "../types";

export class PlanView extends LitElement {
  @property({ type: String }) id = "";
  @state() mealPlan?: MealPlan;

  static styles = [reset.styles];

  _authObserver = new Observer<Auth.Model>(this, "mpn:auth");
  _user?: Auth.User;

  get src() {
    return `/api/mealplans/${this.id}`;
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
      <mpn-header title=${this.mealPlan?.name}></mpn-header>

      <mpn-main-grid>
        <section class="col-span-12">
          <mpn-meal-plan .mealPlan=${this.mealPlan}></mpn-meal-plan>
        </section>
      </mpn-main-grid>
    `;
  }
}
