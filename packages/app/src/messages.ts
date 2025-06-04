import { UserUpdate } from "./types"

export type Msg =
 | ["profile/get", { username: string }]
 | ["profile/save", { profile: UserUpdate}]