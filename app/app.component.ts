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
    public trackingStarted:boolean = false;
    public isTracking:boolean = false;
    public noTripsLabel = "Record and log your trips";

    public loc$: Subject<geolocation.Location>;
    public watchId: number;
    public long$: Observable<number>;

    @ViewChild("mylabel") myLabel: ElementRef;

    public longs: string[] = [];

    constructor() {
        this.loc$ = new Subject();
        this.long$ = this.loc$.asObservable().map(l => l.longitude);
        this.long$.subscribe(v => {
            console.log(v);
            console.log(this.myLabel);
            this.longs.push(v.toString());
            this.myLabel.nativeElement.text = this.longs.join(' -> ');            
        });

    }

    ngOnInit() {


        // console.log('ask permission...');
        // const enabled = geolocation.isEnabled();
        // console.log(enabled);
        // if (!enabled) {
        //     geolocation.enableLocationRequest();
        // }
    }


    public startTracking() {
        this.trackingStarted = true;
        this.isTracking = true;


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


    }

     public stopTracking() {
        this.isTracking = false;
        geolocation.clearWatch(this.watchId);
    }

      public resumeTracking() {
        this.isTracking = true
    }

       public completeTracking() {
        this.isTracking = false
        this.trackingStarted = false
    }
}
