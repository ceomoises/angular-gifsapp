import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = "LiLbFlyUsHbtqIalzzr4QD4jpfNel1dv";
  private servicioUrl: string = "https://api.giphy.com/v1/gifs";
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial(){
    return [...this._historial];
  }

  // Solo se va a ejecutar una vez
  constructor(private http: HttpClient ){
    this._historial = JSON.parse( localStorage.getItem('historial')! ) || [] ;
    this.resultados = JSON.parse( localStorage.getItem('resultados')! ) || [] ;
    // 1ª manera de guardar el local storage 
    // if( localStorage.getItem('historial') ){
    //   this._historial = JSON.parse( localStorage.getItem('historial')! );
    // }
  }

  // Para usar el await tendria que ser async la función buscarGifs  
  // async
  buscarGifs(query: string = ''){
    query = query.trim().toLocaleLowerCase();

    if( !this._historial.includes(query) ){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);

      //Grabamos nuestro historial en Local Storage
      localStorage.setItem('historial', JSON.stringify(this._historial) );

    }

    const params = new HttpParams()
        .set('api_key',this.apiKey)
        .set('limit','10')
        .set('q', query);
      
    // console.log(params.toString);
    
    
    // Trabajando con HttpClient de Angular con Observables
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{params})
      .subscribe( ( resp ) => {
        // console.log( resp.data );
        this.resultados = resp.data;

        //Grabamos nuestros resultados en Local Storage
        localStorage.setItem('resultados', JSON.stringify(this.resultados ));

      }); //Se ejecuta al tener la resolución del get

    // ASYNC & AWAIT en Angular 
    // const resp = await fetch("https://api.giphy.com/v1/gifs/search?api_key=LiLbFlyUsHbtqIalzzr4QD4jpfNel1dv&q=dragon ball z&limit=10")
    // const data = await resp.json();
    // console.log(data);
    
    // SEMI - INFIERNO DE CALL BACKS 
    // fetch("https://api.giphy.com/v1/gifs/search?api_key=LiLbFlyUsHbtqIalzzr4QD4jpfNel1dv&q=dragon ball z&limit=10")
    //   .then( resp =>{
    //     resp.json().then(data => {
    //       console.log(data)
    //     })
    //   });

  }
}
