import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonDatetime, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { BdService } from 'src/app/services/bd.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.page.html',
  styleUrls: ['./ingresos.page.scss'],
})
export class IngresosPage implements OnInit {
  fecha:string;
  hoy:string;
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  pipe = new DatePipe('en-US');
  fechaSeleccion:string;
  public loading;
  public respuesta:any;
  public url = environment.url;
  public ingresos:any[];

  constructor(
    public modalController: ModalController,
    private loadingController:LoadingController,
    public serviceBd:BdService,
    private toastController:ToastController,
    private actionSheetController: ActionSheetController
  ) { 
    this.hoy = this.pipe.transform(new Date(), 'yyyy-MM-dd');
    this.fechaSeleccion = this.pipe.transform(new Date(), 'yyyy-MM-dd');
    this.fecha = this.pipe.transform(new Date(), 'dd-MM-yyyy');
  }

  ngOnInit() {
    this.fecha = this.pipe.transform(new Date(), 'dd-MM-yyyy');
    this.BuscarIngresos();
  }

  formatDate(value: string) {
    this.fechaSeleccion = this.pipe.transform(value, 'yyyy-MM-dd');
    this.fecha = this.pipe.transform(value, 'dd-MM-yyyy');
    this.BuscarIngresos();
    return this.pipe.transform(value, 'dd-MM-yyyy');
    
  }

  BuscarIngresos(){
    this.loadingInit("Buscando Ingresos");
    let parametros ={
      "opcion":"BuscarIngresos",
      "tokenMovil": this.serviceBd.obtenerLocalStore("tokenSessionMovil"),
      "fecha": this.fechaSeleccion,
      "sucursalId":this.serviceBd.obtenerLocalStore("sucursalId")
          
    }
    console.log(parametros)
    
    this.serviceBd.peticionPost(this.url,parametros).subscribe(response=>{      
      this.respuesta = response;
      if(this.serviceBd.validaSession(this.respuesta.response)){     
          if(this.respuesta.response=="ok"){
            this.ingresos=this.respuesta.data;    
            console.log(this.ingresos)          
          }else if(this.respuesta.response=="fail"){
              console.log("algo salio mal")          
          }
      }
      if(this.loading){
          this.loading.dismiss();
      }   
    })
  }

  async OpcionesPago(folio,pagoId) {
    let buttons = [
            {
              text: 'Detalle' ,
              handler: () => {   
                
              }
            },
            {
              text: 'Editar' ,
              handler: () => {   
                  
              }
            }     
      ];
      const actionSheet = await this.actionSheetController.create({
        
        cssClass: 'my-custom-class',
        buttons: buttons
      });
      await actionSheet.present();
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
