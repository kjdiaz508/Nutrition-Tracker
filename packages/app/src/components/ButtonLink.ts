import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css";
import { property } from "lit/decorators.js";

export class ButtonLinkElement extends LitElement {
  @property() href = "";

  static styles = [
    reset.styles,
    css`
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
    `,
  ];

  render() {
    return html`
      <a href=${this.href}>
        <slot></slot>
      </a>
    `;
  }
}
