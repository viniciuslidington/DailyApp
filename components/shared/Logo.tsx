type LogoProps = { size?: number };

/**
 * The Daily mark: concentric blue ring with an orange dot at "2 o'clock".
 * Sized in px so the inner ring and dot scale proportionally with `size`.
 */
export function Logo({ size = 84 }: LogoProps) {
  return (
    <div
      className="relative flex items-center justify-center bg-card rounded-full"
      style={{
        width: size,
        height: size,
        boxShadow: "var(--shadow-hero), inset 0 0 0 1px var(--color-hair)",
      }}
    >
      <div
        className="rounded-full border-blue"
        style={{
          width: size * 0.56,
          height: size * 0.56,
          borderWidth: size * 0.08,
          borderStyle: "solid",
        }}
      />
      <div
        className="absolute rounded-full bg-orange"
        style={{
          top: size * 0.18,
          right: size * 0.2,
          width: size * 0.16,
          height: size * 0.16,
          boxShadow: "0 2px 6px rgb(from var(--color-orange) r g b / 0.4)",
        }}
      />
    </div>
  );
}
