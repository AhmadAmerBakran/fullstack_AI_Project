import {Component, OnInit} from '@angular/core';
import {AnonymousPost, Comment, CreateComment} from "../app-services/app-models/PostAndCommentModels";
import {PostService} from "../app-services/services/post.service";
import {ClientMessageService} from "../app-services/services/client-message.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CreatePostModalComponent} from "./components/create-post-modal/create-post-modal.component";
import {ModalController} from "@ionic/angular";
import {TranslateModalComponent} from "./components/translate-modal/translate-modal.component";
import {TranslateModalService} from "../app-services/services/translate-modal.service";
import {Language} from "../app-services/app-models/LanguageAndQueries";
import {LanguageService} from "../app-services/services/language.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  languages: Language[] ;
  posts: AnonymousPost[] = [];
  comments: Comment[] = [];
  commentForms: { [key: number]: FormGroup } = {};
  newCommentForm: FormGroup;
  constructor(
    private postService: PostService,
    private clientMessage: ClientMessageService,
    private modalCtrl: ModalController,
    private translateService: TranslateModalService,
    private languageService: LanguageService,
    ) {
    this.languages = this.languageService.languages;
    this.newCommentForm = new FormGroup({
      content: new FormControl('', [Validators.required]),
      language: new FormControl('en', [Validators.required])
    });
  }



  ngOnInit(): void {
    this.postService.getAllPosts().subscribe({
      next: (response) => {
        if (response.responseData) {
          this.posts = response.responseData;
          this.posts.forEach(post => {
            this.commentForms[post.id] = new FormGroup({
              postId: new FormControl(post.id, [Validators.required]),
              content: new FormControl('', [Validators.required]),
              publishDate: new FormControl(new Date())
            });
          });
        } else {
          this.clientMessage.showInfo("No posts available");
        }
      },
      error: (err) => {
        this.clientMessage.showError(err.error?.message);
      }
    });
  }

  loadComments(postId: number): void {
    this.postService.getCommentsByPostId(postId).subscribe({
      next: (response) => {
        if (response.responseData) {
          this.comments = response.responseData.map(comment => ({
            ...comment,
            postId: postId
          }));
        } else {
          this.clientMessage.showInfo("No comments available");
        }
      },
      error: (err) => {
        this.clientMessage.showInfo("No comments available");
      }
    });
  }

  submitComment(postId: number): void {
    if (this.newCommentForm.valid) {
      const content = this.newCommentForm.get('content')?.value;
      const targetLanguage = this.newCommentForm.get('language')?.value;

      const commentData: CreateComment & { targetLanguage?: string } = {
        postId: postId,
        content: content,
        targetLanguage: targetLanguage
      };

      this.postService.createComment(commentData).subscribe({
        next: (response) => {
          this.clientMessage.showInfo("Comment successfully added");
          const post = this.posts.find(p => p.id === postId);
          if (post) {
            post.commentCount += 1;
          }
          this.loadComments(postId);
          this.newCommentForm.reset();
        },
        error: (error) => {
          console.error("Error creating comment:", error);
          this.clientMessage.showError("Failed to add comment. Please try again.");
        }
      });
    }
  }

  async presentCreatePostModal() {
    const modal = await this.modalCtrl.create({
      component: CreatePostModalComponent
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.reload) {
      this.reloadPosts();
    }
  }

  reloadPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (response) => {
        if (response.responseData) {
          this.posts = response.responseData;
          this.posts.forEach(post => {
            this.commentForms[post.id] = new FormGroup({
              postId: new FormControl(post.id, [Validators.required]),
              content: new FormControl('', [Validators.required]),
              publishDate: new FormControl(new Date())
            });
          });
        } else {
          this.clientMessage.showInfo(response.messageToClient!)
        }
      },
      error: (err) => {
        this.clientMessage.showError(err.error?.messageToClient)
      }
    });
  }

  async presentTranslateModal(textToTranslate: AnonymousPost | string, itemId: number, isPost: boolean = true) {
    const modal = await this.modalCtrl.create({
      component: TranslateModalComponent,
      componentProps: {
        textToTranslate: textToTranslate,
        itemId: itemId,
        isPost: isPost,
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data) {
        const { itemId, isPost, translatedText } = dataReturned.data;
        if (isPost) {
          const postIndex = this.posts.findIndex(post => post.id === itemId);
          if (postIndex !== -1) {
            this.posts[postIndex].title = translatedText.title;
            this.posts[postIndex].content = translatedText.content;
            this.comments = [...this.comments];
          }
        } else {
          const commentIndex = this.comments.findIndex(comment => comment.id === itemId);
          if (commentIndex !== -1) {
            this.comments[commentIndex].content = translatedText;
            this.comments = [...this.comments];
          }
        }
      }
    });

    return await modal.present();
  }

  playPostAudio(postId: number): void {
    this.translateService.readPostAloud(postId).subscribe(audioBlob => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    });
  }
  playCommentAudio(commentId: number) {
    this.translateService.readCommentAloud(commentId).subscribe(audioBlob => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    });
  }
}
