import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.page.html',
  styleUrls: ['./restaurants.page.scss'],
})
export class RestaurantsPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  navigateToMc() {
    let navigationExtras: NavigationExtras = {
      state: {
        restaurantName: "McDonald's"
      }
    };

    this.router.navigate(['pages', 'singlerestaurant'], navigationExtras);
  }

  navigateToMn() {
    let navigationExtras: NavigationExtras = {
      state: {
        restaurantName: "Montana"
      }
    };

    this.router.navigate(['pages', 'singlerestaurant'], navigationExtras);
  }

  navigateToCh() {
    let navigationExtras: NavigationExtras = {
      state: {
        restaurantName: "Chipas"
      }
    };

    this.router.navigate(['pages', 'singlerestaurant'], navigationExtras);
  }

  navigateToPsh() {
    let navigationExtras: NavigationExtras = {
      state: {
        restaurantName: "Pasha"
      }
    };

    this.router.navigate(['pages', 'singlerestaurant'], navigationExtras);
  }

}
