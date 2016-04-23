import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

import { Hero } from './hero';
import { HeroService } from './hero.service';

@Component({
  selector: 'my-dashboard',
  templateUrl: 'app/dashboard.component.html',
  styleUrls: ['app/dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(
    private _router: Router,
    private _heroService: HeroService) { 
  }

  /* Set needed variables while initiating to prevent errors 
  * ngOnInit is called right after the directive's data-bound properties
  *  have been checked for the first time, and before any of its children have been checked.
  *  It is invoked only once when the directive is instantiated.
  */
  ngOnInit() {
    // show loading info till heroes are fetched from server
    this.heroes = [{id: -1, name: 'Loading...'}];
    this._heroService.getHeroes()
    .then(heroes => this.heroes = heroes.slice(1,5));
    
    // this function represents the same then the line above.
    // But without the fat-arrow the 'this' context is bound to the function block (so self would be needed)
    // .then(function(heroes:Hero[]) {
    //     console.log(heroes);
    //     return this.heroes = heroes.slice(1,5);
    // });
  }

  gotoDetail(hero: Hero) {
    let link = ['HeroDetail', {id: hero.id}];
    this._router.navigate(link);
  }
}
