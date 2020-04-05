import { Component, OnInit, Input } from '@angular/core';
import { Drug } from 'src/app/models/Drug';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

  @Input() addedDrugs: Drug[];
  @Input() orderSum: number;
  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    console.log('in here', this.orderSum, this.addedDrugs)
  }

  close() {
    this.modalCtrl.dismiss();
  }

  removeFromCart(drug: Drug) {
    this.orderSum -= drug.price;

    for (let i = 0; i < this.addedDrugs.length; i++) {
      if (this.addedDrugs[i]._id == drug._id) {
        this.addedDrugs.splice(i, 1);
      }
    }
  }

}
