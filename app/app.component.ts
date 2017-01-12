import { Observable, Subject } from 'rxjs/Rx';
import { Page } from 'ui/page';
import { Component, ElementRef, ViewChild } from '@angular/core';

import { action, alert } from 'ui/dialogs';

import * as geolocation from 'nativescript-geolocation';

@Component({
    selector: "my-app",
    templateUrl: "app.component.html",
})
export class AppComponent {
    public counter: number = 16;

    public loc$: Subject<geolocation.Location>;

    public long: number;

    public watchId: number;

    public long$: Observable<number>;
    
    @ViewChild("mylabel") myLabel: ElementRef;

    constructor(p: Page) {

        this.loc$ = new Subject();

        this.long$ = this.loc$.asObservable().map(l => l.longitude);

        this.long$.subscribe(v => {
            console.log(v);
            console.log(this.myLabel);
            this.myLabel.nativeElement.text = v;            
        });

        p.actionBarHidden = true;


    }

    public get message(): string {
        if (this.counter > 0) {
            return this.counter + " taps left";
        } else {
            return "Hoorraaay! \nYou are ready to start building!";
        }
    }
    
    


    public onTap() {
        this.counter--;

        console.log(this.counter);

        this.watchId = geolocation.watchLocation((loc) => {
            if (loc) {
                this.loc$.next(loc);
                // this.myLabel.nativeElement.text = loc.longitude;
                console.log("Received location: " + loc.longitude);

                // alert(`Long is ${loc.longitude}`);
            }
        }, (e) => {
            console.log("Error: " + e.message);
        }, 
        {
            desiredAccuracy: 3, 
            updateDistance: 0, 
            minimumUpdateTime : 1000
        }); // Should update every 20 seconds according to Googe documentation. Not verified.


//        action('this is the message', 'cancel button', ['action 1', 'action 2', 'action 3']).then(val => alert(val));



    }
}
