import { Composition } from "remotion";
import { NotesApp } from "./NotesApp";

/**
 * PUBLIC_INTERFACE
 * RemotionRoot registers compositions for the Studio.
 * We expose the NotesApp UI as a long-running composition for interactive use.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OceanNotes"
        component={NotesApp}
        durationInFrames={300000} // Long duration to allow interactive editing in Studio
        fps={30}
        width={1360}
        height={860}
      />
    </>
  );
};
