import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GroceriesService } from 'src/app/services/groceries/groceries.service';
import { Grocerie } from 'src/app/models/Groceries';
import { LoadingController, ModalController } from '@ionic/angular';
import { CheckoutComponent } from 'src/app/components/checkout/checkout.component';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LocalService } from 'src/app/services/local/local.service';

@Component({
  selector: 'app-groceries',
  templateUrl: './groceries.page.html',
  styleUrls: ['./groceries.page.scss'],
})
export class GroceriesPage implements OnInit {

  groceries: Grocerie[] = [];
  searchTerm: string = "";
  category: string = "";
  subCategory: string = "";
  subCategories: string[] = [];
  categories: string[] = [
    "Food and drinks",
    "Household items",
    "Beauty and cosmetics",
    "Cigarettes and other"
  ];

  fdSubs: string[] = [
    "Fruits and Vegitables",
    "Meat",
    "Bakery",
    "Frozen",
    "Snacks",
    "Dairy products",
    "Non alcoholic drinks"
  ];

  hiSubs: string[] = [
    "Cleaning",
    "Hygiene"
  ];

  bcSubs: string[] = [
    "Teeth",
    "Body",
    "Hair"
  ];

  infScrEnabled: boolean = true;
  count: number = 0;
  orderSum: number = 0;
  filterOpen: boolean = false;
  subCategoryOpen: boolean = false;

  private pageSize: number = 12;
  private addedItems: Grocerie[] = [];

  constructor(
    private groceriesSvc: GroceriesService,
    private loadingCtrl: LoadingController,
    private cdr: ChangeDetectorRef,
    private modalCtrl: ModalController,
    private storage: NativeStorage,
    private localSvc: LocalService
  ) { }

  ngOnInit() {
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

      this.groceries = await this.groceriesSvc.getGroceriesPagedSearchFilter(1, this.searchTerm, this.category, this.subCategory);
      console.log('groceries', this.groceries);
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

    if (this.groceries.length < this.pageSize) {
      this.infScrEnabled = false;
    }
    else {
      this.infScrEnabled = true;
    }
  }

  openCloseFilter() {
    this.filterOpen = !this.filterOpen;
  }

  resetSearch() {
    this.searchTerm = "";
    this.refresh(false);
  }

  setCategory() {
    // set sub categories based on categories
    this.refresh(false);

    switch (this.category) {
      case "Food and drinks":
        this.subCategoryOpen = true;
        this.subCategory = "";
        this.cdr.detectChanges();
        this.subCategories = this.fdSubs;
        break;
      case "Household items":
        this.subCategoryOpen = true;
        this.subCategory = "";
        this.cdr.detectChanges();
        this.subCategories = this.hiSubs;
        break;
      case "Beauty and cosmetics":
        this.subCategoryOpen = true;
        this.subCategory = "";
        this.cdr.detectChanges();
        this.subCategories = this.bcSubs;
        break;
      case "Cigarettes and other":
        this.subCategory = "";
        this.cdr.detectChanges();
        this.subCategoryOpen = false;
        break;
      case "None":
        this.subCategory = "";
        this.category = "";
        this.cdr.detectChanges();
        this.subCategoryOpen = false;
        break;
      default:
        this.subCategory = "";
        this.cdr.detectChanges();
        this.subCategoryOpen = false;
        break;
    }
  }

  addToCart(grocerie: Grocerie) {
    if (!this.isAdded(grocerie)) {
      this.count++;
      this.orderSum += grocerie.price;
      this.addedItems.push(grocerie);
    } else {
      this.count--;
      this.orderSum -= grocerie.price;

      for (let i = 0; i < this.addedItems.length; i++) {
        if (this.addedItems[i]._id == grocerie._id) {
          this.addedItems.splice(i, 1);
        }
      }
    }
    // Add items to local storage to use later in cart
    this.storage.setItem("addedDrugs", this.addedItems);
  }

  // this is because of add/remove icon
  isAdded(grocerie: Grocerie): boolean {
    if (this.addedItems.length > 0) {
      for (let i = 0; i < this.addedItems.length; i++) {
        if (this.addedItems[i]._id == grocerie._id) {
          return true;
        }
      }

      return false;
    } else {
      return false;
    }
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
      let data = await this.groceriesSvc.getGroceriesPagedSearchFilter(this.groceries.length / this.pageSize + 1, this.searchTerm, this.category, this.subCategory);

      if (data.length < this.pageSize) {
        this.infScrEnabled = false;
      } else {
        this.infScrEnabled = true;
      }

      this.groceries = this.groceries.concat(data);
      infiniteScroll.target.complete();
    } catch (error) {
      infiniteScroll.target.complete();
      console.error(error);
    }
  }

}
