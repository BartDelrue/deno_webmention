import isURL from "./utils/isURL.ts";
import VerificationQueue from "./verification-queue.ts";
import service from "./service.ts";

const verificationQueue = new VerificationQueue(service);

Deno.serve(async (req) => {
  const { pathname, searchParams } = new URL(req.url);
  const method = req.method || "GET";
  const id = searchParams.get("id");
  const target = searchParams.get("target") || undefined

  if (pathname !== "/") {
    return new Response(null, {
      status: 400,
    });
  }
  if (!id) {
    return new Response(null, {
      status: 400,
    });
  }

  if (method === "POST") {
    const formData = await req.formData();
    const target = isURL(formData.get("target") + "");
    const source = isURL(formData.get("source") + "");

    if (!target || !source) {
      return new Response(null, {
        status: 400,
      });
    }

    verificationQueue.add({ source, target }, id);

    return new Response(null, {
      status: 202,
    });
  }

  if (method === "GET") {
    const result = await service.get(id, target)
    return new Response(JSON.stringify(result), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response();
});
