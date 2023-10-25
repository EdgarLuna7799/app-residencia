import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.page.html',
  styleUrls: ['./expedientes.page.scss'],
})
export class ExpedientesPage implements OnInit {

  constructor(private router: Router,private appComponent:AppComponent) { }

  ngOnInit() {
    this.appComponent.validaSession();
  }

  homePage(){
    this.router.navigate(['/home'])
  }

}
