import { UserUpdate } from "./types"

export type Msg =
  | ["profile/get", { username: string }]
  | [
      "profile/save",
      {
        profile: UserUpdate;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ];
