export function bodyParser(body?: string): Record<string, any> {
  try {
    return body !== undefined ? JSON.parse(body) : {};
  } catch (e) {
    return {};
  }
}
