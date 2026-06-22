import {
  isAllowedProxyModule,
  proxyBackendRequest,
} from "@/shared/auth/proxy-backend-request";

type RouteContext = {
  params: Promise<{ module: string; path: string[] }>;
};

async function handleProxy(request: Request, context: RouteContext) {
  const { module, path } = await context.params;

  if (!isAllowedProxyModule(module)) {
    return new Response("Not found", { status: 404 });
  }

  return proxyBackendRequest(request, module, path);
}

export async function GET(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

export async function PUT(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

export async function PATCH(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return handleProxy(request, context);
}
