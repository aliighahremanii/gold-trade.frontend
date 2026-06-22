import { handleAuthRoute } from "@/shared/auth/auth-route-handler";

export async function POST() {
  return handleAuthRoute(new Request("http://localhost/api/auth/sign-out"), "/auth/sign-out");
}
