import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseDto} from "../app-models/ResponseDto";
import {AnonymousPost, Comment, CreateComment, CreatePost} from "../app-models/PostAndCommentModels";
import {environment} from "../../../environments/environment";
import {TranslateRequest} from "../app-models/LanguageAndQueries";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly baseUrl = environment.apiUrl + '/api/';

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<ResponseDto<AnonymousPost[]>> {
    return this.http.get<ResponseDto<AnonymousPost[]>>(`${this.baseUrl}post/posts`);
  }

  getCommentsByPostId(postId: number): Observable<ResponseDto<Comment[]>> {
    return this.http.get<ResponseDto<Comment[]>>(`${this.baseUrl}post/${postId}/comments`);
  }

  createComment(comment: CreateComment): Observable<ResponseDto<CreateComment>> {
    return this.http.post<ResponseDto<CreateComment>>(`${this.baseUrl}comment/create`, comment);
  }

  createPost(postData: CreatePost & { targetLanguage: string }): Observable<ResponseDto<AnonymousPost>> {
    let params = new HttpParams();
    params = params.append('targetLanguage', postData.targetLanguage);

    const options = {
      params: params
    };

    const { targetLanguage, ...postDataWithoutLang } = postData;

    return this.http.post<ResponseDto<AnonymousPost>>(`${this.baseUrl}post/create`, postDataWithoutLang, options);
  }


  translatePost(postId: number, request: TranslateRequest): Observable<ResponseDto<string>> {
    return this.http.post<ResponseDto<string>>(`${this.baseUrl}post/translate/${postId}`, request);
  }


  translateComment(commentId: number, request: TranslateRequest): Observable<ResponseDto<string>> {
    return this.http.post<ResponseDto<string>>(`${this.baseUrl}comment/translate/${commentId}`, request);
  }

  readPostAloud(postId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}post/tts/${postId}`, { responseType: 'blob' });
  }

  readCommentAloud(commentId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}comment/tts/${commentId}`, { responseType: 'blob' });
  }
}
