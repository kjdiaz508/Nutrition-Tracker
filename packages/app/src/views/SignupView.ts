import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css";

export class SignupView extends LitElement {
  static styles = [
    reset.styles,
    css`
      mpn-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: var(--space-sm);
      }
    `
  ];

  render() {
    return html`
      <mpn-header title="Create Account"></mpn-header>
      <mpn-main-grid>
        <mpn-card class="col-span-12 center-content">
          <div class="sequence">
            <h2>Sign Up</h2>
            <login-form api="/auth/register" redirect="/">
              <label>
                <span>Username:</span>
                <input name="username" autocomplete="off" />
              </label>
              <label>
                <span>Password:</span>
                <input type="password" name="password" />
              </label>
            </login-form>
          </div>
        </mpn-card>
        <div class="col-span-12">
          <p>
            Already have an account?
            <mpn-button-link href="/app/login">
              Log in
            </mpn-button-link>.
          </p>
        </div>
      </mpn-main-grid>
    `;
  }
}
