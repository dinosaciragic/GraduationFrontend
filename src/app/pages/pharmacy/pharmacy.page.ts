import { Component, OnInit } from '@angular/core';
import { DrugsService } from 'src/app/services/drugs/drugs.service';
import { Drug } from 'src/app/models/Drug';
import { LoadingController, ModalController } from '@ionic/angular';
import { CheckoutComponent } from 'src/app/components/checkout/checkout.component';

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
  private addedDrugs: Drug[] = [];

  constructor(
    private drugsSvc: DrugsService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
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

      this.drugs = await this.drugsSvc.getDrugsPaged(1, this.searchTerm);

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
      this.addedDrugs.push(drug);
    } else {
      this.count--;
      this.orderSum -= drug.price;

      for (let i = 0; i < this.addedDrugs.length; i++) {
        if (this.addedDrugs[i]._id == drug._id) {
          this.addedDrugs.splice(i, 1);
        }
      }
    }
  }

  // this is because of add/remove icon
  isAdded(drug: Drug): boolean {
    if (this.addedDrugs.length > 0) {
      for (let i = 0; i < this.addedDrugs.length; i++) {
        if (this.addedDrugs[i]._id == drug._id) {
          return true;
        }
      }

      return false;
    } else {
      return false;
    }
  }

  async startCheckout() {
    let modal = await this.modalCtrl.create(
      {
        component: CheckoutComponent,
        componentProps: {
          addedDrugs: this.addedDrugs,
          orderSum: this.orderSum
        }
      }
    );
    await modal.present();
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
