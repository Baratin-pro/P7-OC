import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StatusService {

    // Service dédiée à contrôler le status (nom dédié) du bouton de connection 
    public status = new BehaviorSubject('status');

    constructor() { }

    setstatus(status) {
        this.status.next(status);
    }
}