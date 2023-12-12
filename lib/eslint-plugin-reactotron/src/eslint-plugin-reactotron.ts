const noProdTron = require("./rules/no-prod-tron");
const plugin = { rules: { "no-prod-tron": noProdTron } };
module.exports = plugin;
