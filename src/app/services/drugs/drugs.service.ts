import { Injectable } from '@angular/core';
import { Constants } from 'src/app/shared/constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Drug } from '../../models/Drug';

@Injectable({
  providedIn: 'root'
})
export class DrugsService {

  private url: string = Constants.API_URL + "drugs";

  constructor(
    private http: HttpClient
  ) { }

  async getDrugsPaged(page: number, searchTerm: string): Promise<Drug[]> {
    let drugsPagedPromise = new Promise<Drug[]>((resolve, reject) => {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('searchTerm', searchTerm.toString());

      this.http.get<any>(this.url, { params })
        .pipe(map(res => res as Drug[] || []))
        .subscribe((drugsPaged) => {
          resolve(drugsPaged);
        }, (error) => {
          console.log("HTTP ERROR - CollectionService: getdrugsPaged()", error);
          reject("HTTP error");
        });
    });

    let drugsPaged: Drug[] = await drugsPagedPromise;
    return drugsPaged;
  }
}
