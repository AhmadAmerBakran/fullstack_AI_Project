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


  /*createComment(comment: { targetLanguage: any; postId: number; content: any }): Observable<ResponseDto<CreateComment>> {
    // Implementation may vary based on how targetLanguage is expected on the backend
    return this.http.post<ResponseDto<CreateComment>>(environment.apiUrl + '/api/comment/create', comment);
  }*/

  createComment(commentData: CreateComment & { targetLanguage?: string }): Observable<ResponseDto<CreateComment>> {
    let params = new HttpParams();
    // Only set targetLanguage if it is defined
    if (commentData.targetLanguage) {
      params = params.set('targetLanguage', commentData.targetLanguage);
    }

    // Use the correct API endpoint to create a comment
    return this.http.post<ResponseDto<CreateComment>>(
      `${environment.apiUrl}/api/comment/create`,
      commentData,
      { params }
    );
  }


  createPost(postData: CreatePost): Observable<ResponseDto<AnonymousPost>> {
    return this.http.post<ResponseDto<AnonymousPost>>(this.baseUrl + 'create', postData);
  }

}
