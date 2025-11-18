/**
 * This is your entry file! Refer to it when you render:
 * npx remotion render <entry-file> HelloWorld out/video.mp4
 * We add a small try/catch to avoid synchronous throws breaking Studio.
 */

import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";
import { safeLog } from "./utils/logger";

try {
  registerRoot(RemotionRoot);
} catch (err) {
  safeLog("error", "Failed to register Remotion root:", err);
}
