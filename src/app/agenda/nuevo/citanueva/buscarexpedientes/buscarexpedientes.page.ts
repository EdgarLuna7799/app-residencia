import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { BdService } from 'src/app/services/bd.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-buscarexpedientes',
  templateUrl: './buscarexpedientes.page.html',
  styleUrls: ['./buscarexpedientes.page.scss'],
})
export class BuscarexpedientesPage implements OnInit {
  public url = environment.url;
  public loading;
  public respuesta:any;
  public expedientes:any[];
  public expedienteId:string;
  

  constructor(
    public modalController: ModalController,
    private loadingController:LoadingController,
    public serviceBd:BdService,
    private toastController:ToastController
  ) { }

  ngOnInit() {
  }

  cerrarModal(){
    this.modalController.dismiss({ 
      expedienteId:"0",
      expedienteLabel:""
    });

  }

  SeleccionarExpediente(expedienteId:string,index:number){
    this.expedienteId=expedienteId;
    this.modalController.dismiss({ 
      expedienteId: this.expedienteId,
      expedienteLabel:this.expedientes[index]["folio"]+" "+this.expedientes[index]["nombre"]+" "+this.expedientes[index]["apPaterno"]+" "+this.expedientes[index]["apMaterno"]
    });
  }

  BuscarExpedientes(query:string){
    let parametros ={
      "opcion":"buscarExpedienteAutocomplete",
      "tokenMovil": this.serviceBd.obtenerLocalStore("tokenSessionMovil"),
      "sucursalId": this.serviceBd.obtenerLocalStore("sucursalId"),
      "query":query 
          
    }
    this.serviceBd.peticionPost(this.url,parametros).subscribe(response=>{      
      this.respuesta = response;
      if(this.serviceBd.validaSession(this.respuesta.response)){     
          if(this.respuesta.response=="ok"){
            this.expedientes=this.respuesta.data;              
          }else if(this.respuesta.response=="fail"){
              console.log("algo salio mal")
          
          }
      }
      if(this.loading){
          this.loading.dismiss();
      }
     
    
    })
  }

}
