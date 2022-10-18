import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private socket = io(environment.BASE_API_URL);

  constructor() { }

  public sendPointVisite(point){
    this.socket.emit('get_visite', point);
  }
}
