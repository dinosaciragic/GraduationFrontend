import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrdersService } from 'src/app/services/Orders/orders.service';
import { Order } from 'src/app/models/Order';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SingleOrderComponent } from '../single-order/single-order.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {

  userOrders: Order[] = [];
  orderList: string;

  constructor(
    private modalCtrl: ModalController,
    private ordersSvc: OrdersService,
    private authSvc: AuthenticationService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  async refresh() {
    const jwt: any = await this.authSvc.getJWTDecoded();

    if (jwt.isClient) {
      this.userOrders = await this.ordersSvc.getUserOrders();

      for (let i = 0; i < this.userOrders.length; i++) {
        let names = "";
        for (let j = 0; j < this.userOrders[i].items.length; j++) {
          names = names.concat(this.userOrders[i].items[j].name.concat(', '));
        }
        let index = names.lastIndexOf(', ');
        this.userOrders[i].orderList = names.slice(0, index); // order list is variable for the list of items ordered
      }
    } else {
      this.userOrders = await this.ordersSvc.getWorkerOrdersForWorker(jwt._id);

      for (let i = 0; i < this.userOrders.length; i++) {
        let names = "";
        for (let j = 0; j < this.userOrders[i].items.length; j++) {
          names = names.concat(this.userOrders[i].items[j].name.concat(', '));
        }
        let index = names.lastIndexOf(', ');
        this.userOrders[i].orderList = names.slice(0, index); // order list is variable for the list of items ordered
      }
    }
  }

  async openSingleOrderModal(order) {
    let modal = await this.modalCtrl.create(
      {
        component: SingleOrderComponent,
        componentProps: {
          orderId: order._id
        }
      }
    );
    await modal.present();
    let modalData = await modal.onDidDismiss();

    if (modalData.data) {
      this.refresh();
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
