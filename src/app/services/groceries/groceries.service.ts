import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Grocerie } from 'src/app/models/Groceries';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroceriesService {

  private url: string = Constants.API_URL + "groceries";

  constructor(
    private http: HttpClient
  ) { }

  async getGroceriesPagedSearchFilter(page: number, searchTerm: string, category: string, subCategory: string): Promise<Grocerie[]> {
    let groceriesPagedPromise = new Promise<Grocerie[]>((resolve, reject) => {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('searchTerm', searchTerm.toString())
        .set('category', category.toString())
        .set('subCategory', subCategory.toString());

      this.http.get<any>(this.url, { params })
        .pipe(map(res => res as Grocerie[] || []))
        .subscribe((groceriesPaged) => {
          resolve(groceriesPaged);
        }, (error) => {
          console.log("HTTP ERROR - GroceriesService: getGroceriesPagedSearchFilter()", error);
          reject("HTTP error");
        });
    });

    let groceries: Grocerie[] = await groceriesPagedPromise;
    return groceries;
  }
}
