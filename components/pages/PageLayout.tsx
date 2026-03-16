import BlockRenderer from "@/components/blocks/BlockRenderer";
import type { DynamicBlock, Page } from "@/types/strapi";

type Layout = Page["layout"];

interface Props {
  layout: Layout;
  leftBlocks: DynamicBlock[];
  rightBlocks?: DynamicBlock[] | null;
  reverseOnMobile?: boolean;
}

/** Maps the Strapi layout enum to Tailwind grid/width classes */
const LAYOUT_CONFIG: Record<
  Layout,
  { container: string; left: string; right: string; hasTwoCols: boolean }
> = {
  "col-12": {
    container: "grid grid-cols-1",
    left: "w-full",
    right: "",
    hasTwoCols: false,
  },
  "col-6-6": {
    container: "grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16",
    left: "",
    right: "",
    hasTwoCols: true,
  },
  "col-8-4": {
    container: "grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 lg:gap-14",
    left: "",
    right: "",
    hasTwoCols: true,
  },
  "col-9-3": {
    container: "grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-10 lg:gap-14",
    left: "",
    right: "",
    hasTwoCols: true,
  },
};

export default function PageLayout({
  layout,
  leftBlocks,
  rightBlocks,
  reverseOnMobile = false,
}: Props) {
  const cfg = LAYOUT_CONFIG[layout] ?? LAYOUT_CONFIG["col-12"];

  const leftCol = (
    <div className={`space-y-8 ${cfg.left}`}>
      {leftBlocks.map((block, i) => (
        <BlockRenderer key={`l-${block.id ?? i}`} block={block} index={i} />
      ))}
    </div>
  );

  const rightCol = cfg.hasTwoCols && rightBlocks && rightBlocks.length > 0 ? (
    <div className={`space-y-8 ${cfg.right}`}>
      {rightBlocks.map((block, i) => (
        <BlockRenderer key={`r-${block.id ?? i}`} block={block} index={i} />
      ))}
    </div>
  ) : null;

  return (
    <section className="py-14 md:py-20">
      <div className="container">
        <div
          className={`${cfg.container} ${
            reverseOnMobile && rightCol ? "flex-col-reverse lg:flex-none" : ""
          }`}
        >
          {reverseOnMobile && rightCol ? (
            <>
              {/* On mobile render right col first when reverseOnMobile */}
              <div className="contents lg:hidden">
                {rightCol}
                {leftCol}
              </div>
              <div className="hidden lg:contents">
                {leftCol}
                {rightCol}
              </div>
            </>
          ) : (
            <>
              {leftCol}
              {rightCol}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
