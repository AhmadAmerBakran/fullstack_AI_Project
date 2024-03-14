import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseDto} from "../app-models/ResponseDto";
import {AnonymousPost, Comment, CreateComment, CreatePost} from "../app-models/PostAndCommentModels";
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


  createComment(commentData: CreateComment & { targetLanguage?: string }): Observable<ResponseDto<CreateComment>> {
    let params = new HttpParams();
    if (commentData.targetLanguage) {
      params = params.set('targetLanguage', commentData.targetLanguage);
    }

    return this.http.post<ResponseDto<CreateComment>>(
      `${environment.apiUrl}/api/comment/create`,
      commentData,
      { params }
    );
  }


  createPost(postData: CreatePost & { targetLanguage: string }): Observable<ResponseDto<AnonymousPost>> {
    let params = new HttpParams();
    params = params.append('targetLanguage', postData.targetLanguage);

    const options = {
      params: params
    };

    const { targetLanguage, ...postDataWithoutLang } = postData;

    return this.http.post<ResponseDto<AnonymousPost>>(`${this.baseUrl}create`, postDataWithoutLang, options);
  }

}
