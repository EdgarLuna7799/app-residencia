import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { BdService } from '../services/bd.service';
import { environment } from 'src/environments/environment';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public expedientes:any;
  public datos= [];
  public url = environment.url;
  constructor(
        private router: Router,
        private http: HttpClient,
        private appComponent:AppComponent,
        private serviceBd:BdService
  ) { }

  ngOnInit() {
    this.appComponent.validaSession();
    this.appComponent.cargaSucursalesPermitidas();
    //this.getExpedientes();
    console.log("inicio")
  }

  getExpedientes(){  
    
  }



}
