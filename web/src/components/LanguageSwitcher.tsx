"use client";
import type {Locale} from '../lib/locale';
export function LanguageSwitcher({locale,label}:{locale:Locale;label:string}) {
  return <nav aria-label={label} className="languages">{(['en','ko'] as const).map(lang=><a key={lang} href={`/${lang}`} hrefLang={lang} lang={lang} aria-current={locale===lang?'page':undefined} onClick={()=>{document.cookie=`simhae_locale=${lang}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol==='https:'?'; Secure':''}`;}}>{lang==='en'?'English':'한국어'}</a>)}</nav>;
}
