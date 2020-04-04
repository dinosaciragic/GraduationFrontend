import { Component, OnInit } from '@angular/core';
import { DrugsService } from 'src/app/services/drugs/drugs.service';
import { Drug } from 'src/app/models/Drug';

@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.page.html',
  styleUrls: ['./pharmacy.page.scss'],
})
export class PharmacyPage implements OnInit {

  drugs: Drug[] = [];
  searchTerm: string = "";
  infScrEnabled: boolean = true;
  private pageSize: number = 15;

  constructor(
    private drugsSvc: DrugsService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    try {
      this.drugs = await this.drugsSvc.getDrugsPaged(1, this.searchTerm);
      console.log('I got the drugs', this.drugs)
    } catch (error) {
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
    this.refresh();
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
