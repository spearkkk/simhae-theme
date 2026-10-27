import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ports } from "@/lib/content";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locale";

export function AppShowcase({ locale }: { locale: Locale }) {
  const m = getMessages(locale);

  return (
    <section className="app-showcase" aria-labelledby="app-showcase-title">
      <h2 id="app-showcase-title">{m.showcaseTitle}</h2>
      <div className="app-shot-grid">
        {ports.map((port, index) => (
          <Card key={port.id} data-port-id={port.id} className="app-shot-card">
            <CardHeader className="app-shot-header">
              <span className="app-shot-index" aria-hidden="true">0{index + 1}</span>
              <div className="app-shot-heading">
                <CardTitle><h3>{port.name}</h3></CardTitle>
                <CardDescription className="app-shot-variants">
                  {port.variants.map(variant => m.portVariants[variant]).join(" · ")}
                </CardDescription>
              </div>
              <Badge variant="outline">{m.portStatus[port.status]}</Badge>
            </CardHeader>
            {port.screenshot && (
              <CardContent className="app-shot-content">
                <div className="app-shot-art">
                  <Image
                    src={port.screenshot}
                    alt={m.appScreenshotAlt[port.id]}
                    fill
                    sizes="(max-width: 800px) 100vw, 450px"
                    className="app-shot-image"
                  />
                </div>
              </CardContent>
            )}
            <CardFooter className="app-shot-actions">
              <Button asChild size="sm">
                <a href={port.installation} target="_blank" rel="noreferrer">
                  {m.install}<ArrowUpRight data-icon="inline-end" />
                </a>
              </Button>
              <Button asChild size="sm" variant="outline">
                <a href={port.repository} target="_blank" rel="noreferrer">
                  {m.source}<ArrowUpRight data-icon="inline-end" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
