import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css";

export class HomeView extends LitElement {
  static styles = [reset.styles, css``];
  render() {
    return html`
      <mpn-header title="Meal Prep & Nutrition Organizer"></mpn-header>
      <mpn-main-grid>
        <mpn-card class="col-span-12">
          <h2>Welcome!</h2>
          <p>
            Use this app to explore meal plans, view detailed nutrition info,
            and prep your week efficiently.
          </p>
        </mpn-card>
      </mpn-main-grid>
    `;
  }
}
