const protocols = ["http:", "https:"];

export default function isURL(maybeUrl: string) {
  try {
    const url = new URL(maybeUrl);

    if (!protocols.includes(url.protocol)) {
      return false;
    }

    return url;
  } catch {
    return false;
  }
}
