import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";
import reset from "../styles/reset.css.ts";

export class MealDayElement extends LitElement {
  @property() day = "";
  @property() calories = "";
  @property() protein = "";
  @property() carbs = "";
  @property() fat = "";

  override render() {
    return html`
      <section>
        <h2>${this.day}</h2>
        <div>
          <slot></slot>
        </div>
        <p>
          Calories: ${this.calories} |
          Protein: ${this.protein} |
          Carbs: ${this.carbs} |
          Fat: ${this.fat}
        </p>
      </section>
    `;
  }

  static styles = [
    reset.styles,
    css`
      section {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
        background-color: var(--color-background-card);
        border-radius: 8px;
        padding: var(--space-md);
      }

      h2 {
        font-family: var(--font-family-heading);
        color: var(--color-accent);
        margin-bottom: var(--space-xs);
      }

      div {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
      }

      p {
        font-size: 0.9rem;
        color: var(--color-text-secondary);
      }
    `
  ];
}
