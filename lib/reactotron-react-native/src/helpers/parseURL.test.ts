import { getHostFromUrl } from "./parseURL"

describe("getHostFromUrl", () => {
  it("should throw when no host is found", () => {
    expect(() => {
      getHostFromUrl("")
    }).toThrow()
  })

  it("should get host from URL without scheme", () => {
    Object.entries({
      localhost: "localhost",
      "127.0.0.1": "127.0.0.1",
    }).forEach(([host, url]) => {
      expect(getHostFromUrl(url)).toEqual(host)
    })
    expect(getHostFromUrl("localhost")).toEqual("localhost")
    expect(getHostFromUrl("127.0.0.1")).toEqual("127.0.0.1")
  })

  it("should get the host from URL with http scheme", () => {
    Object.entries({
      localhost: "http://localhost",
      "example.com": "http://example.com",
    }).forEach(([host, url]) => {
      expect(getHostFromUrl(url)).toEqual(host)
    })
  })

  it("should get the host from URL with https scheme", () => {
    Object.entries({
      localhost: "https://localhost",
      "example.com": "https://example.com",
    }).forEach(([host, url]) => {
      expect(getHostFromUrl(url)).toEqual(host)
    })
  })

  it("should get the host from URL with expo scheme for Expo Go", () => {
    Object.entries({
      localhost: "exp://localhost",
      "example.com": "exp://example.com",
    }).forEach(([host, url]) => {
      expect(getHostFromUrl(url)).toEqual(host)
    })
  })

  it("should get the host from URL and ignore path, port, and query params", () => {
    Object.entries({
      localhost:
        "http://localhost:8081/.expo/.virtual-metro-entry.bundle?platform=ios&dev=true&lazy=true&minify=false&inlineSourceMap=false&modulesOnly=false&runModule=true&app=com.reactotronapp",
      "192.168.1.141":
        "https://192.168.1.141:8081/.expo/.virtual-metro-entry.bundle?platform=ios&dev=true&lazy=true&minify=false&inlineSourceMap=false&modulesOnly=false&runModule=true&app=com.reactotronapp",
    }).forEach(([host, url]) => {
      expect(getHostFromUrl(url)).toEqual(host)
    })
  })

  it("should get the host from URL with hyphens", () => {
    expect(getHostFromUrl("https://example-app.com")).toEqual("example-app.com")
  })

  it("should throw when the URL is an unsupported scheme", () => {
    expect(() => {
      getHostFromUrl("file:///Users/tron")
    }).toThrow()
  })
})
