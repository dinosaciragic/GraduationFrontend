import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrdersService } from 'src/app/services/Orders/orders.service';
import { Order } from 'src/app/models/Order';

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
    private ordersSvc: OrdersService
  ) { }

  async ngOnInit() {
    this.userOrders = await this.ordersSvc.getUserOrders();
    console.log('userorders', this.userOrders)

    for (let i = 0; i < this.userOrders.length; i++) {
      let names = "";
      for (let j = 0; j < this.userOrders[i].items.length; j++) {
        names = names.concat(this.userOrders[i].items[j].name.concat(', '));
        console.log('names', names)
      }
      let index = names.lastIndexOf(', ');
      this.userOrders[i].orderList = names.slice(0, index);
      console.log('orderList', this.userOrders[i].orderList)
    }

  }

  close() {
    this.modalCtrl.dismiss();
  }

}
