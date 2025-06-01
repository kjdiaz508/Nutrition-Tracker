import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css";

export class CardElement extends LitElement {
  static styles = [
    reset.styles,
    css`
      :host {
        display: block;
        background-color: var(--color-background-card);
        padding: var(--space-md);
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    `
  ];

  render() {
    return html`<slot></slot>`;
  }
}
