import { Injectable } from '@angular/core';
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ClientMessageService {
  constructor(private toast : ToastController) {}

  async  showSuccess(message: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
      color : 'success'
    });
    toast.present();
  }


  async showError(message: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
      color : 'danger'
    });
    toast.present();
  }

  async showInfo(message: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
      color : 'primary'
    });
    toast.present();
  }

  async showWarning(message: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
      color : 'warning'
    });
    toast.present();
  }
}
