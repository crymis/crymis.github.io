import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';

import { HeroService } from './hero.service';
import { HeroesComponent } from './heroes.component';
import { DashboardComponent } from './dashboard.component';
import { HeroDetailComponent } from './hero-detail.component'; 

@Component({
    selector: 'my-app',
    template: `
                <h1>{{title}}</h1>
                <nav>
                    <a [routerLink]="['Dashboard']">Dashboard</a>
                    <a [routerLink]="['Heroes']">Heroes</a>
                </nav>
                <router-outlet></router-outlet>
    `,
    styleUrls: ['app/app.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [HeroService, ROUTER_PROVIDERS]
})
@RouteConfig([
    {
        path: '/heroes',
        name: 'Heroes',
        component: HeroesComponent
    }, 
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardComponent,
        // the browser launches with / when starting. 
        // useAsDefault sets the specific route as start route
        useAsDefault: true
    },
    {
        // the colon (:) in front of id means that id is a variable
        path: '/detail/:id',
        name: 'HeroDetail',
        component: HeroDetailComponent
    }
])
export class AppComponent {
    title = 'Tour of Heroes';
};