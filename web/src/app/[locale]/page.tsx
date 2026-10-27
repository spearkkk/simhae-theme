import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import oceanImage from "@/assets/ocean-hero.png";
import { Separator } from "@/components/ui/separator";
import { SiteHeader } from "@/components/SiteHeader";
import { InformationPanel } from "@/components/InformationPanel";
import { AppShowcase } from "@/components/AppShowcase";
import { PalettePreview } from "@/components/PalettePreview";
import { paletteData } from "@/lib/content";
import { isLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const colors = paletteData.palettes[paletteData.main];

  return (
    <>
      <SiteHeader locale={locale} languageLabel={m.language} />
      <main className="landing">
        <section id="ocean" className="ocean-hero" aria-label="Simhae">
          <Image src={oceanImage} alt="" fill preload sizes="100vw" className="ocean-image" />
          <div className="ocean-shade" aria-hidden="true" />
          <a href="#information" className="scroll-cue">
            <span>{m.scrollToExplore}</span>
            <ArrowDown size={16} aria-hidden="true" />
          </a>
        </section>
        <InformationPanel>
            <section className="theme-story" aria-labelledby="story-title">
              <h3 id="story-title">{m.storyTitle}</h3>
              <div className="story-body">
                {m.storyParagraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>

            <Separator className="palette-separator" />
            <PalettePreview colors={colors} locale={locale} />

            <section className="editor-preview" aria-labelledby="preview">
              <h2 id="preview">{m.preview}</h2>
              <div className="code">
                <div className="code-title">
                  <span className="editor-lights" aria-hidden="true"><i /><i /><i /></span>
                  <span>Ocean.kt</span>
                  <span className="editor-theme">Simhae</span>
                </div>
                <div className="code-body">
                  <div className="code-lines" aria-hidden="true">1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />10</div>
                  <pre><code>
                    <span className="comment">{"// "}{m.codeComment}</span>{"\n"}
                    <span className="annotation">@</span><span className="deprecated">Deprecated</span>{"(\"legacyDepth\")\n"}
                    <span className="keyword">data class</span>{" "}<span className="type">Dive</span>{"(\n  "}
                    <span className="keyword">val</span>{" "}<span className="variable">depth</span>{": "}<span className="type">Int</span>{" = "}<span className="number">3840</span>{",\n  "}
                    <span className="keyword">val</span>{" "}<span className="property">light</span>{": "}<span className="type">String</span>{" = "}<span className="string">{"\"blue"}</span><span className="escape">{"\\n"}</span><span className="string">{"abyss\""}</span>{"\n)\n\n"}
                    <span className="keyword">fun</span>{" "}<span className="function">observe</span>{"(dive: "}<span className="type">Dive</span>{"): "}<span className="type">String</span>{" =\n  "}
                    <span className="keyword">if</span>{" (dive.depth > "}<span className="number-bright">1000</span>{") "}<span className="string">{"\""}</span><span className="escape">{"\\u001B"}</span><span className="string">{"light fades\""}</span>{"\n  "}
                    <span className="keyword">else</span>{" "}<span className="function">describe</span>{"("}<span className="selected-token">dive</span>{")"}
                  </code></pre>
                </div>
                <div className="code-status">
                  <span className="status-brand">Simhae</span>
                  <span className="status-indicators" aria-label="Editor status">
                    <span className="status-error"><i />1</span>
                    <span className="status-warning"><i />2</span>
                    <span className="status-success"><i />3</span>
                    <span className="status-accent"><i />7</span>
                  </span>
                  <span>UTF-8 · Kotlin</span>
                </div>
              </div>
            </section>

            <AppShowcase locale={locale} />

            <footer>
              <p>{m.footer}</p>
              <a href="https://github.com/spearkkk/simhae-theme">{m.footerLink} ↗</a>
            </footer>
        </InformationPanel>
        <section className="ocean-return" aria-hidden="true">
          <div className="ocean-return-scene">
            <Image src={oceanImage} alt="" fill sizes="100vw" className="ocean-return-image" />
            <div className="ocean-return-shade" aria-hidden="true" />
            <div className="ocean-ending">
              <span>{m.endingLabel}</span>
              <Separator className="ocean-ending-separator" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
