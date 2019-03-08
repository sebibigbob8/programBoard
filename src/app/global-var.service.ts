import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVarService {

  urlApi = 'http://localhost:3000/';
  constructor() { }
}
