import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { BdService } from 'src/app/services/bd.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  public respuesta:any;
  public url = environment.url;
  public infoCita:any;
  public loading:any;
  public foto:boolean=false;

  public background="background-color:#980000!important;color:#000"; 
  folio:string;
  status:string;
  tipoCita:string;
  programada: string;
  nombre : string;
  folioExp:string;
  captura:string;
  responsableImage:string;
  responsable:string;
  cancelador:string
  observaciones:string;
  cancelacion : boolean = false;
  observacionesCancelacion : string;
  motivoCancelacion: string;
  creada:string;

  @Input() id;
 

  constructor(
    private modalController:ModalController,
    private serviceBd:BdService,
    public loadingController:LoadingController
   // public appComponent:AppComponent
  ) { }

  ngOnInit() {
    this.citaDetalle();
  }
  citaDetalle() {
   // console.log(this.id)
    this.loadingInit("Obteniendo información de la cita");
    let parametros ={
      "opcion":"infoCita",
      "tokenMovil": this.serviceBd.obtenerLocalStore("tokenSessionMovil") ,
      "citaId":this.id      
    }
    this.serviceBd.peticionPost(this.url,parametros).subscribe(response=>{      
      this.respuesta = response;
      if(this.serviceBd.validaSession(this.respuesta.response)){     
      if(this.respuesta.response=="ok"){
           this.infoCita = this.respuesta.data;
           console.log("\n\n\n\n");
           console.log(this.infoCita);
           if(this.respuesta.data.folio){
             this.folio = this.respuesta.data.folio;
           }        

           if(this.respuesta.data.folio){
            this.folio = this.respuesta.data.folio;
          }

           if(this.respuesta.data.status){
            this.status = this.respuesta.data.status;
           }

           if(this.respuesta.data.statusId==3){
            this.cancelacion = true;
           }

           if(this.respuesta.data.responsableFoto){
            this.responsableImage = this.respuesta.data.responsableFoto;
           }
           if(this.respuesta.data.responsable){
            this.responsable = this.respuesta.data.responsable;
            if(this.responsable=="No asignado"){
              this.foto=true;
            }
           }
           
           if(this.respuesta.data.tipo){
            this.tipoCita = this.respuesta.data.tipo;
           }
           if(this.respuesta.data.programada.larga){
            this.programada = this.respuesta.data.programada.larga;
           }
           if(this.respuesta.data.capturado){
            this.captura = this.respuesta.data.capturado.nombre+" "+this.respuesta.data.capturado.apellidoPaterno;
           }
           if(this.respuesta.data.folioExp){
            this.folioExp = this.respuesta.data.folioExp;
           }

           if(this.respuesta.data.observaciones){
            this.observaciones = this.respuesta.data.observaciones;
           }
           if(this.respuesta.data.nombre){
            this.nombre  = this.respuesta.data.nombre+" "+this.respuesta.data.apPaterno+" "+this.respuesta.data.apMaterno;
           }

           if(this.respuesta.data.cancelado){
            this.cancelador  = this.respuesta.data.cancelado.nombre+" "+this.respuesta.data.cancelado.apellidoPaterno;
           }

           if(this.respuesta.data.observacionesCancelacion){
            this.observacionesCancelacion  = this.respuesta.data.observacionesCancelacion;
            this.motivoCancelacion  = this.respuesta.data.motivo;
           }
            this.creada = this.respuesta.data.captura.larga;


           if(this.respuesta.data.color){
             this.background = "color:"+this.respuesta.data.color+"!important";
           }
           
      }else if(this.respuesta.response=="fail"){
        console.log("algo salio mal")
      //  this.appComponent.mensaje("",this.respuesta.error,"");
      }
    }
      if(this.loading){
          this.loading.dismiss();
      }
     
      console.log(this.background)
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

  
}

}