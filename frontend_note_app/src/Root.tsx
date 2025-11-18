import { Composition } from "remotion";
import { NotesApp } from "./NotesApp";

/**
 * PUBLIC_INTERFACE
 * RemotionRoot registers compositions for the Studio.
 * We expose the NotesApp UI as a long-running composition for interactive use.
 * Composition props are constants to avoid causing Studio preview restarts.
 */
export const RemotionRoot: React.FC = () => {
  // Constants (do not derive from state or env)
  const WIDTH = 1360 as const;
  const HEIGHT = 860 as const;
  const FPS = 30 as const;
  const DURATION = 300000 as const; // Long duration to allow interactive editing in Studio

  return (
    <>
      <Composition
        id="OceanNotes"
        component={NotesApp}
        durationInFrames={DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
