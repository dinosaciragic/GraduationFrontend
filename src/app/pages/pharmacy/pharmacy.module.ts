import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PharmacyPage } from './pharmacy.page';
import { RouterModule } from '@angular/router';
import { CheckoutComponent } from 'src/app/components/checkout/checkout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: PharmacyPage
      }
    ])
  ],
  entryComponents: [
    CheckoutComponent
  ],
  declarations: [
    PharmacyPage,
    CheckoutComponent
  ]
})
export class PharmacyPageModule { }
