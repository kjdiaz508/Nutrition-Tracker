import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "../styles/reset.css.js";

interface LoginFormData {
  username?: string;
  password?: string;
}

export class LoginFormElement extends LitElement {
  @state()
  formData: LoginFormData = {};

  @property()
  api?: string;

  @property()
  redirect: string = "/";

  @state()
  error?: string;

  static styles = [
    reset.styles,
    css`
      :host {
        margin-top: var(--space-md);
      }

      form {
        display: flex;
        flex-direction: column;
        gap: var(--space-md);
      }

      label {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        font-weight: bold;
      }

      input {
        padding: 0.5rem;
        font-size: 1rem;
        border-radius: 4px;
        border: 1px solid #ccc;
      }

      button {
        align-self: flex-start;
        background-color: var(--color-accent);
        color: white;
        padding: var(--space-sm) var(--space-md);
        border: none;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .error:not(:empty) {
        color: var(--color-error, red);
        border: 1px solid var(--color-error, red);
        padding: var(--space-sm);
        background: #ffe5e5;
        border-radius: 6px;
      }
    `
  ];

  get canSubmit(): boolean {
    return Boolean(this.api && this.formData.username && this.formData.password);
  }

  override render() {
    return html`
      <form
        @change=${(e: InputEvent) => this.handleChange(e)}
        @submit=${(e: SubmitEvent) => this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Login</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `;
  }

  handleChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const name = target?.name;
    const value = target?.value;
    const prevData = this.formData;

    switch (name) {
      case "username":
        this.formData = { ...prevData, username: value };
        break;
      case "password":
        this.formData = { ...prevData, password: value };
        break;
    }
  }

  handleSubmit(submitEvent: SubmitEvent) {
    submitEvent.preventDefault();

    if (this.canSubmit) {
      fetch(this.api!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.formData)
      })
        .then((res) => {
          if (res.status !== 200) throw "Login failed";
          return res.json();
        })
        .then(({ token }: { token: string }) => {
          const event = new CustomEvent("auth:message", {
            bubbles: true,
            composed: true,
            detail: ["auth/signin", { token, redirect: this.redirect }]
          });
          this.dispatchEvent(event);
        })
        .catch((err) => {
          console.error(err);
          this.error = err.toString();
        });
    }
  }
}
