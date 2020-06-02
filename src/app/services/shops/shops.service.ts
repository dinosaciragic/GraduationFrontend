import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Shop } from 'src/app/models/Shop';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShopsService {

  private url: string = Constants.API_URL + "shops";

  constructor(
    private http: HttpClient
  ) { }

  async getShopsPagedSearchFilter(page: number, searchTerm: string, shopType: string): Promise<Shop[]> {
    let shopsPagedPromise = new Promise<Shop[]>((resolve, reject) => {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('searchTerm', searchTerm.toString())
        .set('shopType', shopType.toString());

      this.http.get<any>(this.url, { params })
        .pipe(map(res => res as Shop[] || []))
        .subscribe((shopsPaged) => {
          resolve(shopsPaged);
        }, (error) => {
          console.log("HTTP ERROR - ShopsService: getShopsPagedSearchFilter()", error);
          reject("HTTP error");
        });
    });

    let shops: Shop[] = await shopsPagedPromise;
    return shops;
  }
}
