// Simple CommonJS entry point for Node.js 22 compatibility
const plugin = require('./dist/commonjs/index.js')

// Export the plugin directly as module.exports for ESLint
module.exports = plugin.default || plugin

// Also preserve the default export for backward compatibility
module.exports.default = plugin.default || plugin
