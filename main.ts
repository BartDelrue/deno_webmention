import controller from "./controller.ts";

Deno.serve(async (req) => {
  const { pathname, searchParams } = new URL(req.url);
  const method = req.method || "GET";
  const key = searchParams.get("key");
  const target = searchParams.get("target") || undefined;

  if (pathname !== "/") {
    return new Response(null, {
      status: 404,
    });
  }
  if (!key) {
    return new Response(JSON.stringify({message: "missing searchParam key"}), {
      status: 422,
      headers: {"content-type": "application/json"}
    });
  }

  if (method === "GET") {
    return controller.get(req, {key, target})
  }

  if (method === "POST") {
    return controller.post(req, {key})
  }

  return new Response();
});
