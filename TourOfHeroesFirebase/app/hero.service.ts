import {Injectable} from 'angular2/core';
import {FIREBASE_REF} from './constants';
import {Hero} from './hero';
import {FirebaseService} from 'firebase-angular2/core'

// Don't forget the parentheses! Neglecting them leads to an error that's difficult to diagnose.
@Injectable()
export class HeroService {

    getHeroes() {
        let heroes: Hero[] = [];
        
        let heroesPromise = new Promise(function(resolve, reject) {
            FIREBASE_REF.on('value', function(snapshot) {
                var heroesRef: {} = snapshot.val();
                for (let hero in heroesRef) {
                    heroes.push(heroesRef[hero]);
                }
                if (heroes.length >= 0) {
                    resolve(heroes);
                } else {
                    reject(heroes);
                }
            }, function(error) {
                reject(error);
            })
        });
        return heroesPromise;
    }

    // getHeroesSlowly() {
    //     return new Promise<Hero[]>(resolve =>
    //         setTimeout(() => resolve(HEROES), 2000) // 2 seconds
    //     );
    // }

    /* Get one specific hero by id */
    getHero(id: number) {
        return Promise.resolve(this.getHeroes()).then(
            heroes => heroes.filter(hero => hero.id === id)[0]
        );
    }
}