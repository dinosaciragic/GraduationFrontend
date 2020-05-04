import { Component, OnInit, Input } from '@angular/core';
import { Order } from 'src/app/models/Order';
import { OrdersService } from 'src/app/services/Orders/orders.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.scss'],
})
export class SingleOrderComponent implements OnInit {

  @Input() orderId: number;

  order: Order;
  jwt: any;

  constructor(
    private ordersSvc: OrdersService,
    private authSvc: AuthenticationService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    // get order by id
    this.order = await this.ordersSvc.getOrderById(this.orderId);
    this.jwt = await this.authSvc.getJWTDecoded();
  }

  //close modal
  close(data = false) {
    this.modalCtrl.dismiss(data);
  }

  async confirmOrder() {
    this.order.workerId = this.jwt._id; // set id of worker
    this.order.isStarted = true; // set started to true

    // edit order
    let res = await this.ordersSvc.editOrder(this.order);

    if (res.updatedOrder) {
      this.close(true); // close modal and refresh
    } else {
      this.showAlert(res.msg); // show error message from backend
    }
  }

  // send API request to backend to delete order
  async confirmDelivery() {
    await this.ordersSvc.deleteOrder(this.order._id);
    this.close(true); // close modal and refresh
  }

  // create alert
  public async showAlert(text: string) {
    let alert = await this.alertCtrl.create({
      header: "Can not confirm order",
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

}
