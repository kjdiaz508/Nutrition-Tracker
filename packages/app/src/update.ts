import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { SubmitMealPlan, User, UserUpdate } from "./types";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "profile/get":
      loadProfile(user).then((profile) =>
        apply((model) => ({ ...model, profile }))
      );
      break;
    case "profile/save":
      saveProfile(message[1], user)
        .then((profile) => {
          apply((model) => ({ ...model, profile }));
          message[1].onSuccess?.();
        })
        .catch((err) => {
          message[1].onFailure?.(err);
        });
      break;
    case "mealplan/create":
      createMealPlan(message[1], user)
        .then((created) => {
          message[1].onSuccess?.(created._id);
        })
        .catch((err) => {
          message[1].onFailure?.(err);
        });
      break;
    default:
      throw new Error(`Unhandled Auth message "${message[0]}"`);
  }
}

function loadProfile(user: Auth.User) {
  console.log((user as Auth.AuthenticatedUser).username);
  return fetch(`/api/users/${(user as Auth.AuthenticatedUser).username}`, {
    headers: Auth.headers(user),
  })
    .then((res: Response) => {
      if (res.status === 200) {
        return res.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Profile:", json);
        return json as User;
      }
    });
}

function saveProfile(payload: { profile: UserUpdate }, user: Auth.User) {
  return fetch(`/api/users/${(user as Auth.AuthenticatedUser).username}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user),
    },
    body: JSON.stringify(payload.profile),
  })
    .then((res: Response) => {
      if (res.status === 200) {
        return res.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Profile:", json);
        return json as User;
      }
    });
}

function createMealPlan(
  payload: { mealplan: SubmitMealPlan },
  user: Auth.User
) {
  return fetch("/api/mealplans", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(payload.mealplan)
  }).then((res) => {
    if (res.status === 201) return res.json();
    throw new Error("Failed to create meal plan");
  });
}