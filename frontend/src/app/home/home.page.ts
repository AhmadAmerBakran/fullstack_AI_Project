import {Component, OnInit} from '@angular/core';
import {AnonymousPost, Comment} from "../app-services/app-models/PostAndCommentModels";
import {PostService} from "../app-services/services/post.service";
import {ClientMessageService} from "../app-services/services/client-message.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CreatePostModalComponent} from "./components/create-post-modal/create-post-modal.component";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  posts: AnonymousPost[] = [];
  comments: Comment[] = [];
  commentForms: { [key: number]: FormGroup } = {};

  constructor(
    private postService: PostService,
    private clientMessage: ClientMessageService,
    private modalCtrl: ModalController
    ) { }

  ngOnInit(): void {
    this.postService.getAllPosts().subscribe({
      next: (response) => {
        if (response.responseData) {
          this.posts = response.responseData;
        } else {
          this.clientMessage.showInfo(response.messageToClient!)
        }
      },
      error: (err) => {
        this.clientMessage.showError(err.error?.messageToClient)
      }
    });

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
    const commentForm = this.commentForms[postId];
    if (commentForm.valid) {
      this.postService.createComment(commentForm.value).subscribe({
        next: (response) => {
          this.clientMessage.showInfo("Comment successfully added");
          this.loadComments(postId);
          commentForm.get('content')?.reset();

          const post = this.posts.find(p => p.id === postId);
          if (post) {
            if (post.commentCount !== undefined) {
              post.commentCount += 1;
            } else {
              post.commentCount = 1;
            }
          }

        },
        error: (err) => {
          this.clientMessage.showError(err.error?.message);
        }
      });
    } else {
      this.clientMessage.showInfo("Please fill in all required fields");
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


}
