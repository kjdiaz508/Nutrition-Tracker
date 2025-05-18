import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import reset from "./styles/reset.css.ts";

export class PageHeaderElement extends LitElement {
  @property() title = "";
  @property() href = "";
  @property() icon = "icon-profile";
  @property() label = "← Back";

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
      a {
        display: inline-block;
        background-color: var(--color-accent);
        color: white;
        padding: var(--space-sm) var(--space-md);
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
        transition: background-color 0.2s ease;
      }
      a:hover {
        background-color: #c75c1d;
      }
      nav {
        width: 100%;
      }
      h1 {
        color: var(--color-accent);
        font-family: var(--font-family-heading);
      }
    `,
  ];

  override render() {
    return html`
      <header>
        <h1>${this.title}</h1>
        <nav>
          <a href="${this.href}" class="button-link">
            <svg class="icon">
              <use href="/icons/nutrition.svg#${this.icon}"></use>
            </svg>
            ${this.label}
          </a>
        </nav>
      </header>
    `;
  }
}

customElements.define("mpn-page-header", PageHeaderElement);
