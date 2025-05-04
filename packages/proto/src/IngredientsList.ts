import { html, css, LitElement } from "lit";
import reset from "./styles/reset.css.ts";

export class IngredientsListElement extends LitElement {
  override render() {
    return html`
      <section>
        <h2>Ingredients</h2>
        <ul>
          <slot></slot>
        </ul>
      </section>
    `;
  }

  static styles = [
    reset.styles,
    css`
      section {
        background-color: var(--color-background-card);
        padding: var(--space-md);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      h2 {
        font-family: var(--font-family-heading);
        color: var(--color-accent);
        margin-bottom: var(--space-sm);
      }

      ul {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
      }
    `
  ];
}
