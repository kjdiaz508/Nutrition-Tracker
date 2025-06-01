import { css, html, LitElement } from "lit";
import reset from "../styles/reset.css";

export class LoginView extends LitElement {
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

    `,
  ];

  render() {
    return html`
      <mpn-header title="Log In or Sign Up" href="/"></mpn-header>
      <mpn-main-grid>
        <mpn-card class="col-span-12 center-content">
            <div class="sequence">
              <h2>Login</h2>
              <login-form api="/auth/login" redirect="/">
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
            Or did you want to
            <mpn-button-link href="/app/sign-up">
              Sign up as a new user
            </mpn-button-link>?
          </p>
        </div>
      </mpn-main-grid>
    `;
  }
}
