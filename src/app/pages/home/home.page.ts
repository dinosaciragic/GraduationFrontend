import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ModalController } from '@ionic/angular';
import { OrdersComponent } from 'src/app/components/orders/orders.component';
import { SettingsComponent } from 'src/app/components/settings/settings.component';
import { Router, NavigationExtras, Event } from '@angular/router';
import { OrdersService } from 'src/app/services/Orders/orders.service';
import { Order } from 'src/app/models/Order';
import { SingleOrderComponent } from 'src/app/components/single-order/single-order.component';
import { CheckoutComponent } from 'src/app/components/checkout/checkout.component';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LocalService } from 'src/app/services/local/local.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  user: any;
  orderList: Order[] = [];
  infScrEnabled: boolean = true;
  hasOrders: boolean = false;
  count: number = 0;
  orderSum: number = 0;

  private pageSize: number = 12;
  private addedItems: any[] = [];

  constructor(
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private router: Router,
    private ordersSvc: OrdersService,
    private storage: NativeStorage,
    private localSvc: LocalService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    this.user = await this.authService.getJWTDecoded();
    console.log('decoded token', this.user)
    if (!this.user.isClient) {
      // get order list for worker
      this.orderList = await this.ordersSvc.getWorkerOrdersForDash(1);

      // disable infinite scrool if not enought results
      if (this.orderList.length < this.pageSize) {
        this.infScrEnabled = false;
      }
      else {
        this.infScrEnabled = true;
      }

      // create orderList string
      for (let i = 0; i < this.orderList.length; i++) {
        let names = "";
        for (let j = 0; j < this.orderList[i].items.length; j++) {
          names = names.concat(this.orderList[i].items[j].name.concat(', '));
        }
        let index = names.lastIndexOf(', ');
        this.orderList[i].orderList = names.slice(0, index); // order list is variable for the list of items ordered
      }
    } else {
      let data = await this.localSvc.getAddedItems();
      // set count and price for display
      if (data) {
        this.addedItems = [];
        this.addedItems = data;
        this.count = 0;
        this.orderSum = 0;

        if (this.addedItems.length > 0) {
          for (let i = 0; i < this.addedItems.length; i++) {
            this.count++;
            this.orderSum += this.addedItems[i].price;
          }
        }
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

  async openSingleOrderModal(order) {
    let modal = await this.modalCtrl.create(
      {
        component: SingleOrderComponent,
        componentProps: {
          orderId: order._id
        }
      }
    );
    await modal.present();
    let modalData = await modal.onDidDismiss();

    if (modalData.data) {
      this.refresh(); // refresh orders list if confirmed
    }
  }

  async startCheckout() {
    if (this.user.isClient) {
      let drugsData = await this.localSvc.getAddedItems();

      if (drugsData && drugsData.length > 0) {
        let modal = await this.modalCtrl.create(
          {
            component: CheckoutComponent
          }
        );
        await modal.present();

        let res = await modal.onDidDismiss();

        if (res) {
          this.refresh();
        }
      }
    } else {
      this.startOrdersModal();
    }
  }

  async doInfinite(infiniteScroll) {
    if (!this.infScrEnabled) {
      infiniteScroll.target.complete();
      return;
    }

    try {
      // get next page orders
      let data = await this.ordersSvc.getWorkerOrdersForDash(this.orderList.length / this.pageSize + 1);

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

      infiniteScroll.target.complete();
    } catch (error) {
      infiniteScroll.target.complete();
      console.error(error);
    }
  }
}
