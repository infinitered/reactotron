/**
 * Serialized `yarn workspaces list --json` output
 * @typedef {WorkspaceMetadata[]} WorkspaceList
 * @example [{"location":".","name":"reactotron"},{"location":"apps/reactotron-app","name":"reactotron-app"}]
 */

/**
 * yarn workspace metadata
 * @typedef {Object} WorkspaceMetadata
 * @property {string} location
 * @property {string} name
 * @example {"location":"apps/reactotron-app","name":"reactotron-app"}
 */

/**
 * Get a list of all the workspace names and locations
 */
export const getWorkspaceList = async () => {
  /** @type {WorkspaceList} */
  const workspaceMetadata = [];
  try {
    /**
     * Example output
     * ```
     * {"location":".","name":"reactotron"}\n
     * {"location":"apps/reactotron-app","name":"reactotron-app"}\n
     * {"location":"lib/reactotron-apisauce","name":"reactotron-apisauce"}\n
     * \n
     * ```
     */
    const output = await $`yarn workspaces list --json`.quiet();

    /**
     * @param {string} line
     * @returns {WorkspaceMetadata}
     */
    const parse = (line) => JSON.parse(line.trim());

    const info = output.stdout
      .split(os.EOL) // split on \n
      .filter((line) => !!line) // remove any empty lines like ''
      .map(parse)
      .filter((line) => line.location !== "."); // filter out root workspace: `{"location":".","name":"reactotron"}`

    workspaceMetadata.push(...info);
  } catch (error) {
    console.error(`Failed to get workspace names`);
    if (error instanceof ProcessOutput) {
      console.error(error.stdout);
    }
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }

  return workspaceMetadata;
};
