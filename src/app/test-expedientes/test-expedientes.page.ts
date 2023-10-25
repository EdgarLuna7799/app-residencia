import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BdService } from '../services/bd.service';


@Component({
  selector: 'app-test-expedientes',
  templateUrl: './test-expedientes.page.html',
  styleUrls: ['./test-expedientes.page.scss'],
})



export class TestExpedientesPage implements OnInit {
  
  resultado : any; 
  url = environment.url;

  
 

  constructor(
    private serviceBd : BdService
    ) { }

  ngOnInit() {  
      this.InfoExpediente(1618);
  }

  InfoExpediente(expedienteId:number){ 
      let parametros = {
        "opcion":"testInfoExpediente",
        "tokenMovil": this.serviceBd.obtenerLocalStore("tokenSessionMovil"),
        "expedienteId":expedienteId 
      }
      console.log(parametros)
      this.serviceBd.peticionPost(this.url,parametros).subscribe(response=>{      
          this.resultado = response;          
      })

  }
  



}