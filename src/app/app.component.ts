import { Component, OnChanges, SimpleChanges } from '@angular/core';

import { IMqttServiceOptions, MqttService, IMqttMessage } from "ngx-mqtt";
import { Subscription } from 'rxjs';

interface Logs{
  message: string,
  color: string,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  selection: string = ""
  connected: boolean = false;
  title: string = ""
  logs: Logs[] = [{
    color: "#ff6e6e",
    message: "disconnected"
  }];

  MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
    url: "wss://0070dab94b6e4df894cff18d9cd6aa81.s1.eu.hivemq.cloud:8884/mqtt",
    clientId: "clientId-rH6Kk21Dx6",
    username: "Salaxer",
    password: "mn!eFdYJ2gVes4k",
  }
  topic: string = "message";
  myMessage: string = "";

  messageSubscription: Subscription = new Subscription();

  constructor(
    private _mqttService: MqttService,
  ) {
    this._mqttService.onConnect.subscribe(data =>{
      this.readMessages();
      this.selection = "Connected";
      this.connected = true;
      this.addLog(this.selection, "#40ff40");
    });
    this._mqttService.onClose.subscribe(data =>{
      this.selection = "Disconnected";
      this.connected = false;
      this.addLog(this.selection, "#ff6e6e");
    });
  }

  addLog(message: string, color: string = "white"){
    const log: Logs = {color,message}
    this.logs.push(log);
  }

  connectMQTT(message?: string){
    if (!this.connected) {
      this.selection = message ? message : "Connecting...";
      this.addLog(this.selection);
      return this._mqttService.connect(this.MQTT_SERVICE_OPTIONS);
    }else{
      this.selection = "already connected";
      this.addLog(this.selection);
    }
  }

  disconnectMQTT(){
    if (this.connected) {
      this.selection = "disconnecting...";
      this.addLog(this.selection);
      return this._mqttService.disconnect();
    }else{
      this.selection = "already disconnected";
      this.addLog(this.selection);
    }
  }

  writteSomething(){
    if(!this.connected){
      this.selection = "You cannot send message while you are disconnected"
      this.addLog(this.selection);
      this.connectMQTT('Trying to Reconnect...')
    }else{
      this.selection = "type something here";
      this.addLog(this.selection);
    }
  }

  sendMessage(){
    this.selection = "Sending..";
    this.addLog(this.selection);
    this._mqttService.publish(this.topic, this.myMessage)
    .subscribe(data =>{
      this.myMessage = "";
      this.selection = "Sended";
      this.addLog(this.selection);
    })
  }

  readMessages(){
    this.messageSubscription.add(
      this._mqttService.observe(this.topic)
      .subscribe((data: IMqttMessage) =>{
        const message = data.payload.toString();
        this.addLog(`new message Received: ${message}`, "#6fc1dc");
      })
    )
  }

}
