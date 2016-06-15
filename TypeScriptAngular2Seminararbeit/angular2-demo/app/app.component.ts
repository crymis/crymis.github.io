import { Component, OnInit } from 'angular2/core';

import { Hero } from './hero';
import { HeroService } from './hero.service';

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [HeroService]
})
export class AppComponent implements OnInit {
  heroes: Hero[] = [];
  name: string = "";

  constructor(
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
    this.getHeroes();
  }

  getHeroes() {
    this._heroService.getHeroes()
      .then(heroes => this.heroes = heroes);

    // this function represents the same then the line above.
    // But without the fat-arrow the 'this' context is bound to the function block (so self would be needed)
    // .then(function(heroes:Hero[]) {
    //     console.log(heroes);
    //     return this.heroes = heroes.slice(1,5);
    // });
  }

  addHero(name: string) {
    let newId = 0;
    if (this.heroes.length > 0) {
      newId = this.heroes[this.heroes.length - 1].id + 1;
    }
    this._heroService.addHero({'id': newId, 'name': name});
    this.getHeroes();
    this.name = "";
  }
  
  deleteHero(hero: Hero) {
    this._heroService.deleteHero(hero);
    this.getHeroes();
  }

}
