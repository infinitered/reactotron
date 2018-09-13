import { Request, Response } from "express"
import { read } from "fs-jetpack"
import { resolve } from "path"

const pathToIndexHtml = resolve(__dirname, "..", "..", "index.html")

/**
 * The html to display when the index.html bundled reactotron app isn't available.
 *
 * TODO(steve): something nicer plz.
 */
function noBundleContent() {
  return `
    <html>
      <head>
        <title>Reactotron</title>
      </head>
      <body>
        Unable to load index.html, make sure the bundle is created.
      </body>
    </html>
  `
}

/**
 * The reactotron entry point which powers the web app.
 */
export function createReactotronAppEndpoint(pathToPlugins: string) {
  // handle the request
  return function(req: Request, res: Response) {
    // read the content of the index.html file
    let content = read(pathToIndexHtml)

    if (content) {
      // we found it but let's "inject" our dynamic code
      // TODO(steve): this is fragile, let's harden this up once we pull in the parcel api.
      content = content.replace("</body>", `<script src="${pathToPlugins}"></script></body>`)
    } else {
      // index.html file isn't found, let's return something to help debug the problem.
      content = noBundleContent()
    }

    res.send(content)
  }
}
