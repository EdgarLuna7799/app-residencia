import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { BdService } from 'src/app/services/bd.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-confirma',
  templateUrl: './confirma.page.html',
  styleUrls: ['./confirma.page.scss'],
})
export class ConfirmaPage implements OnInit {
  respuesta:any;
  public url = environment.url;
  public loading:any;
  public infoCita:any;
  public confirmacion="3";
  folio:any;

  @Input() id;

  constructor(
    private modalController:ModalController,
    private serviceBd:BdService,
    public loadingController:LoadingController,
    private toastController: ToastController
   // public appComponent:AppComponent
  ) { }

  ngOnInit() {
    this.citaDetalle();
  }

  checkValue(event){
      this.ActualizarRespuestaServer(event.detail.value);
       console.log(event.detail.value)
  }

  ActualizarRespuestaServer(respuesta:string){
    let parametros ={
      "opcion":"UpdateRespuestaConfirmacion",
      "tokenMovil": this.serviceBd.obtenerLocalStore("tokenSessionMovil"),
      "citaId": this.id,      
      "confirmacion" : respuesta     
    }
    this.serviceBd.peticionPost(this.url,parametros).subscribe(response=>{      
      this.respuesta = response;     
      if(this.serviceBd.validaSession(this.respuesta.response)){ 
          if(this.respuesta.response=="ok"){
              this.Mensaje("actualización exitosa");
          }else if(this.respuesta.response=="fail"){
            console.log("algo salio mal")
          //  this.appComponent.mensaje("",this.respuesta.error,"");
          }
      }
      
     
    })
  }


  async Mensaje(mensaje:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color:"success",
      duration: 1000,
      position: "top",
      icon: 'checkmark-outline',
    });
    toast.present();
  }

  citaDetalle() {
    console.log(this.id)
    this.loadingInit("Obteniendo información de la cita");
    let parametros ={
      "opcion":"infoCita",
      "tokenMovil": this.serviceBd.obtenerLocalStore("tokenSessionMovil"),
      "citaId":this.id      
    }
    this.serviceBd.peticionPost(this.url,parametros).subscribe(response=>{      
      this.respuesta = response;    
      if(this.serviceBd.validaSession(this.respuesta.response)){ 
          if(this.respuesta.response=="ok"){
              this.infoCita = this.respuesta.data;
              if(this.respuesta.data.folio){
                this.folio = this.respuesta.data.folio;
              }  
              
              if(this.respuesta.data.confirmacion){
                this.confirmacion = this.respuesta.data.confirmacion;
              }  
          }else if(this.respuesta.response=="fail"){
            console.log("algo salio mal")
          //  this.appComponent.mensaje("",this.respuesta.error,"");
          }
     }
      if(this.loading){
          this.loading.dismiss();
      }
     
    })
  }

  cerrarModal(){
    this.modalController.dismiss();
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
