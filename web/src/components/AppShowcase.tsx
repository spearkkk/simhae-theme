import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locale";

const screenshots = [
  { id: "zenBrowser", name: "Zen Browser", src: "/app-shots/zen-browser.png", width: 1636, height: 1160 },
  { id: "chrome", name: "Chrome", src: "/app-shots/chrome.png", width: 1637, height: 1155 },
  { id: "tmux", name: "tmux", src: "/app-shots/tmux.png", width: 1600, height: 1320 },
  { id: "ghostty", name: "Ghostty", detail: "fastfetch", src: "/app-shots/ghostty-fastfetch.png", width: 1610, height: 1308 },
  { id: "alfred", name: "Alfred", src: "/app-shots/alfred.png", width: 1586, height: 170 },
] as const;

export function AppShowcase({ locale }: { locale: Locale }) {
  const m = getMessages(locale);

  return (
    <section className="app-showcase" aria-labelledby="app-showcase-title">
      <h2 id="app-showcase-title">{m.showcaseTitle}</h2>
      <div className="app-shot-grid">
        {screenshots.map((shot, index) => (
          <Card key={shot.id} className={`app-shot-card${shot.id === "alfred" ? " app-shot-card--launcher" : ""}`}>
            <CardHeader className="app-shot-header">
              <span className="app-shot-index" aria-hidden="true">0{index + 1}</span>
              <CardTitle><h3>{shot.name}</h3></CardTitle>
              {"detail" in shot && <span className="app-shot-detail">{shot.detail}</span>}
            </CardHeader>
            <CardContent className="app-shot-content">
              <div className={`app-shot-art${shot.id === "alfred" ? " app-shot-art--launcher" : ""}`}>
                <Image
                  src={shot.src}
                  alt={m.appScreenshotAlt[shot.id]}
                  width={shot.width}
                  height={shot.height}
                  sizes={shot.id === "alfred" ? "(max-width: 800px) 100vw, 900px" : "(max-width: 800px) 100vw, 450px"}
                  className="app-shot-image"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
