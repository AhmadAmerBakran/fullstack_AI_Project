import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from "../../../app-services/services/post.service";
import { CreatePost } from "../../../app-services/app-models/PostAndCommentModels";
import { ClientMessageService } from "../../../app-services/services/client-message.service";
import {LanguageService} from "../../../app-services/services/language.service";
import {Language} from "../../../app-services/app-models/LanguageAndQueries";

@Component({
  selector: 'app-create-post-modal',
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.scss'],
})
export class CreatePostModalComponent  {
  languages: Language[];

  postForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
    postImage: new FormControl('', [Validators.required]),
    language: new FormControl('en', [Validators.required]),
  });

  constructor(
    private modalCtrl: ModalController,
    private postService: PostService,
    private clientMessage: ClientMessageService,
    private languageService: LanguageService
  ) {
    this.languages = this.languageService.languages;
  }



  dismissModal(data?: any) {
    this.modalCtrl.dismiss(data);
  }

  submitPost() {
    if (this.postForm.valid) {
      const post: CreatePost & { targetLanguage: string } = {
        title: this.postForm.value.title!,
        content: this.postForm.value.content!,
        postImage: this.postForm.value.postImage!,
        targetLanguage: this.postForm.value.language!,
      };

      this.postService.createPost(post).subscribe({
        next: () => {
          this.clientMessage.showSuccess('Post created successfully.');
          this.dismissModal({ reload: true });
        },
        error: (error) => {
          this.clientMessage.showError(error?.error?.messageToClient || 'Error creating post.');
        }
      });
    } else {
      this.clientMessage.showWarning('Please fill in all required fields.');
    }
  }
}
