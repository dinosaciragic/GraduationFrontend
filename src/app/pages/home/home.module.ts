import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { OrdersComponent } from 'src/app/components/orders/orders.component';
import { SettingsComponent } from 'src/app/components/settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  entryComponents: [
    OrdersComponent,
    SettingsComponent
  ],
  declarations: [
    HomePage,
    OrdersComponent,
    SettingsComponent
  ]
})
export class HomePageModule { }
