import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;
  hasFailed: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.email = "";
    this.password = "";
    this.hasFailed = false;
  }

  async login() {
    let data = {
      email: this.email,
      password: this.password
    }

    let loginRes = await this.authService.login(data);

    if (loginRes && loginRes.length > 0) {
      this.hasFailed = true;
    }
  }

  register() {
    this.router.navigate(['register']);
  }

}
