import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {isLocale} from '../../lib/locale';
import {getMessages} from '../../lib/messages';
import '../globals.css';
export const dynamicParams = false;
export function generateStaticParams() {return [{locale:'en'},{locale:'ko'}];}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata> {
  const {locale}=await params;
  if(!isLocale(locale))notFound();
  const m=getMessages(locale);
  const base=process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');
  return {metadataBase:new URL(base),title:'Simhae — 심해',description:m.description,alternates:{canonical:`/${locale}`,languages:{en:'/en',ko:'/ko','x-default':'/'}},openGraph:{title:'Simhae — 심해',description:m.description,locale:locale==='ko'?'ko_KR':'en_US',alternateLocale:locale==='ko'?'en_US':'ko_KR'}};
}
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}) {
  const {locale}=await params;if(!isLocale(locale))notFound();
  return <html lang={locale}><body>{children}</body></html>;
}
