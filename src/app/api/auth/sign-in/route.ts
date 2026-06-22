import { handleAuthRoute } from "@/shared/auth/auth-route-handler";

export async function POST(request: Request) {
  return handleAuthRoute(request, "/auth/sign-in");
}
