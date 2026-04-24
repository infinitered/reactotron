/**
 * Manual test harness for Reactotron's MCP redaction engine.
 *
 * Each button emits a sensitive payload onto one of the surfaces the MCP
 * server exposes (network / redux / logs / async storage). To verify
 * redaction, read back the same data from an MCP client (e.g. Claude Code
 * via `claude mcp add --transport http reactotron http://localhost:4567/mcp`)
 * and check the values listed in the comment above each button.
 *
 * Success criteria live inline in the code, next to the payload they
 * describe. If a test begins failing, the comment tells you what SHOULD
 * happen based on the intended contract — not what's currently
 * working or broken in a specific build.
 *
 * The two-key permission model is exercised via this app's static
 * `mcpRedaction` client config in `ReactotronConfig.ts` plus the two
 * permission toggles in Reactotron's MCP settings modal.
 */
import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { useDispatch } from "react-redux"
import { Button, Text } from "app/components"
import { AppStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"
import type { AppDispatch } from "app/redux"
import { setSensitive as redactionSetSensitive } from "app/redux/redactionSlice"
import { useSafeAreaInsetsStyle } from "app/utils/useSafeAreaInsetsStyle"

interface RedactionTestScreenProps extends AppStackScreenProps<"RedactionTest"> {}

export const RedactionTestScreen: React.FC<RedactionTestScreenProps> = function RedactionTestScreen() {
  const dispatch = useDispatch<AppDispatch>()
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <ScrollView style={$container} contentContainerStyle={$bottomContainerInsets}>
      <View style={$intro}>
        <Text style={$text} preset="subheading">MCP redaction test harness</Text>
        <Text style={$hint}>
          Tap a button to emit a sensitive payload, then read it back via MCP
          (e.g. in Claude Code). Expected redaction behavior is described above
          each button in the source.
        </Text>
      </View>

      {/* ──────────────────────────────────────────────────────────────────── */}
      <Text style={$section}>Network</Text>

      {/*
        Fires an HTTPS POST carrying:
          Request headers:
            Authorization: Bearer <token>      → matches headerName "authorization" AND Bearer valuePattern
            Cookie: session=<val>              → matches headerName "cookie"
            X-Api-Key: <val>                   → matches headerName "x-api-key"
            X-Keep-Me: <val>                   → no rule, should pass through
          URL query string:
            ?api_key=<val>                     → matches sensitiveKey "api_key" in URL params
            &page=2                            → not sensitive, passes through
          Request body (JSON string):
            { password, api_key, accessToken } → sensitiveKeys
            { note: "... sk-<token> ..." }     → value pattern sk-[A-Za-z0-9]{20,}
            { user, title }                    → not sensitive

        Read `reactotron://timeline/api.response` or
             `reactotron://network/log`

        Expected on both request AND response objects:
          - headers.authorization / cookie / x-api-key → [REDACTED]
          - headers.x-keep-me                           → preserved
          - url / location include "api_key=[REDACTED]" but still show "page=2"
          - response body.password / api_key / accessToken → [REDACTED]
          - response body.title / user                     → preserved
          - any string containing sk-<20+ chars>           → the substring becomes [REDACTED]
      */}
      <Button
        text="Fire sensitive API call"
        textStyle={$darkText}
        style={$button}
        onPress={() => {
          fetch(
            "https://jsonplaceholder.typicode.com/posts?api_key=SENSITIVE_SHOULD_REDACT&page=2",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer abcdef1234567890ABCDEFGHIJ",
                Cookie: "session=sensitive-session-cookie",
                "X-Api-Key": "sensitive-x-api-key-value",
                "X-Keep-Me": "not-sensitive-header",
              },
              body: JSON.stringify({
                title: "hello",
                user: "alice",
                password: "hunter2",
                api_key: "nested-api-key",
                accessToken: "nested-access-token",
                note: "embedded token sk-AAAAAAAAAAAAAAAAAAAAAA should also be scrubbed",
              }),
            }
          )
            .then((r) => r.json())
            .then((j) => console.log("[redaction-test network]", j))
            .catch((e) => console.log("[redaction-test network] error", e))
        }}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      <Text style={$section}>Redux state</Text>

      {/*
        Dispatches redactionTest/setSensitive, replacing state.redactionTest
        with a tree containing:
          auth:
            username   → preserved (not sensitive)
            password   → sensitiveKey match
            api_key    → sensitiveKey match
            accessToken → sensitiveKey match
            tokens.access / tokens.refresh → NOT matched by default keys
              (to exercise "State Path Patterns" configured in the Reactotron
              MCP settings modal as "redactionTest.auth.tokens.*")
          settings:
            theme      → preserved
            note       → contains embedded `sk-...` and `Bearer ...`, both
                         should be redacted via value patterns

        Read via MCP tool `request_state` with path="redactionTest":
          - auth.username        → preserved
          - auth.password etc.   → [REDACTED]
          - auth.tokens.*        → [REDACTED] only if state-path pattern is
                                   active AND the pattern is anchored
                                   consistently with the requested path
          - settings.note        → embedded tokens [REDACTED]
          - settings.theme       → preserved
      */}
      <Button
        text="Poison Redux state"
        textStyle={$darkText}
        style={$button}
        onPress={() =>
          dispatch(
            redactionSetSensitive({
              auth: {
                username: "alice",
                password: "hunter2",
                accessToken: "direct-access-token",
                api_key: "direct-api-key",
                tokens: { access: "access-raw-value", refresh: "refresh-raw-value" },
              },
              settings: {
                theme: "dark",
                note: "embedded sk-ABCDEFGHIJKLMNOPQRSTUVWX and Bearer abcdef1234567890ABCDEFGH",
              },
            })
          )
        }
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      <Text style={$section}>Logging</Text>

      {/*
        Logs one string per default value pattern plus an object with
        sensitive keys. Read via `reactotron://timeline/log`.

        Expected (per line):
          "Bearer <alphanum>"   → the Bearer substring becomes [REDACTED]
          "eyJ<hdr>.eyJ<pl>"    → the header.payload portion becomes
                                  [REDACTED]; a short signature (< 10 chars)
                                  after the final dot won't match
          "sk-<20+ alphanum>"   → becomes [REDACTED]
          "ghp_<30+ alphanum>"  → becomes [REDACTED]
          "xoxb-…"              → becomes [REDACTED]

        Object:
          username              → preserved
          password / api_key / accessToken → [REDACTED]
          nested.credentials    → value replaced entirely (key match, so the
                                  whole subtree becomes [REDACTED])
      */}
      <Button
        text="Log value patterns + sensitive keys"
        textStyle={$darkText}
        style={$button}
        onPress={() => {
          console.log("Bearer header: Bearer abcdef1234567890ABCDEFGH")
          console.log("JWT: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.ShortSigHere")
          console.log("OpenAI: sk-ABCDEFGHIJKLMNOPQRSTUVWX")
          console.log("GitHub PAT: ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ012345")
          console.log("Slack: xoxb-1234567890-abcdefghij")
          console.log("Object with sensitive keys:", {
            username: "alice",
            password: "hunter2",
            api_key: "leaked",
            accessToken: "leaked",
            nested: { credentials: { token: "leaked" } },
          })
        }}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      <Text style={$section}>AsyncStorage</Text>

      {/*
        Performs a multiSet with namespaced keys that contain sensitive
        substrings, plus a value that is a JSON-stringified object
        containing sensitive fields and an embedded Bearer token.

        Read via `reactotron://asyncstorage`.

        Expected:
          - Bearer token inside the JSON-string value → [REDACTED]
                                                       (value pattern regex)

        Edge cases this surface is known to stress:
          - Bare values like "hunter2" don't match any default pattern or
            key (the enclosing `pairs` shape stores them under numeric
            sub-keys "0"/"1"), so they generally pass through. If a future
            implementation splits the key on common separators (":", "/",
            "_", ".") and treats matching segments as sensitive-key hits,
            the raw values would become [REDACTED] too.
          - A JSON-shaped string value currently only receives value-pattern
            redaction; if the implementation gains JSON-aware parsing, the
            nested `password` / `api_key` fields inside the string would
            also redact.
      */}
      <Button
        text="multiSet sensitive pairs"
        textStyle={$darkText}
        style={$button}
        onPress={() => {
          AsyncStorage.multiSet([
            ["auth:password", "hunter2"],
            ["auth:api_key", "leaked-api-key"],
            ["auth:accessToken", "leaked-access-token"],
            [
              "auth:session",
              JSON.stringify({
                password: "hunter2",
                api_key: "leaked",
                note: "Bearer abcdef1234567890ABCDEFGH",
              }),
            ],
          ])
        }}
      />

      {/* ──────────────────────────────────────────────────────────────────── */}
      <Text style={$section}>Client config (for two-key permission model)</Text>
      <Text style={$hint}>
        This app's Reactotron.configure() sends all three optional
        client-side relaxations, so the two-key model is driven entirely
        from the Reactotron desktop's MCP settings modal.
      </Text>

      {/*
        Client `mcpRedaction` is defined statically in
        `app/devtools/ReactotronConfig.ts`. See that file for the exact
        payload sent to the server on connect.

        Effective behavior depends on the desktop's two permission toggles:

          "Allow apps to disable redaction entirely" OFF / "remove default
          rules" OFF  (default):
            - `disableRedaction` ignored → redaction stays on
            - `removeRules` ignored      → defaults unchanged
            - `additionalRules` honored  → myInternalField redacts

          "disable" ON:
            - On a per-client MCP tool call with clientId, redaction is
              fully off for that client. Resource reads still fall back
              to server defaults when multi-app is connected.

          "remove default rules" ON:
            - The `authorization` header rule is removed for that client
              on per-client tool calls. Note the Bearer value pattern
              will still catch "Bearer <token>" strings.

        On a per-client MCP tool call (with clientId), the app's config
        is consulted. On MCP resource reads (no clientId) while multiple
        apps are connected, the server falls back to its defaults — this
        is the safer merge strategy across apps that may disagree.
      */}
      <Text style={$code}>disableRedaction: true</Text>
      <Text style={$code}>removeRules.headerNames: [&quot;authorization&quot;]</Text>
      <Text style={$code}>additionalRules.sensitiveKeys: [&quot;myInternalField&quot;]</Text>

      {/*
        Tap this to dispatch an action whose payload includes
        `myInternalField`. Because additionalRules always apply,
        `myInternalField` should redact in the action payload shown by
        the MCP `dispatch_action` tool's return value, regardless of
        the two permission toggles.

        Read via the return of `dispatch_action` (invoke with clientId).

        Expected:
          action.payload.myInternalField → [REDACTED]
          action.payload.publicField     → preserved
      */}
      <Button
        text="Dispatch action with myInternalField"
        textStyle={$darkText}
        style={$button}
        onPress={() =>
          dispatch({
            type: "redactionTest/additionalRulesProbe",
            payload: {
              myInternalField: "should-redact-via-additionalRules",
              publicField: "should-pass-through",
            },
          })
        }
      />
    </ScrollView>
  )
}

const $container: ViewStyle = { flex: 1, backgroundColor: colors.background }
const $intro: ViewStyle = { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.md }
const $section: TextStyle = {
  color: colors.text,
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.xl,
  paddingBottom: spacing.xs,
  fontWeight: "600",
}
const $text: TextStyle = { color: colors.text }
const $hint: TextStyle = { color: colors.textDim, fontSize: 14, marginTop: spacing.xs, paddingHorizontal: spacing.lg }
const $code: TextStyle = { color: colors.textDim, fontFamily: "monospace", paddingHorizontal: spacing.lg, paddingTop: spacing.xs }
const $darkText: TextStyle = { color: colors.textDim }
const $button: ViewStyle = { marginHorizontal: spacing.xxxl, marginTop: spacing.sm }
