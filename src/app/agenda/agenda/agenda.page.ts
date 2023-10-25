import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController, ToastController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { BdService } from 'src/app/services/bd.service';
import { environment } from 'src/environments/environment';
import { ConfirmaPage } from '../confirma/confirma.page';
import { DetalleEventoPage } from '../detalle-evento/detalle-evento.page';
import { DetallePage } from '../detalle/detalle.page';
import { CitanuevaPage } from '../nuevo/citanueva/citanueva.page';
import { EventoPage } from '../nuevo/evento/evento.page';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  public fecha: Date;
  public fecha_buscar:string;
  public fecha_seleccion:string;
  public eventos = [];
  public respuesta : any;
  public emptyMessage=false;
  pipe = new DatePipe('en-US');
  public url = environment.url;



  constructor(
         
        private appComponent:AppComponent,
        private serviceBd:BdService,
        private modalController: ModalController,
        private actionSheetController: ActionSheetController,
        private alertController: AlertController,
        private toastController:ToastController
  ) { }

  ngOnInit() {
    this.appComponent.loadingInit("Sincronizando citas y eventos");
       this.appComponent.validaSession();
       this.fecha_buscar = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
       this.cambioFecha(this.fecha_buscar);
       let scope=this;
      setInterval(()=>{
         scope.reloadDatos(false);
       },30000);

       
  }

  seleccionCalendar(){
    this.appComponent.loadingInit("Sincronizando citas y eventos");
    this.fecha_buscar = this.pipe.transform(this.fecha, 'yyyy-MM-dd');
    this.cambioFecha(this.fecha_buscar);
  }

  cambioFecha(fecha:string){      
    let parametros ={
      "opcion":"CitasEvents",
      "tokenMovil": this.serviceBd.obtenerLocalStore("tokenSessionMovil"),
      "personalId":this.serviceBd.obtenerLocalStore("personalId"),
      "sucursalId":this.serviceBd.obtenerLocalStore("sucursalId"),
      "roleId":this.serviceBd.obtenerLocalStore("roleId"),
      "fechaInicio": fecha+" 00:00:01",
      "fechaFin": fecha+" 23:59:59",
    }
    
    this.serviceBd.peticionPost(this.url,parametros).subscribe(response=>{      
      this.respuesta = response;       
      if(this.serviceBd.validaSession(this.respuesta.response)){
          if(this.respuesta.response=="ok"){
              this.eventos = this.respuesta.data;  
              if(this.eventos.length==0){
                this.emptyMessage=false;
              }else{
                this.emptyMessage=true;
              }    
              this.fecha_seleccion=this.respuesta.fechaSeleccion.larga; 
          }else if(this.respuesta.response=="fail"){
            this.appComponent.mensaje("",this.respuesta.error,"");
          }
      }
      if(this.appComponent.loading){
          this.appComponent.loading.dismiss();
      }
     
      console.log(this.respuesta)
    })
  }

  reloadDatos(mostrarLoadin:boolean){
    if(mostrarLoadin){
      this.appComponent.loadingInit("Sincronizando citas y eventos");
    }
    
    this.cambioFecha(this.fecha_buscar);
  }


 async OpcionesNuevo() {
  let buttons = [
          {
            text: 'Nueva cita' ,
            handler: () => {   
              this.nuevoCitaNueva();
            }
          },
          {
            text: 'Nuevo evento' ,
            handler: () => {   
                this.nuevoEvento(); 
            }
          }     
    ];
    const actionSheet = await this.actionSheetController.create({
      
      cssClass: 'my-custom-class',
      buttons: buttons
    });
    await actionSheet.present();
 }


  async OpcionesCita(title:string,cita:boolean,status:number,id:number) {
    let buttons=[];
    if(cita){
        if(status==1 ){
         buttons = [{
            text: 'Detalle' ,
            role: 'destructive',
            icon: 'list-outline',
             handler: () => {
              this.Infocita(id);
            }
          }, {
            text: 'Confirmación',
            icon: 'call-outline',
            data: 10,
            handler: () => {
              this.confirmarCita(id);
            }
          },{
            text: 'Cancelar',         
            icon: 'close-circle-outline',            
            data: {
              type: 'delete'
            },
            handler: () => {
              console.log('Delete clicked');
            }
          },{
            text: 'Eliminar',     
            icon: 'trash',                        
            handler: () => {
              console.log('Delete clicked');
              this.ConfirmarEliminacion(id,title)
            }
          }];
        }else if(status==4 || status==2){
          buttons = [{
            text: 'Detalle' ,
            role: 'destructive',
            icon: 'list-outline',
             handler: () => {
              this.Infocita(id);
            }
          }, {
            text: 'Próxima cita',          
            icon: 'calendar-outline',
            id: 'delete-button',
            data: {
              type: 'delete'
            },
            handler: () => {
              console.log('Delete clicked');
            }
          }];
        }else if(status==3){
          buttons = [{
            text: 'Detalle' ,
            role: 'destructive',
            icon: 'list-outline',
             handler: () => {
              this.Infocita(id);
            }
          }];
        }
    }else{
      if(status==1){
        buttons = [{
          text: 'Detalle '+id ,
          role: 'destructive',
          icon: 'list-outline',
           handler: () => {
            this.InfoEvento(id);
          }
        }];
       }
    }

    const actionSheet = await this.actionSheetController.create({
      header: title.toUpperCase() ,
      cssClass: 'my-custom-class',
      buttons: buttons
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  async nuevoCitaNueva(){
    const modalNewCitaNueva = await this.modalController.create({
      component: CitanuevaPage,
      cssClass: 'my-custom-class'
    });
     await modalNewCitaNueva.present();
    const { data } = await modalNewCitaNueva.onDidDismiss(); 
    console.log(data)
    if(data.response=="ok"){
      this.reloadDatos(true);
    }
  }
  async nuevoEvento(){
    const modal = await this.modalController.create({
      component: EventoPage,
      cssClass: 'my-custom-class'
    });
     await modal.present();
    const { data } = await modal.onDidDismiss(); 
    console.log(data)
    if(data.response=="ok"){
      this.reloadDatos(true);
    }
  }

  async InfoEvento(id:number){
    const modalEvento = await this.modalController.create({
      component: DetalleEventoPage,
      componentProps:{
        id:id
      },
      cssClass: 'my-custom-class'
    });
     await modalEvento.present();
  }
  async Infocita(id:number) {
    const modal = await this.modalController.create({
      component: DetallePage,
      componentProps:{
        id:id
      },
      cssClass: 'my-custom-class'
    });
     await modal.present();
    

  }


  async   confirmarCita(id:number) {
    const modal = await this.modalController.create({
      component: ConfirmaPage,
      componentProps:{
        id:id
      },
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }





  async ConfirmarEliminacion(id:number,title:string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Desea eliminar esta cita?',
      message: '<strong>'+title+'</strong>!!!',
      buttons: [
        {
          text: 'no',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('No quiero eliminar ' + id);
          }
        }, {
          text: 'Si, eliminar',
          id: 'confirm-button',
          handler: () => {
            this.EliminarCita(id);
          }
        }
      ]
    });

    await alert.present();
  }


 EliminarCita(id:number){  
  this.appComponent.loadingInit("eliminando cita");
    let parametros ={
      "opcion":"eliminarCita",
      "tokenMovil": this.serviceBd.obtenerLocalStore("tokenSessionMovil"),
      "citaId":id      
    }
    this.serviceBd.peticionPost(this.url,parametros).subscribe(response=>{      
      this.respuesta = response;       
     
      if(this.respuesta.response=="ok"){
          this.Mensaje(this.respuesta.mensaje,"success","top","checkmark-circle-outline");
          this.reloadDatos(false);
      }

      if(this.appComponent.loading){
          this.appComponent.loading.dismiss();
      }
     
      console.log(this.respuesta)
    })
  }


  async Mensaje(mensaje:string,color:string,posicion:any,icono:string) {
    const toast = await this.toastController.create({
      message:mensaje,
      duration: 2000,
      color:color,
      icon:icono,
      position: posicion
      
    });
    toast.present();
  }
}
