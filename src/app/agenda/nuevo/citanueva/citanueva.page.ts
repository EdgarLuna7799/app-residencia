import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonDatetime, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { BdService } from 'src/app/services/bd.service';
import { environment } from 'src/environments/environment';
import { BuscarexpedientesPage } from './buscarexpedientes/buscarexpedientes.page';

@Component({
  selector: 'app-citanueva',
  templateUrl: './citanueva.page.html',
  styleUrls: ['./citanueva.page.scss'],
})
export class CitanuevaPage implements OnInit {
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  pipe = new DatePipe('en-US');
  public url = environment.url;
  fecha:string;
  hora:string;
  hoy:string;
  public loading;
  public respuesta:any;
  duraciones=[ { "id": "15", "label":"15 Minutos"  }, {  "id": "30", "label":"30 Minutos" },    {       "id": "60",      "label":"1 Hora"    },    {       "id": "90",      "label":"1 Hora 30 Minutos"    },    {       "id": "120",     "label":"2 Horas"    },    {       "id": "150",      "label":"2 Horas 30 Minutos"    },    {       "id": "180",      "label":"3 Horas"    },    {       "id": "210",      "label":"3 Horas 30 Minutos"    },    {       "id": "240",      "label":"4 Horas"    },    {       "id": "270",      "label":"4 Horas 30 Minutos"    },    {       "id": "300",      "label":"5 Horas"    }  ];
  tipoTelefonos=[{"id":"1","label":"Celular"},{"id":"2","label":"Casa"},{"id":"3","label":"Oficina"}]
  public duracionSeleccion = "0";
  tiposCita = [];
  fechaSeleccion:string;
  horaSeleccion:string;
  tipoCitaSeleccion:string="0";
  tipoTelefonoSeleccion="0";
 

  public expedienteLabel:string="Expediente no seleccionado"; 
  public expedientes:any[];
  

  public nombre = new FormControl('');
  public apPaterno = new FormControl('');
  public apMaterno = new FormControl('');
  public telefono = new FormControl('');
  public observaciones = new FormControl('');
  public expedienteId:string="0";
  public expedienteSeleccion: string;
  public botonLimpiar:boolean=false;



  nuevo:boolean=false;
  whatapps:boolean=false;
  llamadas:boolean=false;
  sms:boolean=false;


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
    this.ObtenerTipoCitas();
  }


 

  ObtenerTipoCitas() {
    this.loadingInit("Obteniendo tipo de citas");
    let parametros ={
      "opcion":"tipoCita",
      "tokenMovil": this.serviceBd.obtenerLocalStore("tokenSessionMovil") 
          
    }
    this.serviceBd.peticionPost(this.url,parametros).subscribe(response=>{      
      this.respuesta = response;
      if(this.serviceBd.validaSession(this.respuesta.response)){     
          if(this.respuesta.response=="ok"){
            this.tiposCita=this.respuesta.data;              
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

  onChangeTipoCita(valor:string){
    this.tipoCitaSeleccion=valor;
  }
  onChangeTipoTelefono(valor:string){
    this.tipoTelefonoSeleccion=valor;
  }

  
  onChangeDuracion(value:string){
    this.duracionSeleccion = value;
    console.log("duracion: "+this.duracionSeleccion)
    
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



  BorrarSeleccion(){
    this.expedienteId="0";
    this.expedienteLabel="Expediente no seleccionado"; 
    this.botonLimpiar=false;
  }

  async BuscarExpedientes() {
    const modalExpedientes = await this.modalController.create({
      component: BuscarexpedientesPage,
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1]
    });
     await modalExpedientes.present();
     const { data } = await modalExpedientes.onDidDismiss(); 
     if(data.expedienteId!="0"){
        this.expedienteLabel=data.expedienteLabel;
        this.expedienteId=data.expedienteId;
        this.botonLimpiar=true;
        console.log("seleccione un expediente: "+data.expedienteId+" "+data.expedienteLabel)
     }
  }

  SaveCita(){
    let mensaje="";
    let error=0;

    if(this.duracionSeleccion=="0"){
      error=1;      
      if(mensaje!=""){
        mensaje+="<br>Selecciona la duración de la cita";         
      }else{
        mensaje+="Selecciona la duración de la cita"; 
      }
    }
    if(this.tipoCitaSeleccion=="0"){
      error=1;      
      if(mensaje!=""){
        mensaje+="<br>Selecciona el tipo cita";         
      }else{
        mensaje+="Selecciona el tipo de cita"; 
      }
    }

    if(this.nuevo){
      if(this.nombre.value.trim().length==0){
        error=1;      
        if(mensaje!=""){
          mensaje+="<br>Nombre obligatorio";         
        }else{
          mensaje+="Nombre obligatorio"; 
        }
      }
      if(this.apPaterno.value.trim().length==0){ 
        error=1;      
        if(mensaje!=""){
          mensaje+="<br>Apellido paterno obligatorio";         
        }else{
          mensaje+="Apellido paterno obligatorio"; 
        }
       
      }
      if(this.apMaterno.value.trim().length==0){
        error=1;
        if(mensaje!=""){
          mensaje+="<br>Apellido materno obligatorio";         
        }else{
          mensaje+="Apellido materno obligatorio"; 
        }       
      }

      if(this.telefono.value.trim().length==0){
        error=1;
        if(mensaje!=""){
          mensaje+="<br>Teléfono de contacto obligatorio";         
        }else{
          mensaje+="Teléfono de contacto obligatorio"; 
        }       
      }else if(this.telefono.value.trim().length!=10){
        error=1;
        if(mensaje!=""){
          mensaje+="<br>Teléfono de contacto no valido";         
        }else{
          mensaje+="Teléfono de contacto no valido"; 
        } 
      }
      
      if(this.tipoTelefonoSeleccion=="0"){
        error=1;
        if(mensaje!=""){
          mensaje+="<br>Selecciona tipo de teléfono";         
        }else{
          mensaje+="Selecciona tipo de teléfono";
        } 
      }
      if(this.whatapps==false && this.llamadas==false && this.sms==false){
        error=1;
        if(mensaje!=""){
          mensaje+="<br>Selecciona al menos un tipo de contacto";         
        }else{
          mensaje+="Selecciona al menos un tipo de contacto";
        }      
      }
      if(error==1){
        this.Mensaje(mensaje,"danger");
        return ;
      }
    }else{
        if(this.expedienteId=="0"){
          error=1;
          if(mensaje!=""){
            mensaje+="<br>Selecciona un expediente";         
          }else{
            mensaje+="Selecciona un expediente";
          } 
        }




        if(error==1){
          this.Mensaje(mensaje,"danger");
          return ;
        }
    }
    this.loadingInit("Creando cita ");
    let parametros ={
      "opcion":"SaveCita",
      "tokenMovil": this.serviceBd.obtenerLocalStore("tokenSessionMovil"),
      "sucursalId": this.serviceBd.obtenerLocalStore("sucursalId"),
      "fecha": this.fechaSeleccion,
      "hora": this.hora,
      "duracion": this.duracionSeleccion,
      "observaciones": this.observaciones.value,
      "nuevo":this.nuevo,
      "expedienteId":this.expedienteId,
      "nombre": this.nombre.value,
      "apPaterno": this.apPaterno.value,
      "apMaterno": this.apMaterno.value, 
      "tipoCita": this.tipoCitaSeleccion,
      "tipoTel":this.tipoTelefonoSeleccion,
      "telefono":this.telefono.value,
      "whatsapp":this.whatapps,
      "llamadas":this.llamadas,
      "sms":this.sms
          
    }
    console.log(parametros) 
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



}
