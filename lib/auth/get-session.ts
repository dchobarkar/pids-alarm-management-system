import { auth } from "./index";

export async function getSession() {
  return auth();
}
