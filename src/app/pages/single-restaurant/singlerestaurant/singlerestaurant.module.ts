import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { SinglerestaurantPage } from './singlerestaurant.page';
import { RouterModule } from '@angular/router';
import { CheckoutSharedModule } from 'src/app/shared/checkout-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: SinglerestaurantPage
      }
    ]),
    CheckoutSharedModule
  ],
  declarations: [SinglerestaurantPage]
})
export class SinglerestaurantPageModule { }
