import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { IMqttServiceOptions, MqttModule } from "ngx-mqtt";
import { FormsModule } from '@angular/forms';

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  url: "wss://0070dab94b6e4df894cff18d9cd6aa81.s1.eu.hivemq.cloud:8884/mqtt",
  clientId: "clientId-rH6Kk21Dx6",
  username: "Salaxer",
  password: "mn!eFdYJ2gVes4k",
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
