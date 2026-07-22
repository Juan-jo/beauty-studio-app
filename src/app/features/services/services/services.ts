
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(
    private http: HttpClient,
    private config: AppConfigService
   ){}

  
   getServices(){

    return this.http.get(
      `${this.config.apiUrl}/api/v1/public/salon/${this.config.salonSerial}/services`
    );
  }


  getAll(){

    return [

      {

        id:1,

        name:'Gelish',

        duration:'45 min',

        price:250,

        image:'assets/gelish.webp'

      },

      {

        id:2,

        name:'Uñas Acrílicas',

        duration:'2 horas',

        price:650,
        image:'assets/acrilicas.webp'

      },

      {

        id:3,

        name:'Pedicure Spa',

        duration:'60 min',

        price:420,
        image:'assets/pedicure.webp'

      }

    ];

  }

}