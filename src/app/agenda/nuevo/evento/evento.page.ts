import { Component, OnInit, ViewChild } from '@angular/core';
import { IonDatetime, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { BdService } from 'src/app/services/bd.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-evento',
  templateUrl: './evento.page.html',
  styleUrls: ['./evento.page.scss'],
})
export class EventoPage implements OnInit {
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  pipe = new DatePipe('en-US');
  fecha:string;
  hora:string;
  hoy:string;
  descripcion= new FormControl('');
  temas=[];
  public loading;
  public respuesta:any;

  duraciones=[{"id": "1000", "label":"Todo el día"  }, { "id": "15", "label":"15 Minutos"  }, {  "id": "30", "label":"30 Minutos" },    {       "id": "60",      "label":"1 Hora"    },    {       "id": "90",      "label":"1 Hora 30 Minutos"    },    {       "id": "120",     "label":"2 Horas"    },    {       "id": "150",      "label":"2 Horas 30 Minutos"    },    {       "id": "180",      "label":"3 Horas"    },    {       "id": "210",      "label":"3 Horas 30 Minutos"    },    {       "id": "240",      "label":"4 Horas"    },    {       "id": "270",      "label":"4 Horas 30 Minutos"    },    {       "id": "300",      "label":"5 Horas"    }  ];
  public duracionSeleccion = "0";
  public asunto = new FormControl('');

  fechaSeleccion:string;
  horaSeleccion:string;
  public url = environment.url;
  temaSeleccion:string="0";

  constructor(
    public modalController: ModalController,
    private loadingController:LoadingController,
    public serviceBd:BdService,
    private toastController:ToastController
  ) { 
    this.hoy = this.pipe.transform(new Date(), 'yyyy-MM-dd');
    this.fechaSeleccion = this.pipe.transform(new Date(), 'yyyy-MM-dd');
    this.horaSeleccion = this.pipe.transform(new Date(), 'HH:00');
    console.log("hoy: "+this.horaSeleccion);
  }

  ngOnInit() {    
    this.fecha = this.pipe.transform(new Date(), 'dd-MM-yyyy');
    this.hora = this.pipe.transform(new Date(), 'HH:00');
    this.ObtenerTemas();
  }

  ObtenerTemas(){
    this.loadingInit("Obteniendo temas");
    let parametros ={
      "opcion":"temas",
      "tokenMovil": this.serviceBd.obtenerLocalStore("tokenSessionMovil") 
          
    }
    this.serviceBd.peticionPost(this.url,parametros).subscribe(response=>{      
      this.respuesta = response;
      if(this.serviceBd.validaSession(this.respuesta.response)){     
          if(this.respuesta.response=="ok"){
            this.temas=this.respuesta.data;              
          }else if(this.respuesta.response=="fail"){
              console.log("algo salio mal")
          
          }
      }
      if(this.loading){
          this.loading.dismiss();
      }
     
    
    })
  }

  cerrarModal(){
    this.modalController.dismiss({ 
      response:"null"
    });

  }

  onChangeDuracion(value:string){
    this.duracionSeleccion = value;
    console.log("duracion: "+this.duracionSeleccion)
    
  }
  onChangeTema(value:string){
    this.temaSeleccion = value;
  }


  formatDateHora(value:string){
    this.hora = value;
    console.log("son las: "+this.hora)
    return this.hora;
  }
  formatDate(value: string) {
    this.fechaSeleccion = this.pipe.transform(value, 'yyyy-MM-dd');
    this.fecha = this.pipe.transform(value, 'dd-MM-yyyy');
    return this.pipe.transform(value, 'dd-MM-yyyy');
    
  }

  SaveEvento(){
    let mensaje = "";
    if(this.asunto.value.length==0){
      if(mensaje==""){ mensaje = "Asunto obligatorio"; }
    }
    if(this.temaSeleccion=="0"){
      if(mensaje==""){ mensaje = "Tema obligatorio"; }else{ mensaje += "<br>Tema obligatorio";  }
    }
    if(this.duracionSeleccion=="0"){
        if(mensaje==""){ mensaje = "Duración del evento obligatoria"; }else{ mensaje += "<br>Duración del evento obligatoria" }
    }
    if(mensaje!=""){ 
      this.Mensaje(mensaje,"danger");
      return;
    }
    let parametros ={
      "opcion":"SaveEvento",
      "tokenMovil": this.serviceBd.obtenerLocalStore("tokenSessionMovil"),
      "sucursalId": this.serviceBd.obtenerLocalStore("sucursalId"),
      "asunto": this.asunto.value,
      "fecha": this.fechaSeleccion,
      "hora": this.hora,
      "temaId": this.temaSeleccion,
      "descripcion": this.descripcion.value,
      "duracion": this.duracionSeleccion
          
    }
    this.serviceBd.peticionPost(this.url,parametros).subscribe(response=>{      
        this.respuesta = response;
        if(this.serviceBd.validaSession(this.respuesta.response)){     
            if(this.respuesta.response=="ok"){
              this.Mensaje(this.respuesta.mensaje,"success");   
              this.modalController.dismiss({
                response:"ok"
              });          
            }else if(this.respuesta.response=="fail"){
                this.Mensaje(this.respuesta.mensaje,"danger");            
            }
        }
        if(this.loading){
            this.loading.dismiss();
        }   
     })
  }

  async Mensaje(mensaje:string,color:string) {
    const toast = await this.toastController.create({
      message: mensaje,
      color: color,
      duration: 3000,
      position: "top",
      icon: 'alert-circle-outline',
    });
    toast.present();
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
