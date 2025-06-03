import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import reset from "../styles/reset.css";
import { Auth, Observer, Events } from "@calpoly/mustang";
import { User } from "../types";

export class ProfileView extends LitElement {
  @state() user?: User;

  static styles = [
    reset.styles,
    css`
      h2,
      h3 {
        margin-bottom: var(--space-sm);
      }

      ul {
        list-style: none;
        padding: 0;
      }

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--color-border);
      }

      .info-block {
        margin-bottom: var(--space-md);
      }

      .label {
        font-weight: bold;
      }

      button {
        font: inherit;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        background-color: var(--color-accent);
        color: white;
        padding: var(--space-sm) var(--space-md);
        border: none;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        transition: background-color 0.2s ease;
      }
      button:hover {
        background-color: #c75c1d;
      }

      .signout-container {
        display: flex;
        justify-content: center;
        margin-top: var(--space-md);
      }
    `,
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
      const res = await fetch(`/api/users/username/${this._user!.username}`, {
        headers: this.authorization,
      });
      const data = await res.json();
      console.log("bleh:", data);
      this.user = data;
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  }

  async setAsCurrent(mealPlanId: string) {
    if (!this.user) return;

    const confirmed = confirm("Set this meal plan as your current one?");
    if (!confirmed) return;

    const updated = { ...this.user, currentMealPlan: mealPlanId };

    try {
      const res = await fetch(`/api/users/${this.user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...this.authorization,
        },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const newUser = await res.json();
      this.user = newUser;
    } catch (err) {
      console.error("Error setting current meal plan:", err);
    }
  }

  renderMealPlans() {
    if (!this.user?.mealPlans?.length) {
      return html`<p>You haven’t created any meal plans yet.</p>`;
    }

    return html`
      <ul>
        ${this.user.mealPlans.map(
          (plan: { _id: string; name: string }) => html`
            <li>
              <span>${plan.name}</span>
              ${this.user?.currentMealPlan?._id === plan._id
                ? html`<em>(Current)</em>`
                : html`
                    <button @click=${() => this.setAsCurrent(plan._id)}>
                      Set as Current
                    </button>
                  `}
            </li>
          `
        )}
      </ul>
    `;
  }

  render() {
    return html`
      <mpn-header title="My Profile"></mpn-header>
      <mpn-main-grid>
        <mpn-card class="col-span-12">
          <h2>Profile Info</h2>
          ${this.user
            ? html`
                <div class="info-block">
                  <p>
                    <span class="label">First Name:</span>
                    ${this.user.firstName}
                  </p>
                  <p>
                    <span class="label">Last Name:</span>
                    ${this.user.lastName}
                  </p>
                  <p>
                    <span class="label">Username:</span>
                    ${this.user.username}
                  </p>
                </div>

                <div class="info-block">
                  <h3>Current Meal Plan</h3>
                  ${this.user.currentMealPlan
                    ? html`
                        <p>
                          <a
                            href="/app/my-plans/${this.user.currentMealPlan
                              ._id}"
                          >
                            ${this.user.currentMealPlan.name}
                          </a>
                        </p>
                      `
                    : html`<p>No meal plan selected.</p>`}
                </div>

                <div class="info-block">
                  <h3>Your Meal Plans</h3>
                  ${this.renderMealPlans()}
                </div>
              `
            : html`<p>Loading user info...</p>`}
        </mpn-card>

        <mpn-card class="col-span-12 signout-container">
          <button
            @click=${(e: Event) =>
              Events.relay(e, "auth:message", ["auth/signout"])}
          >
            <svg class="icon">
              <use href="/icons/nutrition.svg#icon-profile" />
            </svg>
            Sign Out
          </button>
        </mpn-card>
      </mpn-main-grid>
    `;
  }
}
