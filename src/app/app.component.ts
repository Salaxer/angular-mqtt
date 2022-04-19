import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

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
  @ViewChild('terminal', { static: false }) public terminal!: ElementRef;

  clientID: string = `client${(Math.floor(Math.random()*1000))}`;
  connected: boolean = false;
  title: string = ""
  logs: Logs[] = [{
    color: "#ff6e6e",
    message: "Disconnected"
  }];

  MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
    url: "wss://0070dab94b6e4df894cff18d9cd6aa81.s1.eu.hivemq.cloud:8884/mqtt",
    clientId: this.clientID,
    username: "Salaxer",
    password: "mn!eFdYJ2gVes4k",
  }
  topic: string = "message";
  myMessage: string = "";

  SuscriptionsMessages?: Subscription;


  constructor(
    private _mqttService: MqttService,
  ) {
    this.connectMQTT();
    this._mqttService.onConnect.subscribe(data =>{
      this.connected = true;
      this.addLog('Connected', "#40ff40");
      this.readMessages();
    });
    this._mqttService.onClose.subscribe(data =>{
      this.connected = false;
      this.addLog('Disconnected', "#ff6e6e");
      this.closeMessages();
    });
  }

  connectMQTT(message?: string){
    if (!this.connected) {
      const messages = message ? message : "Connecting...";
      this.addLog(messages);
      return this._mqttService.connect(this.MQTT_SERVICE_OPTIONS);
    }else{
      this.addLog("already connected");
    }
  }

  disconnectMQTT(){
    if (this.connected) {
      this.addLog('disconnecting...');
      return this._mqttService.disconnect();
    }else{
      this.addLog('already disconnected');
    }
  }

  writteSomething(){
    if(!this.connected){
      this.addLog('You cannot send message while you are disconnected');
      this.connectMQTT('Trying to Reconnect...')
    }else{
      this.addLog('type something here');
    }
  }

  sendMessage(){
    this.addLog('Sending..');
    this._mqttService.publish(this.topic, this.myMessage, {properties: {userProperties: { name: this.clientID}}})
    .subscribe(data =>{
      this.addLog('Sended');
    })
  }

  readMessages(){
    this.SuscriptionsMessages = this._mqttService.observe(this.topic)
    .subscribe((data: IMqttMessage) =>{
      const message = data.payload.toString();
      if(this.myMessage == message){
        this.addLog(`me: ${message}`, "#6fc1dc");
        this.myMessage = "";
      }else{
        this.addLog(`Other person ${data.topic}: ${message}`, "#d5aa14");
      }
    })
  }

  closeMessages(){
    this.SuscriptionsMessages?.unsubscribe();
  }

  addLog(message: string, color: string = "white"){
    const log: Logs = {color,message};
    this.logs.push(log);
    setTimeout(() => {
      this.scrollDown();
    }, 200);
  }

  cleanLogs(){
    this.logs = [];
  }

  scrollDown(){
    (this.terminal.nativeElement as HTMLElement).scrollTo(0, (this.terminal.nativeElement as HTMLElement).scrollHeight)
  }

}
