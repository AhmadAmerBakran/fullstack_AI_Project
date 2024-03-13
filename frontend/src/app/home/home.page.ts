import {Component, OnInit} from '@angular/core';
import {AnonymousPost, Comment} from "../app-services/app-models/PostAndCommentModels";
import {PostService} from "../app-services/services/post.service";
import {ClientMessageService} from "../app-services/services/client-message.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CreatePostModalComponent} from "./components/create-post-modal/create-post-modal.component";
import {AlertController, ModalController} from "@ionic/angular";
import {LanguageService} from "../app-services/services/language.service";

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
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private languageService: LanguageService
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

  readPostAloud(postId: number) {
    this.postService.readPostAloud(postId).subscribe(audioBlob => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    });
  }

  async translatePost(postId: number) {
    const alert = await this.alertController.create({
      header: 'Select Language',
      inputs: this.languageService.languages.map(lang => ({
        name: 'language',
        type: 'radio',
        label: lang.name,
        value: lang.code,
      })),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Translate',
          handler: (selectedLanguage) => {
            if (!selectedLanguage) {
              this.clientMessage.showInfo("Translation cancelled.");
              return;
            }
            this.postService.translatePost(postId, { targetLanguage: selectedLanguage }).subscribe({
              next: (response) => {
                // Now we get the translated text from the 'responseData' property
                const translatedText = response.responseData;
                if (translatedText !== undefined) { // Make sure it's not undefined
                  this.updatePostContent(postId, translatedText);
                } else {
                  this.clientMessage.showError("Translation failed: No translated text received.");
                }
              },
              error: (err) => {
                console.error('Translation error:', err);
                this.clientMessage.showError("Translation failed.");
              }
            });
          },
        },
      ],
    });

    await alert.present();
  }


  updatePostContent(postId: number, translatedText: string) {
    const postIndex = this.posts.findIndex(post => post.id === postId);
    if (postIndex !== -1 && translatedText !== undefined) {
      this.posts[postIndex].content = translatedText;
      this.posts = [...this.posts];
    }
  }




}
