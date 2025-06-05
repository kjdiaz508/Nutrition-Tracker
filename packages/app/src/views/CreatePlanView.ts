import { css, html } from "lit";
import { state } from "lit/decorators.js";
import reset from "../styles/reset.css";
import { View, Form, define, Observer } from "@calpoly/mustang";
import { RecipePreview, MealDay, SubmitMealPlan } from "../types";
import { Msg } from "../messages";
import { Model } from "../model";
import { Auth } from "@calpoly/mustang";

export class CreatePlanView extends View<Model, Msg> {
  static uses = define({ "mu-form": Form.Element });

  @state() name = "";
  @state() isPublic = false;
  @state() days: MealDay[] = [];
  @state() recipes: RecipePreview[] = [];

  static styles = [
    reset.styles,
    css`
      label {
        display: block;
        margin-bottom: 1rem;
      }

      select {
        width: 100%;
      }

      button {
        font: inherit;
        margin-top: var(--space-sm);
        background-color: var(--color-accent);
        color: white;
        padding: var(--space-sm) var(--space-md);
        border: none;
        border-radius: 6px;
        font-weight: bold;
        transition: background-color 0.2s ease;
      }

      button:hover {
        background-color: #c75c1d;
      }
    `,
  ];

  constructor() {
    super("mpn:model");
  }

  _authObserver = new Observer<Auth.Model>(this, "mpn:auth");
  _user?: Auth.User;

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: Auth.Model) => {
      this._user = auth.user;
      this.hydrate();
    });
  }

  get authorization(): { Authorization?: string } {
    if (this._user && this._user.authenticated)
      return {
        Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`,
      };
    else return {};
  }

  async hydrate() {
    fetch("/api/recipes", { headers: this.authorization })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        this.recipes = data;
      })
      .catch((err) => {
        console.error("Error fetching recipes:", err);
      });
  }

  addDay() {
    this.days = [...this.days, { weekday: "", recipes: [] }];
  }

  updateDay(index: number, key: "weekday", value: string): void;
  updateDay(index: number, key: "recipes", value: string[]): void;
  updateDay(index: number, key: "weekday" | "recipes", value: any) {
    this.days = this.days.map((day, i) =>
      i === index ? { ...day, [key]: value } : day
    );
  }

  handleSubmit() {
    const submitDays = this.days.map((day) => ({
      weekday: day.weekday,
      recipes: day.recipes.map((r) => (typeof r === "string" ? r : r._id)),
    }));

    const mealplan: SubmitMealPlan = {
      name: this.name,
      public: this.isPublic,
      days: submitDays,
    };

    this.dispatchMessage([
      "mealplan/create",
      {
        mealplan,
        onSuccess: (id: string) => {
          location.assign(`/app/my-plans/${id}`);
        },
        onFailure: (err: Error) => {
          console.error("Meal plan creation failed:", err);
        },
      },
    ]);
  }

  render() {
    return html`
      <mpn-header title="Create Meal Plan"></mpn-header>
      <mpn-main-grid>
        <mpn-card class="col-span-12">
          <mu-form @mu-form:submit=${this.handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                .value=${this.name}
                @input=${(e: Event) =>
                  (this.name = (e.target as HTMLInputElement).value)}
                required
              />
            </label>

            <label>
              <input
                type="checkbox"
                .checked=${this.isPublic}
                @change=${(e: Event) =>
                  (this.isPublic = (e.target as HTMLInputElement).checked)}
              />
              Make plan public
            </label>

            ${this.days.map(
              (day, i) => html`
                <mpn-card>
                  <label>
                    Weekday:
                    <input
                      type="text"
                      name="weekday-${i}"
                      .value=${day.weekday}
                      @input=${(e: Event) =>
                        this.updateDay(
                          i,
                          "weekday",
                          (e.target as HTMLInputElement).value
                        )}
                    />
                  </label>

                  <label>
                    Recipes:
                    <select
                      multiple
                      @change=${(e: Event) => {
                        const selected = Array.from(
                          (e.target as HTMLSelectElement).selectedOptions
                        ).map((opt) => opt.value);
                        const selectedRecipes = this.recipes.filter((r) =>
                          selected.includes(r._id)
                        );
                        this.updateDay(
                          i,
                          "recipes",
                          selectedRecipes.map((recipe) => recipe._id)
                        );
                      }}
                    >
                      ${this.recipes.map(
                        (r) => html`<option value=${r._id}>${r.name}</option>`
                      )}
                    </select>
                  </label>
                </mpn-card>
              `
            )}

            </mu-form>
          <button type="button" @click=${this.addDay}>Add Day</button>
        </mpn-card>
      </mpn-main-grid>
    `;
  }
}
