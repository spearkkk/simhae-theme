import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMessages } from "@/lib/messages";
import type { Locale } from "@/lib/locale";
import { ColorSwatch } from "@/components/ColorSwatch";

const groups = [
  { id: "foundation", keys: ["base00", "base01", "base02", "base03", "base04", "base05", "base06", "base07"] },
  { id: "syntax", keys: ["base08", "base09", "base0A", "base0B", "base0C", "base0D", "base0E", "base0F"] },
  { id: "extended", keys: ["base10", "base11", "base12", "base13", "base14", "base15", "base16", "base17"] },
] as const;

export function PalettePreview({ colors, locale }: { colors: Record<string, string>; locale: Locale }) {
  const m = getMessages(locale);
  return (
    <section className="palette-preview" aria-labelledby="palette">
      <h2 id="palette">{m.palette}</h2>
      <p className="muted">{m.paletteNote}</p>
      <div className="variants">
        {groups.map(group => (
          <Card key={group.id} className="palette-group">
            <CardHeader>
              <CardTitle><h3>{m.paletteGroups[group.id]}</h3></CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="palette-grid">
                {group.keys.map(key => (
                  <div key={key} className="palette-entry">
                    <dt>
                      <ColorSwatch hex={colors[key]} role={m.paletteRoles[key]} copyLabel={m.copyColor} copiedMessage={m.colorCopied} errorMessage={m.colorCopyError} />
                      <span className="palette-role">{m.paletteRoles[key]}</span>
                    </dt>
                    <dd><span>{key}</span><span>{colors[key]}</span></dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
