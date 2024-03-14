import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseDto} from "../app-models/ResponseDto";
import {AnonymousPost} from "../app-models/PostAndCommentModels";

@Injectable({
  providedIn: 'root'
})
export class TranslateModalService {
  private readonly baseUrl = environment.apiUrl + '/api/';
  constructor(private http: HttpClient) { }

  translatePost(postId: number, targetLanguage: string | null | undefined): Observable<ResponseDto<AnonymousPost>> {
    return this.http.post<ResponseDto<AnonymousPost>>(`${this.baseUrl}post/translate/${postId}`, { targetLanguage });
  }

  translateComment(commentId: number , targetLanguage: string | null | undefined  ): Observable<ResponseDto<string>> {
    return this.http.post<ResponseDto<string>>(`${this.baseUrl}comment/translate/${commentId}`, { targetLanguage });
  }

  readPostAloud(postId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}post/tts/${postId}`, { responseType: 'blob' });
  }

  readCommentAloud(commentId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}comment/tts/${commentId}`, { responseType: 'blob' });

  }
}
