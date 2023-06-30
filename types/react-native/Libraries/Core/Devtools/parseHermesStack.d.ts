declare module "react-native/Libraries/Core/Devtools/parseHermesStack" {
  type HermesStackLocationNative = Readonly<{
    type: "NATIVE";
  }>;
  type HermesStackLocationSource = Readonly<{
    type: "SOURCE";
    sourceUrl: string;
    line1Based: number;
    column1Based: number;
  }>;
  type HermesStackLocationInternalBytecode = Readonly<{
    type: "INTERNAL_BYTECODE";
    sourceUrl: string;
    line1Based: number;
    virtualOffset0Based: number;
  }>;
  type HermesStackLocationBytecode = Readonly<{
    type: "BYTECODE";
    sourceUrl: string;
    line1Based: number;
    virtualOffset0Based: number;
  }>;
  type HermesStackLocation =
    | HermesStackLocationNative
    | HermesStackLocationSource
    | HermesStackLocationInternalBytecode
    | HermesStackLocationBytecode;
  type HermesStackEntryFrame = Readonly<{
    type: "FRAME";
    location: HermesStackLocation;
    functionName: string;
  }>;
  type HermesStackEntrySkipped = Readonly<{
    type: "SKIPPED";
    count: number;
  }>;
  type HermesStackEntry = HermesStackEntryFrame | HermesStackEntrySkipped;

  export type HermesParsedStack = Readonly<{
    message: string;
    entries: ReadonlyArray<HermesStackEntry>;
  }>;

  function parseHermesStack(stack: string): HermesParsedStack;

  export default parseHermesStack;
}
