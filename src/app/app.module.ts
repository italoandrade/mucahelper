import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {AppComponent} from './app.component';

import {SMNUIModule, UiToolbarService} from 'ng-smn-ui';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {SocketIoModule, SocketIoConfig} from 'ng-socket-io';

const config: SocketIoConfig = { url: 'http://189.35.176.127:3223', options: {} };

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        SMNUIModule,
        HttpModule,
        FormsModule,
        SocketIoModule.forRoot(config)
    ],
    providers: [UiToolbarService],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
