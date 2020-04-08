import { Component, OnInit, Input } from '@angular/core';
import { Drug } from 'src/app/models/Drug';
import { ModalController, PickerController } from '@ionic/angular';
import { PickerOptions } from "@ionic/core";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

  @Input() addedDrugs: Drug[];
  @Input() orderSum: number;

  deliveryTime: string;
  times: string[] = ["ASAP", "35m", "45m", "1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h"];

  constructor(
    private modalCtrl: ModalController,
    private pickerCtrl: PickerController
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

  async showPicker() {
    let options: PickerOptions = {
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: (value: any) => {
            this.deliveryTime = value.value
            console.log(this.deliveryTime);
          }
        }
      ],
      columns: [{
        name: 'Times',
        options: this.getColumnOptions()
      }]
    };

    let picker = await this.pickerCtrl.create(options);
    picker.present()
  }

  getColumnOptions() {
    let options = [];
    this.times.forEach(x => {
      options.push({ text: x, value: x });
    });
    return options;
  }

}
