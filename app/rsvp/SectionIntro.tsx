type SectionIntroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function SectionIntro({
  eyebrow,
  title,
  subtitle,
  className = "",
}: SectionIntroProps) {
  return (
    <div className={`grid min-h-screen grid-cols-12 gap-2 ${className}`}>
      <div className="col-start-4 col-span-6 flex flex-col items-center justify-center text-center">
        <h4 className="type-h6 text-black">{eyebrow}</h4>

        <h2 className="mt-12 font-cheyra text-[9rem] leading-[0.9] text-black">
          {title}
        </h2>

        {subtitle ? (
          <h3 className="mt-8 w-2/3 type-h3 text-black">{subtitle}</h3>
        ) : null}
      </div>
    </div>
  );
}