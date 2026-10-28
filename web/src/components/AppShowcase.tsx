import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMessages } from "@/lib/messages";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/locale";

const screenshots = [
  { id: "alfred", name: "Alfred", screenshot: "/app-shots/alfred.png" },
  { id: "chrome", name: "Chrome", screenshot: "/app-shots/chrome.png" },
  { id: "ghostty-fastfetch", name: "Ghostty + Fastfetch", screenshot: "/app-shots/ghostty-fastfetch.png" },
  { id: "tmux", name: "tmux", screenshot: "/app-shots/tmux.png" },
  { id: "zen-browser", name: "Zen Browser", screenshot: "/app-shots/zen-browser.png" },
] as const;

export function AppShowcase({ locale }: { locale: Locale }) {
  const m = getMessages(locale);

  return (
    <section className="app-showcase" aria-labelledby="app-showcase-title">
      <h2 id="app-showcase-title">{m.showcaseTitle}</h2>
      <div className="app-shot-grid">
        {screenshots.map(app => (
          <Card key={app.id} data-app-id={app.id} className={cn("app-shot-card", app.id === "alfred" && "app-shot-card--launcher")}>
            <CardHeader className="app-shot-header">
              <CardTitle><h3>{app.name}</h3></CardTitle>
            </CardHeader>
            <CardContent className="app-shot-content">
              <div className={cn("app-shot-art", app.id === "alfred" && "app-shot-art--launcher")}>
                {app.id === "alfred" ? (
                  <Image
                    src={app.screenshot}
                    alt={m.appScreenshotAlt[app.id]}
                    width={1586}
                    height={170}
                    sizes="(max-width: 800px) 100vw, 450px"
                    className="app-shot-image"
                  />
                ) : (
                  <Image
                    src={app.screenshot}
                    alt={m.appScreenshotAlt[app.id]}
                    fill
                    sizes="(max-width: 800px) 100vw, 450px"
                    className="app-shot-image"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
