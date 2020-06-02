import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RestaurantItem } from 'src/app/models/RestaurantItem';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {

  private url: string = Constants.API_URL + "restaurants";

  constructor(
    private http: HttpClient
  ) { }

  async getRestaurantsPagedSearchFilter(page: number, searchTerm: string, restaurantName: string): Promise<RestaurantItem[]> {
    let restaurantsPagedPromise = new Promise<RestaurantItem[]>((resolve, reject) => {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('searchTerm', searchTerm.toString())
        .set('restaurantName', restaurantName.toString());

      this.http.get<any>(this.url, { params })
        .pipe(map(res => res as RestaurantItem[] || []))
        .subscribe((restaurantsPaged) => {
          resolve(restaurantsPaged);
        }, (error) => {
          console.log("HTTP ERROR - RestaurantssService: getRestaurantsPagedSearchFilter()", error);
          reject("HTTP error");
        });
    });

    let restaurants: RestaurantItem[] = await restaurantsPagedPromise;
    return restaurants;
  }
}
