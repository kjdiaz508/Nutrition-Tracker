import { UserUpdate, SubmitMealPlan } from "./types"

export type Msg =
  | ["profile/get", { username: string }]
  | [
      "profile/save",
      {
        profile: UserUpdate;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | [
      "mealplan/create",
      {
        mealplan: SubmitMealPlan;
        onSuccess?: (id: string) => void;
        onFailure?: (err: Error) => void;
      }
    ];
