import { monogram, toneFor } from "@/lib/format";

export default function BusinessMark({
  id,
  title,
  logo,
  size = 56,
}: {
  id: number;
  title: string;
  logo?: string | null;
  size?: number;
}) {
  const style = { width: size, height: size, fontSize: size * 0.34 };
  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        className="shrink-0 rounded-lg border border-line bg-white object-contain p-1"
        style={style}
      />
    );
  }
  return (
    <span aria-hidden="true" className={`tile shrink-0 rounded-lg ${toneFor(id)}`} style={style}>
      {monogram(title)}
    </span>
  );
}
