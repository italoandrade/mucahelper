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
            .on('updateUsersInfo', data => {
                this.users = data;
            });
    }

    ngAfterViewInit() {
        this.toolbarService.registerMainToolbar(document.getElementById('app-header'));
        this.toolbarService.activateExtendedToolbar(960);
        // this.getUsers();

        // setInterval(() => {
        //     this.getUsers();
        //     this.verifyReset();
        //     this.verifyDead();
        // }, 5000);
    }

    // getUsers() {
    //     this.http.get('http://189.35.176.127:1000/api')
    //         .map(data => {
    //             return data['_body'];
    //         })
    //         .subscribe(data => {
    //             const users = [];
    //
    //             const mucaInspection = document.createElement('div');
    //
    //             mucaInspection.innerHTML = data;
    //
    //             const $tabela = mucaInspection.querySelectorAll('.tabela');
    //
    //             const search =
    //                 [
    //                     ...Array.prototype.filter.call($tabela[1].querySelectorAll('tr'), (item, index) => index > 1),
    //                     ...Array.prototype.filter.call($tabela[2].querySelectorAll('tr'), (item, index) => index > 0)
    //                 ];
    //
    //             search.forEach(item => {
    //                 users.push({
    //                     name: item.querySelectorAll('td')[1].innerHTML,
    //                     level: parseInt(item.querySelectorAll('td')[2].innerHTML, 10),
    //                     resets: parseInt(item.querySelectorAll('td')[3].innerHTML, 10)
    //                 });
    //             });
    //
    //             users.forEach(user => {
    //                 let found = false;
    //                 this.users.forEach(thisUser => {
    //                     if (user.name === thisUser.name) {
    //                         found = true;
    //
    //                         if (user.level !== thisUser.level) {
    //                             thisUser.lastUpdate = new Date();
    //                         }
    //
    //                         thisUser.name = user.name;
    //                         thisUser.level = user.level;
    //                         thisUser.resets = user.resets;
    //                     }
    //                 });
    //
    //                 if (!found) {
    //                     this.users.push({
    //                         ...user
    //                     });
    //                 }
    //             });
    //         });
    // }

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
