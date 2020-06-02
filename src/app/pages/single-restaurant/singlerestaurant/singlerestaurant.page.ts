import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LocalService } from 'src/app/services/local/local.service';
import { RestaurantsService } from 'src/app/services/restaurants/restaurants.service';
import { RestaurantItem } from 'src/app/models/RestaurantItem';
import { Shop } from 'src/app/models/Shop';
import { CheckoutComponent } from 'src/app/components/checkout/checkout.component';

@Component({
  selector: 'app-singlerestaurant',
  templateUrl: './singlerestaurant.page.html',
  styleUrls: ['./singlerestaurant.page.scss'],
})
export class SinglerestaurantPage implements OnInit {

  restaurantName: string;
  restaurantItems: RestaurantItem[] = [];
  searchTerm: string = "";
  infScrEnabled: boolean = true;
  count: number = 0;
  orderSum: number = 0;

  private pageSize: number = 12;
  private addedItems: RestaurantItem[] = [];

  constructor(
    private router: Router,
    private restaurantsSvc: RestaurantsService,
    private loadingCtrl: LoadingController,
    private cdr: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private storage: NativeStorage,
    private localSvc: LocalService
  ) { }

  ngOnInit() {
    this.restaurantName = this.router.getCurrentNavigation().extras.state.restaurantName;
    console.log('name', this.restaurantName)
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

      this.restaurantItems = await this.restaurantsSvc.getRestaurantsPagedSearchFilter(1, this.searchTerm, this.restaurantName);
      console.log('restaurantItems', this.restaurantItems);
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

    if (this.restaurantItems.length < this.pageSize) {
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
  isAdded(restaurantItem: RestaurantItem): boolean {
    if (this.addedItems.length > 0) {
      for (let i = 0; i < this.addedItems.length; i++) {
        if (this.addedItems[i]._id == restaurantItem._id) {
          return true;
        }
      }

      return false;
    } else {
      return false;
    }
  }

  addToCart(restaurantItem: RestaurantItem) {
    if (!this.isAdded(restaurantItem)) {
      this.count++;
      this.orderSum += restaurantItem.price;
      this.addedItems.push(restaurantItem);
    } else {
      this.count--;
      this.orderSum -= restaurantItem.price;

      for (let i = 0; i < this.addedItems.length; i++) {
        if (this.addedItems[i]._id == restaurantItem._id) {
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
      let data = await this.restaurantsSvc.getRestaurantsPagedSearchFilter(this.restaurantItems.length / this.pageSize + 1, this.searchTerm, this.restaurantName);

      if (data.length < this.pageSize) {
        this.infScrEnabled = false;
      } else {
        this.infScrEnabled = true;
      }

      this.restaurantItems = this.restaurantItems.concat(data);
      infiniteScroll.target.complete();
    } catch (error) {
      infiniteScroll.target.complete();
      console.error(error);
    }
  }

}
