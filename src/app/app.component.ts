import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
import {Http} from '@angular/http';
import {UiToolbarService} from 'ng-smn-ui';
import {Socket} from 'ng-socket-io';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
    users;
    alertOpen: boolean;

    constructor(private http: Http, private toolbarService: UiToolbarService, private socket: Socket) {
        this.users = [];

        this.socket
            .on('updateUsersInfo', users => {
                users.forEach(user => {
                    let found = false;
                    this.users.forEach(thisUser => {
                        if (user.name === thisUser.name) {
                            found = true;

                            thisUser.lastUpdate = user.lastUpdate ? new Date(user.lastUpdate) : null;
                            thisUser.name = user.name;
                            thisUser.level = user.level;
                            thisUser.resets = user.resets;
                        }
                    });

                    if (!found) {
                        this.users.push({
                            lastUpdate: user.lastUpdate ? new Date(user.lastUpdate) : null,
                            name: user.name,
                            level: user.level,
                            resets: user.resets
                        });
                    }
                });
            });

        this.socket
            .on('userReseted', user => {
                this.users.forEach(thisUser => {
                    if (user.name === thisUser.name && thisUser.alert) {
                        alert(user.name + ' resetou!');
                    }
                });
            });

        this.socket
            .on('userDead', user => {
                this.users.forEach(thisUser => {
                    if (user.name === thisUser.name && thisUser.alert) {
                        alert(user.name + ' não sobe de nível a mais de 10 minutos!');
                    }
                });
            });
    }

    ngAfterViewInit() {
        this.toolbarService.registerMainToolbar(document.getElementById('app-header'));
        this.toolbarService.activateExtendedToolbar(960);

        // setInterval(() => {
        //     this.verifyReset();
        //     this.verifyDead();
        // }, 5000);
    }

    // verifyReset() {
    //     this.users.forEach(user => {
    //         if (user.alert && !user.reseted) {
    //             if (user.resets <= 3 && user.level >= 300) {
    //                 if (!this.alertOpen) {
    //                     this.alertOpen = true;
    //                     user.reseted = true;
    //                     alert(user.name + ' resetou!');
    //                     this.alertOpen = false;
    //                 }
    //             } else if (user.resets <= 10 && user.level >= 325) {
    //                 if (!this.alertOpen) {
    //                     this.alertOpen = true;
    //                     user.reseted = true;
    //                     alert(user.name + ' resetou!');
    //                     this.alertOpen = false;
    //                 }
    //             } else if (user.resets <= 35 && user.level >= 350) {
    //                 if (!this.alertOpen) {
    //                     this.alertOpen = true;
    //                     user.reseted = true;
    //                     alert(user.name + ' resetou!');
    //                     this.alertOpen = false;
    //                 }
    //             } else if (user.resets <= 80 && user.level >= 375) {
    //                 if (!this.alertOpen) {
    //                     this.alertOpen = true;
    //                     user.reseted = true;
    //                     alert(user.name + ' resetou!');
    //                     this.alertOpen = false;
    //                 }
    //             } else if (user.resets <= 250 && user.level >= 400) {
    //                 if (!this.alertOpen) {
    //                     this.alertOpen = true;
    //                     user.reseted = true;
    //                     alert(user.name + ' resetou!');
    //                     this.alertOpen = false;
    //                 }
    //             }
    //         } else if (user.level < 10) {
    //             user.reseted = false;
    //         }
    //     });
    // }
    //
    // verifyDead() {
    //     this.users.forEach(user => {
    //             if (user.alert && user.lastUpdate) {
    //                 const currentDate = new Date().getTime();
    //                 const lastUpdateDate = user.lastUpdate.getTime();
    //
    //                 if ((currentDate - lastUpdateDate) > 600000) {
    //                     if (!this.alertOpen) {
    //                         this.alertOpen = true;
    //                         alert(user.name + ' não sobe de nível a mais de 10 minutos!');
    //                         user.lastUpdate = null;
    //                         this.alertOpen = false;
    //                     }
    //                 }
    //             }
    //         }
    //     );
    // }
}
