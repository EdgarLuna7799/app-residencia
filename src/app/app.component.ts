import { registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { BdService } from './services/bd.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public url = environment.url;
  public session:boolean = false;
  public tokenSession: string = "";
  public nombre_mostrar:string;
  public email_mostrar:string;
  public respuesta :any;
  public loading:any;
  public sucursalSeleccion ;

  public sucursales:[];

  public appPages = [
  
    
  
    { title: 'Agenda', url: '/agenda', icon: 'calendar' },
    { title: 'Ingresos', url: '/ingresos', icon: 'trending-up' },
    { title: 'Ingresos', url: '/egresos', icon: 'trending-down' },
    { title: 'Test', url: '/test', icon: 'trending-down' },
    { title: 'Expedientes', url: '/test-expedientes', icon: 'aperture' },
    
  ];
  
  constructor(
    private serviceBd:BdService,
    public alertController: AlertController,
    public loadingController:LoadingController,
    private screenOrientation: ScreenOrientation
  ) {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }
  ngOnInit(): void {
    console.log(this.screenOrientation.type)
    this.sucursalSeleccion = this.serviceBd.obtenerLocalStore("sucursalId");
  
    this.cargaSucursalesPermitidas();
    
  }

  cargaSucursalesPermitidas(){
    let parametros = {
      "opcion":"sucursalesPermitidas",
      "tokenMovil":this.serviceBd.obtenerLocalStore("tokenSessionMovil") ,
      "personalId":this.serviceBd.obtenerLocalStore("personalId")
    }
    this.serviceBd.peticionPost(this.url,parametros).subscribe(response=>{      
      this.respuesta = response; 
      if(this.respuesta.response=="ok"){
          this.sucursales = this.respuesta.data;
          console.log(this.sucursales)
      }     
    })
  }

  onChange(valor){
    console.log("opcion seleccionada= "+valor);
    this.sucursalSeleccion = valor;
    this.serviceBd.saveLocalStore("sucursalId",valor);
    location.reload();
  }

  validaSession() {
    let session = 1;
    var pathname = window.location.pathname;
    if( localStorage.getItem("tokenSessionMovil") ){
      this.tokenSession =  this.serviceBd.obtenerLocalStore("tokenSessionMovil");
      let parametros = {
        "opcion":"validarSessionMovil",
        "tokenMovil":this.tokenSession,
        "token":this.tokenSession
      }
      this.serviceBd.peticionPost(this.url,parametros).subscribe(response=>{      
        this.respuesta = response; 
        if(this.respuesta.response=="ok"){
          this.AparecerMenu();
          this.session=true;      
          if(pathname=="/login"){
            window.location.href = "/agenda";
          }
        }else{
          
          if(pathname!="/login"){
            window.location.href = "/login";
          }
          this.serviceBd.deleteLocalStore("tokenSessionMovil");
          this.mensaje("Administrador ha finalizado tu sesión de manera remota","","");
        }       
      })
    
     
    }else{
      if(pathname!="/login"){
        window.location.href = "/login";
      }
    }
    
   
    
  }
  async mensaje(header:string,subHeader:string,message:string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  AparecerMenu(){
    this.cargaSucursalesPermitidas();
    this.nombre_mostrar = this.serviceBd.obtenerLocalStore("usuario");
    this.email_mostrar = this.serviceBd.obtenerLocalStore("email");
    this.session=true;
    this.sucursalSeleccion = this.serviceBd.obtenerLocalStore("sucursalId");
    
  }

  salir(){
    this.serviceBd.clearLocalStore();

    window.location.href = "/login";
  }

  async loadingInit(message:string) {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: message,
      duration: 2000
    });
    await this.loading.present();

    const { role, data } = await this.loading.onDidDismiss();
    console.log('Loading dismissed!');
  }


    
}