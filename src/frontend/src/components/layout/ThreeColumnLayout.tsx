import type { ReactNode } from "react";

interface ThreeColumnLayoutProps {
  sidebar: ReactNode;
  editor: ReactNode;
  output: ReactNode;
}

export function ThreeColumnLayout({
  sidebar,
  editor,
  output,
}: ThreeColumnLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Sidebar — fixed 220px */}
      <aside
        className="flex-none w-[220px] h-full overflow-hidden border-r border-border glass-panel slide-in-left bg-card"
        data-ocid="sidebar.panel"
      >
        <div className="h-full overflow-y-auto scrollbar-thin">{sidebar}</div>
      </aside>

      {/* Center Editor — flex-1 (~60% of remaining width) */}
      <main
        className="flex flex-col h-full overflow-hidden border-r border-border"
        style={{ flex: "3 3 0%" }}
        data-ocid="editor.panel"
      >
        {editor}
      </main>

      {/* Right Output Panel — (~30% of remaining width) */}
      <aside
        className="flex flex-col h-full overflow-hidden"
        style={{ flex: "1.5 1.5 0%" }}
        data-ocid="output.panel"
      >
        {output}
      </aside>
    </div>
  );
}
