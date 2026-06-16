interface WaveDividerProps {
  fill: string;
  bg?: string;
  flip?: boolean;
  height?: number;
  variant?: "gentle" | "deep" | "layered";
}

export function WaveDivider({ fill, bg, flip = false, height = 88, variant = "deep" }: WaveDividerProps) {
  return (
    <div
      className="relative w-full leading-[0] block pointer-events-none select-none"
      style={{
        height,
        backgroundColor: bg ?? "transparent",
        overflow: "hidden",
        marginTop: "-2px",
        marginBottom: "-2px",
      }}
      aria-hidden="true"
    >
      {variant === "layered" ? (
        <svg
          viewBox="0 0 1440 88"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 w-full"
          style={{ height, transform: flip ? "scaleX(-1)" : undefined }}
        >
          <path
            d="M0,44 C240,88 480,0 720,44 C960,88 1200,0 1440,44 L1440,88 L0,88 Z"
            fill={fill}
            fillOpacity="0.35"
          />
          <path
            d="M0,55 C160,20 320,80 480,55 C640,30 800,78 960,50 C1120,22 1300,70 1440,55 L1440,88 L0,88 Z"
            fill={fill}
          />
        </svg>
      ) : variant === "deep" ? (
        <svg
          viewBox="0 0 1440 88"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 w-full"
          style={{ height, fill, transform: flip ? "scaleX(-1)" : undefined }}
        >
          <path d="M0,22 C120,70 240,0 360,30 C480,62 600,4 720,36 C840,68 960,6 1080,32 C1200,60 1340,8 1440,22 L1440,88 L0,88 Z" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 1440 88"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 w-full"
          style={{ height, fill, transform: flip ? "scaleX(-1)" : undefined }}
        >
          <path d="M0,44 C240,80 480,12 720,44 C960,76 1200,16 1440,44 L1440,88 L0,88 Z" />
        </svg>
      )}
    </div>
  );
}
