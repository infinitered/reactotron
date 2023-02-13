#!/usr/bin/env zx
// @ts-check
import "zx/globals";
import { getLocalTags, getRemoteTags } from "./tools/git.mjs";

const localTags = await getLocalTags();
const remoteTags = await getRemoteTags();

const isCi = process.env.CI === "true";

// find all the tags that are local but not remote
const tagsToPush = localTags.filter((tag) => !remoteTags.includes(tag));

if (tagsToPush.length === 0) {
  console.log(`No tags to push`);
  process.exit(0);
}

console.log(
  `${tagsToPush.length} tag(s) to push: ${os.EOL}${tagsToPush.join(", ")}${
    os.EOL
  }`
);

console.log("Pushing tags one at a time");
console.log(
  "This is because github does not trigger webhooks when pushing more than 3 tags at once"
);
console.log(
  "'https://support.circleci.com/hc/en-us/articles/360052198651-When-I-Push-4-or-More-Tags-in-a-Single-Push-No-CircleCI-Workflows-Are-Triggered'"
);
console.log(os.EOL);

for (const tag of tagsToPush) {
  console.log(`Pushing tag: '${tag}'`);
  if (isCi) {
    await $`git push origin ${tag}`.quiet();
  } else {
    console.log("Not in CI, skipping push");
  }
}
