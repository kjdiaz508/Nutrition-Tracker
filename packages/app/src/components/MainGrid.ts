import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css";

export class MainGridElement extends LitElement {
  static styles = [
    reset.styles,
    css`
      main {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: var(--space-md);
        padding: var(--space-lg) var(--space-md);
      }

      ::slotted(.col-span-12) {
        grid-column: span 12;
      }
      ::slotted(.col-span-8) {
        grid-column: span 8;
      }
      ::slotted(.col-span-6) {
        grid-column: span 6;
      }
      ::slotted(.col-span-4) {
        grid-column: span 4;
      }
      ::slotted(.col-span-3) {
        grid-column: span 3;
      }

      @media (max-width: 768px) {
        main {
          grid-template-columns: repeat(8, 1fr);
        }
        ::slotted(.col-span-6),
        ::slotted(.col-span-4),
        ::slotted(.col-span-3),
        ::slotted(.col-span-8),
        ::slotted(.col-span-12) {
          grid-column: span 8;
        }
      }
    `,
  ];

  render() {
    return html`
      <main>
        <slot></slot>
      </main>
    `;
  }
}
