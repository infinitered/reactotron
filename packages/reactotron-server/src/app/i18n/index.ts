import I18n from "i18n-js"
const en = require("./en.json")

I18n.fallbacks = true
I18n.translations = { en }

/**
 * Translates text.
 *
 * @param key The translation key.
 * @param replacements Additional values sure to replace.
 */
export function translate(key: string, replacements: object = {}): string | undefined {
  return key ? I18n.t(key, replacements) : undefined
}
