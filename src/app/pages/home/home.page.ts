import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ModalController } from '@ionic/angular';
import { OrdersComponent } from 'src/app/components/orders/orders.component';
import { SettingsComponent } from 'src/app/components/settings/settings.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  user: any;

  constructor(
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private router: Router
  ) { }

  async ngOnInit() {
    this.user = await this.authService.getJWTDecoded();
    console.log('decoded token', this.user)
    this.cdr.detectChanges();
  }

  logout() {
    console.log('decoded token', this.user)
    this.authService.logout();
  }

  async startOrdersModal() {
    let modal = await this.modalCtrl.create(
      {
        component: OrdersComponent
      }
    );
    await modal.present();
  }

  async startSettingsModal() {
    let modal = await this.modalCtrl.create(
      {
        component: SettingsComponent
      }
    );
    await modal.present();
  }

  navigateToRestaurants() {
    this.router.navigate(['pages', 'restaurants']);
  }

  navigateToGroceries() {
    this.router.navigate(['pages', 'groceries']);
  }

  navigateToShops() {
    this.router.navigate(['pages', 'shops']);
  }

  navigateToCurrier() {
    this.router.navigate(['pages', 'currier']);
  }

  navigateToPharmacy() {
    this.router.navigate(['pages', 'pharmacy']);
  }

}
