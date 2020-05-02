import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order } from 'src/app/models/Order';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private url: string = Constants.API_URL + "orders";

  constructor(
    private http: HttpClient,
    private authSvc: AuthenticationService
  ) { }

  async addOrder(newOrder: Order): Promise<any> {
    let addOrderPromise = new Promise<any>((resolve, reject) => {
      this.http.post<any>(this.url + '/add', newOrder).pipe(map(res => res.data as any))
        .subscribe((data) => {
          resolve(data);
        }, (error) => {
          reject("HTTP error");
        });
    });
    let addOrder: any = await addOrderPromise;
    return addOrder;
  }

  async getUserOrders(): Promise<any> {
    let jwt = await this.authSvc.getJWTDecoded();
    let data = {
      userId: jwt._id
    }

    let addOrderPromise = new Promise<Order[]>((resolve, reject) => {
      this.http.post<any>(this.url + '/userOrders', data).pipe(map(res => res as Order[] || []))
        .subscribe((data) => {
          resolve(data);
        }, (error) => {
          reject("HTTP error");
        });
    });
    let addOrder: Order[] = await addOrderPromise;
    return addOrder;
  }

  // get worker orders listed in home page/ dashboard
  async getWorkerOrdersForDash(page: number): Promise<Order[]> {
    let ordersPromise = new Promise<Order[]>((resolve, reject) => {
      this.http.post<any>(this.url + '/workerOrders/' + page, {})
        .pipe(map(res => res as Order[] || []))
        .subscribe((OrdersPaged) => {
          resolve(OrdersPaged);
        }, (error) => {
          console.log("HTTP ERROR - CollectionService: getOrdersPaged()", error);
          reject("HTTP error");
        });
    });

    let ordersPaged: Order[] = await ordersPromise;
    return ordersPaged;
  }

  // get worker orders listed in home page/ dashboard
  async getWorkerOrdersForWorker(id: number): Promise<Order[]> {
    let ordersPromise = new Promise<Order[]>((resolve, reject) => {
      this.http.get<any>(this.url + '/workerOrders/' + id, {})
        .pipe(map(res => res as Order[] || []))
        .subscribe((OrdersPaged) => {
          resolve(OrdersPaged);
        }, (error) => {
          console.log("HTTP ERROR - CollectionService: getOrdersPaged()", error);
          reject("HTTP error");
        });
    });

    let workerOrders: Order[] = await ordersPromise;
    return workerOrders;
  }

  async getOrderById(id): Promise<Order> {
    let orderPromise = new Promise<Order>((resolve, reject) => {
      this.http.get<any>(this.url + '/single/' + id)
        .pipe(map(res => res as Order))
        .subscribe((data) => {
          resolve(data);
        }, (error) => {
          reject("HTTP error");
        });
    });
    let orderData: Order = await orderPromise;
    return orderData;
  }

  async editOrder(editedOrder: Order): Promise<any> {
    let editPromise = new Promise<any>((resolve, reject) => {

      this.http.put(this.url + '/edit/' + editedOrder._id, editedOrder).subscribe((data) => {
        resolve(data);
      }, (error) => {
        reject("HTTP error");
      });
    });
    let doneEdit: any = await editPromise;
    return doneEdit;
  }

  async deleteOrder(id): Promise<any> {
    let deletePromise = new Promise<any>((resolve, reject) => {
      this.http.delete(this.url + '/delete/' + id).subscribe((data) => {
        resolve(data);
      }, (error) => {
        reject("HTTP error");
      });
    });
    let deletedOrder: any = await deletePromise;
    return deletedOrder;
  }
}
