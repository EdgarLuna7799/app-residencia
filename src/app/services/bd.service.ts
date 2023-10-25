import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BdService {

  constructor(
    private http:HttpClient,
    private toastController: ToastController
  ) { }

  peticionGet(url:string){           
        return  this.http.get(url);
  }

  peticionPost(url:string,parametros:{}){
                    //Establecemos cabeceras
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');         
        return this.http.post(url, parametros, {headers: headers}) .pipe(
          catchError((err) => {            
            console.error(err);
            if(err.name=="HttpErrorResponse"){
              this.Error("No pudimos establecer contacto con el servidor<br>Verifica tu conexión a internet")
            }
    
            //Handle the error here
   
            return throwError(err);    //Rethrow it back to component
          })
        );
    }

    saveLocalStore(key:string,value:string){
        localStorage.setItem(key,value);
    }

    obtenerLocalStore(key:string):string{
      return localStorage.getItem(key);
    }

    deleteLocalStore(key:string){
      localStorage.removeItem(key)
    }

    clearLocalStore(){
      localStorage.clear();
    }

    validaSession(respuesta){
      if(respuesta=="failSession"){
        this.ErrorSession("Error Sesión no valida");
        this.deleteLocalStore("tokenSessionMovil");
        setTimeout(function(){
          window.location.href = "/login";
        },1000)
        return false;
      }else{
        return true;
      }
    }

    async ErrorSession(mensaje:string) {
      const toast = await this.toastController.create({
        message: mensaje,
        color:"danger",
        duration: 1000,
        position: "top",
        icon: 'shield-half-outline',
      });
      toast.present();
    }

    async Error(mensaje:string) {
      const toast = await this.toastController.create({
        message: mensaje,
        color:"danger",
        duration: 3000,
        position: "top",
        icon: 'shield-half-outline',
      });
      toast.present();
    }

  }


