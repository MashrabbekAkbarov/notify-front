import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PushNotificationService } from './services/push-notification.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [
    FormsModule,
    MatSnackBarModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ],
  providers: [PushNotificationService],
  bootstrap: [AppComponent]
})
export class AppModule {}
