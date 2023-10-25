import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { BdService } from 'src/app/services/bd.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public email = new FormControl('');
  public passwd = new FormControl('');
  public url = environment.url;
  public inicio :any;
  public tokenMovil:string="";
  public infoPersonal : {};
  constructor(
        private appComponent:AppComponent,
        private router: Router,
        private serviceBd:BdService
        ) { }

  ngOnInit() {
    this.tokenMovil=this.serviceBd.obtenerLocalStore("tokenSessionMovil");
    this.appComponent.validaSession();
  }



  InicioSession(){
    this.appComponent.loadingInit("iniciando sesión");
    let parametros ={
      "opcion":"loginApp",
      "usuario":this.email.value,
      "passwd":this.passwd.value
    }
    this.serviceBd.peticionPost(this.url,parametros).subscribe(response=>{      
    this.inicio = response;      
      
    if(this.inicio.response=="ok"){
        this.infoPersonal = this.inicio.data;
        this.serviceBd.saveLocalStore("usuario",this.inicio.data.nombre);
        this.serviceBd.saveLocalStore("email",this.inicio.data.email);
        this.serviceBd.saveLocalStore("roleId",this.inicio.data.roleId);
        this.serviceBd.saveLocalStore("personalId",this.inicio.data.personalId);
        this.serviceBd.saveLocalStore("sucursalId",this.inicio.data.sucursalIdDefault);
        this.serviceBd.saveLocalStore("tokenSessionMovil",this.inicio.data.tokenMovil);
        this.appComponent.AparecerMenu();
        if(this.appComponent.loading){
          this.appComponent.loading.dismiss();
        }
        window.location.href = "/agenda";
    }else if(this.inicio.response=="fail"){      
          if(this.appComponent.loading){
            this.appComponent.loading.dismiss();             
          }
          let scope=this;
          setTimeout(function(){
            scope.appComponent.mensaje("",scope.inicio.error,"");
          }, 500);
     }       
      
      
      console.log(this.inicio)
    }, err => console.log('HTTP Error', err))
    
  }

}
