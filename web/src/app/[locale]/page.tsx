import type {CSSProperties} from 'react';
import {notFound} from 'next/navigation';
import {isLocale} from '../../lib/locale';
import {getMessages} from '../../lib/messages';
import {paletteData,ports} from '../../lib/content';
import {LanguageSwitcher} from '../../components/LanguageSwitcher';
export default async function Page({params}:{params:Promise<{locale:string}>}) {
 const {locale}=await params;if(!isLocale(locale))notFound();
 const m=getMessages(locale), c=paletteData.palettes[paletteData.main];
 const vars=Object.fromEntries(Object.entries(c).map(([k,v])=>[`--${k}`,v])) as CSSProperties;
 return <main style={vars}><header><a href={`/${locale}`} className="wordmark">simhae <span>심해</span></a><LanguageSwitcher locale={locale} label={m.language}/></header>
 <section className="intro"><p className="eyebrow">{m.foundation}</p><h1>{m.heading}</h1><p className="lede">{m.description}</p><p className="notice">{m.notice}</p><a className="primary" href="https://github.com/spearkkk/simhae-theme">{m.repository} ↗</a></section>
 <section aria-labelledby="apps"><h2 id="apps">{m.apps}</h2><div className="ports">{ports.map(port=><article key={port.id}><p className="eyebrow">{m.portStatus[port.status]}</p><h3>{port.name}</h3><p>{port.variants.join(' · ')}</p><a href={port.installation}>{m.install} ↗</a><a className="secondary" href={port.repository}>{m.source} ↗</a></article>)}</div></section>
 <section aria-labelledby="preview"><h2 id="preview">{m.preview}</h2><div className="code"><div className="code-title">pelagic / Kotlin</div><pre><code><span className="comment">{'// '}{m.codeComment}</span>{'\n'}<span className="keyword">fun</span> <span className="function">dive</span>(depth: <span className="type">Int</span>): <span className="type">String</span> {'{\n  '}<span className="keyword">val</span> ocean = <span className="string">{'"Simhae"'}</span>{'\n  '}<span className="keyword">return</span> ocean + depth{'\n}'}</code></pre></div></section>
 <section aria-labelledby="palette"><h2 id="palette">{m.palette}</h2><p className="muted">{m.paletteNote}</p><div className="variants">{Object.entries(paletteData.palettes).map(([name,colors])=><article key={name}><h3>{name}{name===paletteData.main?<span className="badge">{m.main}</span>:null}</h3><dl className="swatches">{Object.entries(colors).map(([key,hex])=><div key={key}><dt><i aria-hidden="true" style={{backgroundColor:hex}}/>{key}</dt><dd>{hex}</dd></div>)}</dl></article>)}</div></section>
 <footer><p>{m.footer}</p><a href="https://github.com/spearkkk/deep-oceanic-next">Deep Oceanic Next ↗</a></footer></main>;
}
