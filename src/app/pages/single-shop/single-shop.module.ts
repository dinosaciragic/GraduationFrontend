import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleShopPageRoutingModule } from './single-shop-routing.module';

import { SingleShopPage } from './single-shop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleShopPageRoutingModule
  ],
  declarations: [SingleShopPage]
})
export class SingleShopPageModule {}
