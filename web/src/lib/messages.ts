import en from '../messages/en.json';
import ko from '../messages/ko.json';
import type {Locale} from './locale';
export function getMessages(locale: Locale) {return locale === 'ko' ? ko : en;}
