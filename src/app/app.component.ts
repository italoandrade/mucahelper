import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
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

    constructor(private toolbarService: UiToolbarService, private socket: Socket) {
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
    }
}
