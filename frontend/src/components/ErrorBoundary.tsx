import { Component, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;

    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return <ErrorFallback error={error} onReset={this.reset} />;
  }
}

function ErrorFallback({
  error,
  onReset,
}: {
  error: Error;
  onReset: () => void;
}) {
  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden px-6 py-20">
      {/* Ambient blob */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-destructive/8 blur-[90px]"
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, filter: "blur(16px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.65, ease: ease.spring }}
        className="mb-6 select-none"
        style={{ fontSize: "clamp(3rem, 10vw, 5rem)", lineHeight: 1 }}
        aria-hidden
      >
        🔥
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: ease.out, delay: 0.18 }}
        className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground text-center"
      >
        Something went wrong
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: ease.out, delay: 0.3 }}
        className="mt-4 text-muted-foreground text-base sm:text-lg text-center max-w-md leading-relaxed"
      >
        An unexpected error occurred. Our chefs are already looking into it —
        try refreshing the page or head back home.
      </motion.p>

      {/* Error detail (dev-friendly, collapsed) */}
      <motion.details
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-6 w-full max-w-lg rounded-2xl border border-border bg-card p-4 text-sm"
      >
        <summary className="cursor-pointer font-medium text-muted-foreground select-none">
          Error details
        </summary>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-xs text-destructive font-mono leading-relaxed">
          {error.message}
          {error.stack ? `\n\n${error.stack}` : ""}
        </pre>
      </motion.details>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: ease.out, delay: 0.4 }}
        className="mt-8 flex gap-3 flex-wrap justify-center"
      >
        <motion.button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-lg hover:shadow-primary/30 transition-shadow"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Try again
        </motion.button>

        <motion.button
          onClick={() => {
            onReset();
            window.location.href = "/";
          }}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-accent transition-colors"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Go home
        </motion.button>
      </motion.div>

      {/* Dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="mt-14 flex gap-2"
        aria-hidden
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary/40"
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
