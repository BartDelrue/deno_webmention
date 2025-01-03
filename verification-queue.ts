import { Mention } from "./types.ts";

class VerificationQueue {
  busy = false;
  queue: { mention: Mention; id: string }[] = [];
  private storage;

  constructor(storage: {
    set(value: { id: string; target: string; source: string }): void;
    delete(value: { id: string; target: string; source: string }): void;
  }) {
    this.storage = storage;
    setInterval(() => this.process(), 5 * 1000);
  }

  add(mention: Mention, id: string) {
    console.log("added to queue");
    this.queue.push({ mention, id });
  }

  async process() {
    if (this.busy) return;
    this.busy = true;

    try {
      while (this.queue.length > 0) {
        const item = this.queue.shift();
        if (!item) continue;

        const { source, target } = item.mention;
        console.log(`Processing Webmention: ${source.href} -> ${target.href}`);

        try {
          const verified = await this.verify(source, target);
          if (verified) {
            console.log("Verified:", source.href);
            this.storage.set({
              id: item.id,
              target: target.href,
              source: source.href,
            });
          }
          else {
            this.storage.delete({
              id: item.id,
              target: target.href,
              source: source.href,
            })
          }
        } catch (error) {
          console.error("Error during verification:", error);
        }
      }
    } finally {
      this.busy = false;
    }
  }

  private async verify(source: URL, target: URL): Promise<boolean> {
    const response = await fetch(source, {
      headers: {
        accept: "text/html",
      },
    });

    if (!response.ok) return false;

    const text = await response.text();

    return text.includes(target.href);
  }
}

export default VerificationQueue;
