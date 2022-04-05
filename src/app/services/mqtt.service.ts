import { Injectable } from '@angular/core';

import { IMqttMessage, IMqttServiceOptions, MqttService } from "ngx-mqtt";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MyMqttService {

  opts: IMqttServiceOptions = {
    host: "0070dab94b6e4df894cff18d9cd6aa81.s1.eu.hivemq.cloud",
    port: 8884,
    clientId: "clientId-rH6Kk21Dx6",
    username: "Salaxer",
    password: "mn!eFdYJ2gVes4k",
  }

  constructor(
    private _mqttService: MqttService,
  ){
    this._mqttService.onConnect.subscribe(value =>{
      console.log(value);

    })
  }

  connect(){
    return this._mqttService.connect(this.opts);
  }

  disconnect(){
    return this._mqttService.disconnect();
  }

  getMessage(topic: string): Observable<IMqttMessage> {
    console.log(this._mqttService.observe(`/${topic}`));
    return this._mqttService.observe(`/${topic}`);
  }

  sendMessage(topic: string, message: string){
    return this._mqttService.publish(topic, message);
  }
}
