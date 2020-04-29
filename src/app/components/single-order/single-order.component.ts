import { Component, OnInit, Input } from '@angular/core';
import { Order } from 'src/app/models/Order';
import { OrdersService } from 'src/app/services/Orders/orders.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.scss'],
})
export class SingleOrderComponent implements OnInit {

  @Input() orderId: number;

  order: Order;

  constructor(
    private ordersSvc: OrdersService,
    private authSvc: AuthenticationService,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    // get order by id
    this.order = await this.ordersSvc.getOrderById(this.orderId);
  }

  //close modal
  close(data = false) {
    this.modalCtrl.dismiss(data);
  }

  async confirmOrder() {
    let workerId = await this.authSvc.getJWTDecoded(); // get id of worker

    this.order.workerId = workerId._id; // set id of worker
    this.order.isStarted = true; // set started to true


    // edit order
    let res = await this.ordersSvc.editOrder(this.order);

    if (res.updatedOrder) {
      this.close(true); // close modal and refresh
    }
  }

}
