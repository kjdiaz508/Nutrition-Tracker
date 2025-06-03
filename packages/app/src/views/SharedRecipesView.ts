import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css";
import { state } from "lit/decorators.js";
import { Recipe } from "../types";
import { Auth, Observer } from "@calpoly/mustang";

export class SharedRecipesView extends LitElement {
  @state() recipes?: Recipe[];

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
    if (this._user && this._user.authenticated) {
      return {
        Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`,
      };
    }
    return {};
  }

  async hydrate() {
    fetch("/api/recipes/public", { headers: this.authorization })
      .then((res) => res.json())
      .then((data) => {
        this.recipes = data;
      })
      .catch((err) => console.error("Error fetching recipes:", err));
  }

  renderRecipeList() {
    if (!this.recipes) {
      return html`Loading recipes...`;
    }
    return html`
      <ul>
        ${this.recipes.map((recipe) => {
          return html`
            <li>
              <mpn-card>
                <a href="/app/discover/recipes/${recipe._id}">
                  <svg class="icon">
                    <use href="/icons/nutrition.svg#icon-cookbook"></use>
                  </svg>
                  ${recipe.name}
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
      <mpn-header title="Public Recipe Library"></mpn-header>
      <mpn-main-grid>
        <section class="col-span-12">
          ${this.renderRecipeList()}
        </section>
      </mpn-main-grid>
    `;
  }
}
