import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import reset from "./styles/reset.css.ts";

export class MealPlanCardElement extends LitElement {
  @property() title = "";
  @property() href = "";

  static styles = [
    reset.styles,
    css`
      a {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        padding: 4px 0;
        text-decoration: none;
        border-radius: 6px;
        background-color: var(--color-surface);
        color: var(--color-link);
      }
    `
  ];

  override render() {
    return html`
      <a href=${this.href}>
        <svg class="icon">
          <use href="/icons/nutrition.svg#icon-meal-plan"></use>
        </svg>
        ${this.title}
      </a>
    `;
  }
}
