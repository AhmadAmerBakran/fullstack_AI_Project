import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
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

  createComment(comment: CreateComment) : Observable<ResponseDto<CreateComment>> {
    return this.http.post<ResponseDto<CreateComment>>(environment.apiUrl + '/api/comment/create', comment);
  }

  createPost(postData: CreatePost): Observable<ResponseDto<AnonymousPost>> {
    return this.http.post<ResponseDto<AnonymousPost>>(this.baseUrl + 'create', postData);
  }

}
