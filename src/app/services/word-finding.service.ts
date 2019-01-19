import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const BASE_URL = environment.similarWordsService;

export type Words = IWord[];

interface IWord {
  word: string;
  score: number;
  numSyllables: number;
}

@Injectable()
export class WordFindingService {

  constructor(private _http: HttpClient) { }

  similarWords(word: string): Observable<Words> {
    return this._http.get<Words>(`${BASE_URL}/words?sl=${word}`);
  }

}