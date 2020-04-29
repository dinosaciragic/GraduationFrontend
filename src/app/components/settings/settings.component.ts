import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private authSvc: AuthenticationService
  ) { }

  ngOnInit() {

  }

  close() {
    this.modalCtrl.dismiss();
  }

  logout() {
    this.authSvc.logout();
    this.close();
  }

}
