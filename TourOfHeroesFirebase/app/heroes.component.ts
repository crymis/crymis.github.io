import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';

import {Hero} from './hero';
import {HeroDetailComponent} from './hero-detail.component';
import {HeroService} from './hero.service';

@Component({
    // The selector specifies a simple CSS selector for an HTML element that represents the component.
    selector: 'my-heroes',
    // The template specifies the component's companion template,
    // written in an enhanced form of HTML that tells Angular how to render this component's view.
    // !Must specify the path all the way back to the application root.
    templateUrl: 'app/heroes.component.html',
    // these styles are only applied to this component. No other component
    // will get these css rules -> They are hidden in the ShadowDOM
    // !Must specify the path all the way back to the application root.
    styleUrls: ['app/heroes.component.css'],
    directives: [HeroDetailComponent]
})
export class HeroesComponent implements OnInit {
    heroes: Hero[];
    selectedHero: Hero;

    constructor(
        private _router: Router,
        private _heroService: HeroService) { };

    getHeroes() {
        // use the getHeroesSlowly() method to see how the promise works
        this._heroService.getHeroes().then(heroes => this.heroes = heroes);
    }

    // init the component with data from somewhere (like a server)
    ngOnInit() {
        this.getHeroes();
    }

    onSelect(hero: Hero) {
        this.selectedHero = hero;
    };

    gotoDetail() {
        this._router.navigate(['HeroDetail', { id: this.selectedHero.id }]);
    }
}