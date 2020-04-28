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

  async getWorkerOrders(page: number): Promise<Order[]> {
    let ordersPromise = new Promise<Order[]>((resolve, reject) => {
      const params = new HttpParams()
        .set('page', page.toString());

      this.http.post<any>(this.url + '/workerOrders', { params })
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
}
