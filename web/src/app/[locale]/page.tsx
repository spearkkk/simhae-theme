import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { paletteData, ports } from "@/lib/content";
import { isLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);

  return (
    <main>
      <header>
        <a href={`/${locale}`} className="wordmark">simhae <span>심해</span></a>
        <LanguageSwitcher locale={locale} label={m.language} />
      </header>
      <Separator />
      <section className="intro">
        <p className="eyebrow">{m.foundation}</p>
        <h1>{m.heading}</h1>
        <p className="lede">{m.description}</p>
        <Alert className="my-6">
          <AlertDescription>{m.notice}</AlertDescription>
        </Alert>
        <Button asChild size="lg">
          <a href="https://github.com/spearkkk/simhae-theme">
            {m.repository}<ArrowUpRight data-icon="inline-end" />
          </a>
        </Button>
      </section>

      <section aria-labelledby="apps">
        <h2 id="apps">{m.apps}</h2>
        <div className="ports">
          {ports.map(port => (
            <article key={port.id}>
              <Card className="h-full">
                <CardHeader>
                  <Badge variant="outline">{m.portStatus[port.status]}</Badge>
                  <CardTitle><h3>{port.name}</h3></CardTitle>
                  <CardDescription>{port.variants.join(" · ")}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto gap-2">
                  <Button asChild size="sm">
                    <a href={port.installation}>{m.install}<ArrowUpRight data-icon="inline-end" /></a>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <a href={port.repository}>{m.source}<ArrowUpRight data-icon="inline-end" /></a>
                  </Button>
                </CardFooter>
              </Card>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="preview">
        <h2 id="preview">{m.preview}</h2>
        <div className="code">
          <div className="code-title">pelagic / Kotlin</div>
          <pre><code>
            <span className="comment">{"// "}{m.codeComment}</span>{"\n"}
            <span className="keyword">fun</span>{" "}<span className="function">dive</span>
            {"(depth: "}<span className="type">Int</span>{"): "}<span className="type">String</span>{" {\n  "}
            <span className="keyword">val</span>{" ocean = "}<span className="string">{'"Simhae"'}</span>{"\n  "}
            <span className="keyword">return</span>{" ocean + depth\n}"}
          </code></pre>
        </div>
      </section>

      <section aria-labelledby="palette">
        <h2 id="palette">{m.palette}</h2>
        <p className="muted">{m.paletteNote}</p>
        <div className="variants">
          {Object.entries(paletteData.palettes).map(([name, colors]) => (
            <Card key={name}>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-3">
                    <h3>{name}</h3>
                    {name === paletteData.main ? <Badge variant="secondary">{m.main}</Badge> : null}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="swatches">
                  {Object.entries(colors).map(([key, hex]) => (
                    <div key={key}>
                      <dt><i aria-hidden="true" style={{ backgroundColor: hex }} />{key}</dt>
                      <dd>{hex}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <Separator />
      <footer>
        <p>{m.footer}</p>
        <a href="https://github.com/spearkkk/deep-oceanic-next">Deep Oceanic Next ↗</a>
      </footer>
    </main>
  );
}
