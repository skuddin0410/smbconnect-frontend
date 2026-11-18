export default function Logo({ light = false }: { light?: boolean }) {
  const fg = light ? "#ffffff" : "#002364";
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="SMB Connect">
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" fill={light ? "#ffffff" : "#002364"} />
        <rect x="12" y="12" width="20" height="20" rx="5" fill="#e5a23a" />
        <rect x="12" y="12" width="10" height="10" rx="2" fill={light ? "#0a3a8c" : "#0050b8"} />
      </svg>
      <span
        className="text-[1.3rem] leading-none font-extrabold"
        style={{ color: fg, fontVariationSettings: '"wdth" 125', letterSpacing: "-0.02em" }}
      >
        SMB Connect
      </span>
    </span>
  );
}
