import { Injectable } from '@angular/core';
import {Language} from "../app-models/LanguageAndQueries";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  languages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
    { code: 'da', name: 'Danish' },
    { code: 'de', name: 'German' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'hi', name: 'Hindi' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'nl', name: 'Dutch' },
    { code: 'no', name: 'Norwegian' },
    { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'sv', name: 'Swedish' },
    { code: 'zh', name: 'Chinese' },
  ];

  constructor() { }
}
