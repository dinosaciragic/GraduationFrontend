import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email: string = "";
  location: string = "";
  password: string = "";
  errorMsg: string = null;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  async register() {
    if (this.validate()) {
      let data = {
        email: this.email,
        location: this.location,
        password: this.password,
        isClient: true
      }

      let res = await this.authService.register(data);

      if (res && res.length > 0) {
        console.log(res[0].msg)
        this.errorMsg = res[0].msg;
      } else {
        this.errorMsg = null;
        
        let loginData = {
          email: this.email,
          password: this.password
        }

        await this.authService.login(loginData);
      }
    }
  }

  validate(): boolean {
    if (!this.email || this.email == "") {
      console.log('here')
      this.errorMsg = "Please enter E-mail";
      return false;
    } else if (!this.location || this.location == "") {
      console.log('here 2')
      this.errorMsg = "Please enter location";
      return false;
    } else if (!this.password || this.password == "") {
      console.log('here 3')
      this.errorMsg = "Please enter password";
      return false;
    } else {
      this.errorMsg = null;
      return true;
    }
  }

}
