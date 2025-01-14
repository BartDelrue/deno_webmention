import service from "./service.ts";
import isURL from "./utils/isURL.ts";
import VerificationQueue from "./verification-queue.ts";
import { encodeHex } from "@std/encoding";

const verificationQueue = new VerificationQueue(service);
const secret = Deno.env.get("SECRET");

export default {

  async get(_req: Request, { key, target }: { key: string; target?: string }) {
    const result = await service.get(key, target);
    return new Response(JSON.stringify(result), {
      headers: { "content-type": "application/json" },
    });
  },

  async post(_req: Request, {key}: {key: string}) {

    const formData = await _req.formData();
    const target = isURL(formData.get("target") + "");
    const source = isURL(formData.get("source") + "");

    if (!target || !source) {
      return new Response(JSON.stringify({message: "Missing values target or source"}), {
        status: 422,
        headers: {"content-type": "application/json"}
      });
    }

    const secretBuffer = new TextEncoder().encode(target.hostname + secret);
    const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBuffer);
    const secretHash = encodeHex(secretHashBuffer);

    if (key !== secretHash) {
      return new Response(JSON.stringify({message: "invalid key"}), {
        status: 422,
        headers: {"content-type": "application/json"}
      });
    }

    verificationQueue.add({ source, target }, key);

    return new Response(null, {
      status: 202,
    });
  }
};
