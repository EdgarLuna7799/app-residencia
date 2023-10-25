import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { BdService } from 'src/app/services/bd.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detalle-evento',
  templateUrl: './detalle-evento.page.html',
  styleUrls: ['./detalle-evento.page.scss'],
})
export class DetalleEventoPage implements OnInit {
  public url = environment.url;
  public respuesta:any;
  public folio:string;
  public asunto:string;
  public capturado:string;
  public fechaCaptura:string;
  
  public infoEvento:any;
  public loading:any;
  public descripcion:string;
  public fechaProgramada:string;
  public duracion:string;
  @Input() id; 

  constructor(
    private modalController:ModalController,
    private serviceBd:BdService,
    public loadingController:LoadingController
  ) { }

  ngOnInit() {
    this.InfoEvento();
  }

  async loadingInit(message:string) {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: message,
      duration: 2000
    });
    await this.loading.present();
  
    
  }

  InfoEvento(){
    this.loadingInit("Obteniendo información del evento");
    let parametros ={
      "opcion":"infoEvento",
      "tokenMovil": this.serviceBd.obtenerLocalStore("tokenSessionMovil") ,
      "eventoId":this.id      
    }
    this.serviceBd.peticionPost(this.url,parametros).subscribe(response=>{      
      this.respuesta = response;
      if(this.serviceBd.validaSession(this.respuesta.response)){  
        console.log(this.respuesta)   
          if(this.respuesta.response=="ok"){
              this.infoEvento = this.respuesta.data;
              if(this.respuesta.data.asunto){
                this.asunto = this.respuesta.data.asunto;
              }       
              if(this.respuesta.data.descripcion){
                this.descripcion = this.respuesta.data.descripcion;
              }  
              if(this.respuesta.data.fechas.larga){
                this.fechaProgramada = this.respuesta.data.fechas.larga;
              } 
              if(this.respuesta.data.duracion){
                this.duracion = this.respuesta.data.duracion+" minutos";
              }     
              if(this.respuesta.data.nombre){
                this.capturado = this.respuesta.data.nombre;
              } 
              if(this.respuesta.data.apellidoPaterno!=null){
                this.capturado += " "+this.respuesta.data.apellidoPaterno;
              }  
              if(this.respuesta.data.apellidoMaterno!=null){
                this.capturado += " "+this.respuesta.data.apellidoMaterno;
              }     
              this.fechaCaptura = this.respuesta.data.fechaCaptura.larga;
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

}
