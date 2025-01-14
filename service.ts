const kv = await Deno.openKv();

export default {
  set({ id, target, source }: { id: string; target: string; source: string }) {
    kv.set([id, target, source], new Date());
  },

  delete(
    { id, target, source }: { id: string; target: string; source: string },
  ) {
    kv.delete([id, target, source]);
  },

  async get(id: string, target?: string) {
    const prefix = [id];
    if (target) prefix.push(target.replace(/\/$/, ""));

    const entries = kv.list({ prefix });

    const mentions = [];
    for await (const entry of entries) mentions.push(entry);

    return { id, target, mentions: mentions.length };
  },
};
