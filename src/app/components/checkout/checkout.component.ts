import { Component, OnInit, Input } from '@angular/core';
import { Drug } from 'src/app/models/Drug';
import { ModalController, PickerController, AlertController } from '@ionic/angular';
import { PickerOptions } from "@ionic/core";
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/User';
import { Order } from 'src/app/models/Order';
import { OrdersService } from 'src/app/services/Orders/orders.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

  @Input() addedDrugs: Drug[];
  @Input() orderSum: number;

  deliveryTime: string;
  times: string[] = ["ASAP", "45m", "1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h"];
  deliveryCost: number = 5;
  totalCost: number;
  currentUser: User;
  contactPhone: number;
  newOrder: Order = new Order();

  constructor(
    private modalCtrl: ModalController,
    private pickerCtrl: PickerController,
    private authSvc: AuthenticationService,
    private alertCtrl: AlertController,
    private orderSvc: OrdersService
  ) { }

  async ngOnInit() {
    this.currentUser = await this.authSvc.getCurrentUser();

    this.refresh();
  }

  refresh() {
    this.deliveryCost = 5;
    this.totalCost = 0;

    if (this.orderSum <= 20) {
      this.deliveryCost = 5;
    } else {
      // for every 10 aboute 20 add 3.5
      let addToDelivery = (Math.floor(this.orderSum / 10) - 2) * 3.5;
      this.deliveryCost += addToDelivery;
    }

    this.totalCost = this.orderSum + this.deliveryCost;
  }

  close() {
    this.modalCtrl.dismiss(this.addedDrugs);
  }

  removeFromCart(drug: Drug) {
    this.orderSum -= drug.price;

    if (this.orderSum <= 0) {
      this.close();
    }

    for (let i = 0; i < this.addedDrugs.length; i++) {
      if (this.addedDrugs[i]._id == drug._id) {
        this.addedDrugs.splice(i, 1);
      }
    }

    this.refresh();
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
            this.deliveryTime = value.Times.value
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

  async confirmOrder() {
    if (this.validate()) {
      this.newOrder.items = this.addedDrugs;
      this.newOrder.location = this.currentUser.location;
      this.newOrder.userId = this.currentUser._id;
      this.newOrder.deliveryTime = this.deliveryTime;
      this.newOrder.contactPhone = this.contactPhone;
      this.newOrder.itemsCost = this.orderSum;
      this.newOrder.totalCost = this.totalCost;
      this.newOrder.isStarted = false;

      await this.orderSvc.addOrder(this.newOrder);
      this.addedDrugs = [];
      this.close();
    }
  }

  public async showAlert(text: string) {
    let alert = await this.alertCtrl.create({
      header: "Can not place order",
      message: text,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

  validate(): boolean {
    if (!this.deliveryTime) {
      this.showAlert("Please choose delivery time.");
      return false;
    } else if (!this.contactPhone) {
      this.showAlert("Please add contact phone.");
      return false;
    } else {
      return true;
    }
  }

}
