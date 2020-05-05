import { Component, OnInit } from '@angular/core';
import { DrugsService } from 'src/app/services/drugs/drugs.service';
import { Drug } from 'src/app/models/Drug';
import { LoadingController, ModalController } from '@ionic/angular';
import { CheckoutComponent } from 'src/app/components/checkout/checkout.component';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.page.html',
  styleUrls: ['./pharmacy.page.scss'],
})
export class PharmacyPage implements OnInit {

  drugs: Drug[] = [];
  searchTerm: string = "";
  infScrEnabled: boolean = true;
  count: number = 0;
  orderSum: number = 0;

  private pageSize: number = 12;
  private addedItems: Drug[] = [];

  constructor(
    private drugsSvc: DrugsService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private storage: NativeStorage
  ) { }

  ngOnInit() {
    this.refresh(true);
  }

  async refresh(loader: boolean) {
    console.log('in referes')
    try {
      if (loader) {
        let loader = await this.loadingCtrl.create({
          message: "Loading"
        });
        await loader.present();
      }
      //get drugs from backend
      this.drugs = await this.drugsSvc.getDrugsPaged(1, this.searchTerm);
      // gett items that are in cart
      let data = await this.storage.getItem("addedDrugs");
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

    if (this.drugs.length < this.pageSize) {
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

  addToCart(drug: Drug) {
    if (!this.isAdded(drug)) {
      this.count++;
      this.orderSum += drug.price;
      this.addedItems.push(drug);
    } else {
      this.count--;
      this.orderSum -= drug.price;

      for (let i = 0; i < this.addedItems.length; i++) {
        if (this.addedItems[i]._id == drug._id) {
          this.addedItems.splice(i, 1);
        }
      }
    }
    // Add items to local storage to use later in cart
    this.storage.setItem("addedDrugs", this.addedItems);
  }

  // this is because of add/remove icon
  isAdded(drug: Drug): boolean {
    if (this.addedItems.length > 0) {
      for (let i = 0; i < this.addedItems.length; i++) {
        if (this.addedItems[i]._id == drug._id) {
          return true;
        }
      }

      return false;
    } else {
      return false;
    }
  }

  async startCheckout() {
    let drugsData = await this.storage.getItem("addedDrugs");

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
      let data = await this.drugsSvc.getDrugsPaged(this.drugs.length / this.pageSize + 1, this.searchTerm);

      if (data.length < this.pageSize) {
        this.infScrEnabled = false;
      } else {
        this.infScrEnabled = true;
      }

      this.drugs = this.drugs.concat(data);
      infiniteScroll.target.complete();
    } catch (error) {
      infiniteScroll.target.complete();
      console.error(error);
    }
  }

}
