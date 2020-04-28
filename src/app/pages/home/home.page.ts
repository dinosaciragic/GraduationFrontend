import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ModalController } from '@ionic/angular';
import { OrdersComponent } from 'src/app/components/orders/orders.component';
import { SettingsComponent } from 'src/app/components/settings/settings.component';
import { Router } from '@angular/router';
import { OrdersService } from 'src/app/services/Orders/orders.service';
import { Order } from 'src/app/models/Order';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  user: any;
  orderList: Order[] = [];
  infScrEnabled: boolean = true;

  private pageSize: number = 12;

  constructor(
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private router: Router,
    private ordersSvc: OrdersService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    this.user = await this.authService.getJWTDecoded();
    console.log('decoded token', this.user)
    if (!this.user.isClient) {
      // get order list for worker
      this.orderList = await this.ordersSvc.getWorkerOrders(1);

      // disable infinite scrool if not enought results
      if (this.orderList.length < this.pageSize) {
        this.infScrEnabled = false;
      }
      else {
        this.infScrEnabled = true;
      }
      console.log('orders', this.orderList)
      // create orderList string
      for (let i = 0; i < this.orderList.length; i++) {
        let names = "";
        for (let j = 0; j < this.orderList[i].items.length; j++) {
          names = names.concat(this.orderList[i].items[j].name.concat(', '));
        }
        let index = names.lastIndexOf(', ');
        this.orderList[i].orderList = names.slice(0, index); // order list is variable for the list of items ordered
      }
    }
    // if changes detect and update view
    this.cdr.detectChanges();
  }

  async doRefresh(event) {
    this.refresh();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
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

  async doInfinite(infiniteScroll) {
    if (!this.infScrEnabled) {
      infiniteScroll.target.complete();
      return;
    }

    try {
      // get next page orders
      let data = await this.ordersSvc.getWorkerOrders(this.orderList.length / this.pageSize + 1);
      console.log(data, this.orderList.length / this.pageSize + 1)
      // disable infinite scrool if not enought results
      if (data.length < this.pageSize) {
        this.infScrEnabled = false;
      } else {
        this.infScrEnabled = true;
      }

      // create orderList string
      for (let i = 0; i < data.length; i++) {
        let names = "";
        for (let j = 0; j < data[i].items.length; j++) {
          names = names.concat(data[i].items[j].name.concat(', '));
        }
        let index = names.lastIndexOf(', ');
        data[i].orderList = names.slice(0, index); // order list is variable for the list of items ordered
      }

      // add next page orders to existing
      this.orderList = this.orderList.concat(data);
      console.log('order infi', this.orderList)
      infiniteScroll.target.complete();
    } catch (error) {
      infiniteScroll.target.complete();
      console.error(error);
    }
  }
}
