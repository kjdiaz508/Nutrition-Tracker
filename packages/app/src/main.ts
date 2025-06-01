import { Auth, define, History, Switch } from "@calpoly/mustang";
import { html } from "lit";
import { PageHeaderElement } from "./components/PageHeader";
import { CardElement } from "./components/Card";
import { MainGridElement } from "./components/MainGrid";
import { HomeView } from "./views/HomeView";
import { ButtonLinkElement } from "./components/ButtonLink";
import { LoginView } from "./views/LoginView";
import { LoginFormElement } from "./components/LoginForm";
import { PlanView } from "./views/PlanView";
import { MealPlanElement } from "./components/MealPlan";
import { MealDayElement } from "./components/MealDay";
import { RecipeLinkElement } from "./components/RecipeLink";
import { SharedPlansView } from "./views/SharedPlansView";

const routes = [
  {
    path: "/",
    redirect: "/app",
  },
  {
    path: "/app",
    view: () => html`<home-view></home-view>`,
  },
  {
    path: "/app/login",
    view: () => html`<login-view></login-view>`,
  },
  {
    path: "/app/sign-up",
    view: () => html`<signup-view></signup-view>`,
  },
  {
    path: "/app/profile",
    view: () => html`<profile-view></profile-view>`,
  },
  {
    path: "/app/my-plans",
    view: () => html`<my-plans-view></my-plans-view>`,
  },
  {
    path: "/app/my-plans/:id",
    view: (params: Switch.Params) => html`
      <plan-view id=${params.id}></plan-view>
    `,
  },
  {
    path: "/app/my-recipes",
    view: () => html`<my-recipes-view></my-recipes-view>`,
  },
  {
    path: "/app/my-recipes/:id",
    view: (params: Switch.Params) => html`
      <recipe-view id=${params.id}></recipe-view>
    `,
  },
  {
    path: "/app/discover",
    redirect: "/app/discover/plans",
  },
  {
    path: "/app/discover/plans",
    view: () => html` <shared-plans-view></shared-plans-view> `,
  },
  {
    path: "/app/discover/plans/:id",
    view: (params: Switch.Params) => html`
      <plan-view id=${params.id}></plan-view>
    `,
  },
  {
    path: "/app/discover/recipes",
    view: () => html`<shared-recipes-view></shared-recipes-view>`,
  },
  {
    path: "/app/discover/recipes/:id",
    view: (params: Switch.Params) => html`
      <recipe-view id=${params.id}></recipe-view>
    `,
  },
  {
    path: "/app/create",
    view: () => html`<create-view></create-view>`,
  },
];

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mpn-header": PageHeaderElement,
  "mpn-card": CardElement,
  "mpn-main-grid": MainGridElement,
  "mpn-button-link": ButtonLinkElement,
  "mpn-meal-plan": MealPlanElement,
  "mpn-meal-day": MealDayElement,
  "mpn-recipe-link": RecipeLinkElement,
  "login-form": LoginFormElement,

  "home-view": HomeView,
  "login-view": LoginView,
  "plan-view": PlanView,
  "shared-plans-view": SharedPlansView,

  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "mpn:history", "mpn:auth");
    }
  },
});
