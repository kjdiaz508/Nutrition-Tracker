import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "../styles/reset.css";
import { Observer, Auth } from "@calpoly/mustang";

export class PageHeaderElement extends LitElement {
  @property() title = "";
  @property() label = "Back";
  @property({ type: Boolean }) hideBack = false;

  _authObserver = new Observer<Auth.Model>(this, "mpn:auth");

  @state() loggedIn = false;
  @state() userid?: string;

  connectedCallback() {
    super.connectedCallback();

    const prefersDark = localStorage.getItem("dark-mode") === "true";
    document.body.classList.toggle("dark-mode", prefersDark);

    this.updateComplete.then(() => {
      const checkbox = this.renderRoot.querySelector(
        'input[type="checkbox"]'
      ) as HTMLInputElement;
      if (checkbox) checkbox.checked = prefersDark;
    });

    this._authObserver.observe((auth: Auth.Model) => {
      const { user } = auth;
      console.log("user: ", user);
      if (user && user.authenticated) {
        console.log("authenticated");
        this.loggedIn = true;
        this.userid = user.username;
      } else {
        this.loggedIn = false;
        this.userid = undefined;
      }
    });
  }

    static styles = [
    reset.styles,
    css`
      header {
        background-color: var(--color-background-header);
        color: var(--color-text-inverted);
        padding: 1rem;
        border-bottom: 2px solid var(--color-accent);
        font-family: var(--font-family-heading);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
      }
      button {
        font: inherit;
      }
      button {
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
      nav {
        width: 100%;
      }
      h1 {
        color: var(--color-accent);
        font-family: var(--font-family-heading);
      }
      .row {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: 100%;
      }
    `,
  ];

  renderProfileButton() {
    return html`
      <mpn-button-link href="/app/profile" class="button-link">
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-profile" />
        </svg>
        My Profile
      </mpn-button-link>
    `;
  }

  // renderSignOutButton() {
  //   return html`
  //     <button
  //       @click=${(e: Event) =>
  //         Events.relay(e, "auth:message", ["auth/signout"])}
  //     >
  //       <svg class="icon">
  //         <use href="/icons/nutrition.svg#icon-profile" />
  //       </svg>
  //       Sign Out
  //     </button>
  //   `;
  // }

  renderSignInButton() {
    return html`
      <mpn-button-link href="/app/login">
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-profile" />
        </svg>
        Sign In
      </mpn-button-link>
    `;
  }

  renderNavButtons() {
    return html`
      <nav>
        <ul class="row">
          ${!this.hideBack ? html`<li>${this.renderBackButton()}</li>` : html`<li>
            ${this.loggedIn
              ? this.renderProfileButton()
              : this.renderSignInButton()}
          </li>`}
          <li>
            <mpn-button-link href="/app/discover/recipes">
              <svg class="icon">
                <use href="/icons/nutrition.svg#icon-cookbook" />
              </svg>
              Browse Shared Recipes
            </mpn-button-link>
          </li>
          <li>
            <mpn-button-link href="/app/discover/plans">
              <svg class="icon">
                <use href="/icons/nutrition.svg#icon-meal-plan" />
              </svg>
              Browse Shared Meal Plans
            </mpn-button-link>
          </li>
        </ul>
      </nav>
    `;
  }

  renderBackButton() {
    return html`
      <nav>
        <button class="button-link" @click=${() => history.back()}>
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-back">
        </svg>
          ${this.label}
        </button>
      </nav>
    `;
  }

  toggleTheme(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    document.body.classList.toggle("dark-mode", checked);
    localStorage.setItem("dark-mode", String(checked));
  }

  override render() {
    console.log("logged in: ", this.loggedIn);
    return html`
      <header>
        <div class="row">
          <h1>${this.title}</h1>
          <label id="themeToggle">
            <input
              type="checkbox"
              @change=${this.toggleTheme}
              aria-label="dark mode"
            />
            Dark Mode
          </label>
        </div>
        ${this.renderNavButtons()}
      </header>
    `;
  }
}
