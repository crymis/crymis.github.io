import { Component, OnInit } from 'angular2/core';
import { RouteParams } from 'angular2/router';

import { HeroService } from './hero.service';
import { Hero } from './hero';
import {FIREBASE_URL} from './constants';

@Component({
    selector: 'my-hero-detail',
    templateUrl: 'app/hero-detail.component.html',
    styleUrls: ['app/hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
    hero: Hero;
    id: number;
    timer: number = 0;

    constructor(
        private _heroService: HeroService,
        private _routeParams: RouteParams) {}

    ngOnInit() {
        // the + operator converts the string into a number
        this.id = +this._routeParams.get('id');
        this._heroService.getHero(this.id)
            .then(hero => this.hero = hero);
    }
    goBack() {
        window.history.back();
    }

    // save changes in input with delay (defer on typing)
    delayUpdate(newValue) {
        let firebaseHeroRef = new Firebase(FIREBASE_URL + this.id);
        firebaseHeroRef.update({ id: this.id, name: newValue });
    }

    onKey(event: any) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.delayUpdate(event.target.value) , 300);
    }
}