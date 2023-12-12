"use strict"
const noProdTron = require("./rules/no-prod-tron")

export default {
  rules: {
    "node-prod-tron": noProdTron,
  },
}
