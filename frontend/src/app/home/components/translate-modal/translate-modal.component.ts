import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {TranslateModalService} from "../../../app-services/services/translate-modal.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AnonymousPost} from "../../../app-services/app-models/PostAndCommentModels";

@Component({
  selector: 'app-translate-modal',
  templateUrl: './translate-modal.component.html',
  styleUrls: ['./translate-modal.component.scss'],
})
export class TranslateModalComponent   {

  @Input() textToTranslate!: string;
  @Input() itemId!: number;
  @Input() isPost: boolean = true;
  @Output() translationCompleted = new EventEmitter<{ itemId: number, isPost: boolean, translatedText: string }>();

  translateForm = new FormGroup({
    targetLanguage: new FormControl('', [Validators.required]),
  });

  constructor(
    private modalCtrl: ModalController,
    private translateService: TranslateModalService
  ) { }


  dismissModal(translatedData?: { itemId: number, isPost: boolean, translatedText: AnonymousPost | string }) {
    this.modalCtrl.dismiss(translatedData);
  }


  submitTranslation() {
    if (this.translateForm.valid) {
      const targetLanguage = this.translateForm.value.targetLanguage;
      if (this.isPost) {
        this.translateService.translatePost(this.itemId, targetLanguage ).subscribe({
          next: (response) => {
            console.log('Translation:', response.responseData);
            this.dismissModal({ itemId: this.itemId, isPost: true, translatedText: response.responseData || 'Fallback text or empty string if no translation'});
            },
          error: (error) => {
            console.error('Error translating post:', error);
          }
        });
      } else {
        this.translateService.translateComment(this.itemId, targetLanguage).subscribe({
          next: (response) => {
            this.dismissModal( { itemId: this.itemId, isPost: false, translatedText: response.responseData || 'Fallback text or empty string if no translation'});
          }
        });
      }
    }
  }
}
