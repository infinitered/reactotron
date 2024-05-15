/**
 * Given a valid http(s) URL, the host for the given URL
 * is returned.
 *
 * @param url {string} URL to extract the host from
 * @returns {string} host of given URL or throws
 */
// Using a capture group to extract the hostname from a URL
export function getHostFromUrl(url: string) {
  // Group 1: http(s)://
  // Group 2: host
  // Group 3: port
  // Group 4: rest
  const host = url.match(/^(?:https?:\/\/)?(\[[^\]]+\]|[^/:\s]+)(?::\d+)?(?:[/?#]|$)/)?.[1]

  if (typeof host !== "string") throw new Error("Invalid URL - host not found")

  return host
}
