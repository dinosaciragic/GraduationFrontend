import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(
    private storage: NativeStorage
  ) { }

  public getAddedItems(): Promise<any[]> {
    return new Promise((resolve) => {
      this.storage.getItem("addedDrugs").then((items: any[]) => {
        resolve(items);
      }, (error) => {
        if (error.code == 2) {
          resolve([]);
        }
      });
    });
  }
}
