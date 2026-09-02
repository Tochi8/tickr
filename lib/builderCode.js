import { Attribution } from "ox/erc8021";

export const BUILDER_CODE =
  process.env.NEXT_PUBLIC_BUILDER_CODE || "REPLACE_WITH_BASE_DEV_CODE";

export function getDataSuffix() {
  if (!BUILDER_CODE || BUILDER_CODE.startsWith("REPLACE_")) return undefined;
  try {
    return Attribution.toDataSuffix({ codes: [BUILDER_CODE] });
  } catch (error) {
    console.warn("Builder Code suffix failed", error);
    return undefined;
  }
}
