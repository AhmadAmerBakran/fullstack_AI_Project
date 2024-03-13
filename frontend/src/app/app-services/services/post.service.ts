import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseDto} from "../app-models/ResponseDto";
import {AnonymousPost, Comment, CreateComment, CreatePost, TranslateRequest} from "../app-models/PostAndCommentModels";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly baseUrl = environment.apiUrl + '/api/post/';
  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<ResponseDto<AnonymousPost[]>> {
    return this.http.get<ResponseDto<AnonymousPost[]>>(this.baseUrl + "posts");
  }

  getCommentsByPostId(postId: number): Observable<ResponseDto<Comment[]>> {
    return this.http.get<ResponseDto<Comment[]>>(this.baseUrl + postId + '/comments');
  }



  createComment(comment: {postId: number; content: any }, targetLanguage: string = 'en'): Observable<ResponseDto<CreateComment>> {
    const params = new HttpParams().set('targetLanguage', targetLanguage);
    return this.http.post<ResponseDto<CreateComment>>(environment.apiUrl + '/api/comment/create', comment, { params });
  }

  createPost(postData: CreatePost): Observable<ResponseDto<AnonymousPost>> {
    return this.http.post<ResponseDto<AnonymousPost>>(this.baseUrl + 'create', postData);
  }

}
