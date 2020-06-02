import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ShopsService } from 'src/app/services/shops/shops.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Shop } from 'src/app/models/Shop';
import { CheckoutComponent } from 'src/app/components/checkout/checkout.component';
import { LocalService } from 'src/app/services/local/local.service';

@Component({
  selector: 'app-single-shop',
  templateUrl: './single-shop.page.html',
  styleUrls: ['./single-shop.page.scss'],
})
export class SingleShopPage implements OnInit {

  shopItems: Shop[] = [];
  shopName: string;
  searchTerm: string = "";
  infScrEnabled: boolean = true;
  count: number = 0;
  orderSum: number = 0;

  private pageSize: number = 12;
  private addedItems: Shop[] = [];

  constructor(
    private router: Router,
    private shopsSvc: ShopsService,
    private loadingCtrl: LoadingController,
    private cdr: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private storage: NativeStorage,
    private localSvc: LocalService
  ) { }

  ngOnInit() {
    this.shopName = this.router.getCurrentNavigation().extras.state.shopName;

    this.refresh(true);
  }

  async refresh(loader: boolean) {
    try {
      if (loader) {
        let loader = await this.loadingCtrl.create({
          message: "Loading"
        });
        await loader.present();
      }

      this.shopItems = await this.shopsSvc.getShopsPagedSearchFilter(1, this.searchTerm, this.shopName);
      console.log('shopItems', this.shopItems);
      // gett items that are in cart
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

      if (loader) {
        this.loadingCtrl.dismiss();
      }
    } catch (error) {
      this.loadingCtrl.dismiss();
      console.error(error)
    }

    if (this.shopItems.length < this.pageSize) {
      this.infScrEnabled = false;
    }
    else {
      this.infScrEnabled = true;
    }
  }

  resetSearch() {
    this.searchTerm = "";
    this.refresh(false);
  }

  // this is because of add/remove icon
  isAdded(shopItem: Shop): boolean {
    if (this.addedItems.length > 0) {
      for (let i = 0; i < this.addedItems.length; i++) {
        if (this.addedItems[i]._id == shopItem._id) {
          return true;
        }
      }

      return false;
    } else {
      return false;
    }
  }

  addToCart(shopItem: Shop) {
    if (!this.isAdded(shopItem)) {
      this.count++;
      this.orderSum += shopItem.price;
      this.addedItems.push(shopItem);
    } else {
      this.count--;
      this.orderSum -= shopItem.price;

      for (let i = 0; i < this.addedItems.length; i++) {
        if (this.addedItems[i]._id == shopItem._id) {
          this.addedItems.splice(i, 1);
        }
      }
    }
    // Add items to local storage to use later in cart
    this.storage.setItem("addedDrugs", this.addedItems);
  }

  async startCheckout() {
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
        this.refresh(false);
      }
    }
  }

  async doInfinite(infiniteScroll) {
    if (!this.infScrEnabled) {
      infiniteScroll.target.complete();
      return;
    }

    try {
      let data = this.shopItems = await this.shopsSvc.getShopsPagedSearchFilter(this.shopItems.length / this.pageSize + 1, this.searchTerm, this.shopName);

      if (data.length < this.pageSize) {
        this.infScrEnabled = false;
      } else {
        this.infScrEnabled = true;
      }

      this.shopItems = this.shopItems.concat(data);
      infiniteScroll.target.complete();
    } catch (error) {
      infiniteScroll.target.complete();
      console.error(error);
    }
  }

}
