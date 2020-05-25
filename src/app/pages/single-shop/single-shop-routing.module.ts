import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleShopPage } from './single-shop.page';

const routes: Routes = [
  {
    path: '',
    component: SingleShopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleShopPageRoutingModule {}
