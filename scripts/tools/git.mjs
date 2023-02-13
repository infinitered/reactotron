import "zx/globals";
// @ts-check

import { ROOT_DIR } from "./path.mjs";

/**
 * Sorry for this horrible regex, but it's the only one I could find that worked
 * @see https://gist.github.com/jhorsman/62eeea161a13b80e39f5249281e17c39
 * @example 'v1.1.1'
 * @example 'reactotron-app@3.0.0'
 * @example 'reactotron-apisauce@3.0.1-alpha.1'
 */
export const GIT_TAG_REGEX =
  /([\w-]+@|v)([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?/g; // 'reactotron-app@3.0.0'

/**
 * Example inputs:
 *
 * `0a2af725bcb7e92397ffa6fd865220840a2013d        refs/tags/v2.8.0-beta.2@beta`
 *
 * `a1d7577938005b5a6bfd3b6a82cdb3439ff254ce        refs/tags/v2.8.1`
 *
 * `456b8aea8c243a29463f2dadf49bb7e63bbeacac        refs/tags/v2.8.10`
 *
 * `77716bb4e3146d8b220c9e3c97f3aef4b2825d12        refs/tags/reactotron-apisauce@3.0.0`
 *
 * `d1da997c9105c226533192e013de713f18a74c0f        refs/tags/reactotron-apisauce@3.0.1-alpha.1^{}`
 *
 * @param line {string}
 */
const parseTag = (line) => {
  const tag = line.match(GIT_TAG_REGEX);
  return tag ? tag[0] : null;
};

const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

/**
 * Grabs all the tags in the local repository.
 * @returns {Promise<string[]>}
 */
export const getLocalTags = async () => {
  const tags = await $`cd ${ROOT_DIR} && git show-ref --tags`.quiet();
  return tags.stdout
    .split(os.EOL)
    .map(parseTag)
    .filter((tag) => !!tag)
    .filter(unique);
};

/**
 * Grabs all the tags from the remote origin.
 * Assumes that you have already run `git fetch --tags`
 * @returns {Promise<string[]>}
 */
export const getRemoteTags = async () => {
  const tags = await $`cd ${ROOT_DIR} && git ls-remote --tags origin`.quiet();

  return tags.stdout
    .split(os.EOL)
    .map(parseTag)
    .filter((tag) => !!tag)
    .filter(unique);
};
