import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";
import reset from "../styles/reset.css.ts";

export class RecipeLinkElement extends LitElement {
  @property() href = "";
  @property() title = "";

  override render() {
    return html`
      <a href="${this.href}">
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-recipe-checklist" />
        </svg>
        ${this.title}
      </a>
    `;
  }

  static styles = [
    reset.styles,
    css`
      a {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: var(--color-text-primary);
        font-weight: 500;
      }

      a:hover {
        text-decoration: underline;
      }

      svg.icon {
        fill: var(--color-accent);
      }
    `
  ];
}
