import "./index.css";
import { Composition, staticFile, AbsoluteFill, interpolate, useCurrentFrame, spring } from "remotion";
import { Video } from "@remotion/media";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";

const BabySelfieScene = ({ src }: { src: string }) => {
  const frame = useCurrentFrame();

  const scenes = [
    { start: 0, end: 60, expression: "Waving", text: "👋 Waving" },
    { start: 60, end: 120, expression: "Blowing kisses", text: "💋 Blowing kisses" },
    { start: 120, end: 180, expression: "Squeezing cheeks", text: "😚 Squeezing cheeks" },
    { start: 180, end: 240, expression: "Laughing", text: "😄 Laughing" },
    { start: 240, end: 300, expression: "Final smile", text: "✨ Final smile" },
  ];

  const getCurrentScene = () => {
    for (const scene of scenes) {
      if (frame >= scene.start && frame < scene.end) {
        return scene;
      }
    }
    return scenes[scenes.length - 1];
  };

  const currentScene = getCurrentScene();
  const sceneIndex = scenes.indexOf(currentScene);
  const nextScene = scenes[sceneIndex + 1];

  const transitionStart = currentScene.end - 30;
  const isTransitioning = frame >= transitionStart && nextScene;
  const transitionProgress = isTransitioning ? interpolate(frame, [transitionStart, currentScene.end], [0, 1]) : 0;

  const scale = spring({ frame: frame % 30, fps: 30 });

  return (
    <AbsoluteFill style={{ background: "white" }}>
      <div style={{
        position: "absolute",
        top: 20,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 32,
        fontWeight: "bold",
        color: "#333",
        fontFamily: "system-ui"
      }}>
        {currentScene.text}
      </div>

      <div style={{
        position: "absolute",
        bottom: 100,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 24,
        color: "#666",
        fontFamily: "system-ui"
      }}>
        Baby in yellow basketball jersey with black velvet mother
      </div>

      <Video
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          opacity: isTransitioning ? 1 - transitionProgress : 1,
          transform: `scale(${1 + scale * 0.05})`,
        }}
      />

      {nextScene && (
        <Video
          src={src}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: transitionProgress,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        calculateMetadata={calculateCaptionedVideoMetadata}
        schema={captionedVideoSchema}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("sample-video.mp4"),
        }}
      />
      <Composition
        id="BabySelfie"
        component={BabySelfieScene}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          src: staticFile("sample-video.mp4"),
        }}
      />
    </>
  );
};