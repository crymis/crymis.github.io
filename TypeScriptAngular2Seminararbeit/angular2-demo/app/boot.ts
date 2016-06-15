// App bootstrapping is a separate concern from presenting a view.
// We might launch the AppComponent in multiple environments with different bootstrappers. 
// Testing the component is much easier if it doesn't also try to run the entire application. 
// Let's make the small extra effort to do it the right way.

import {bootstrap}    from 'angular2/platform/browser'
import {AppComponent} from './app.component'

// Tell TypeScript that Firebase is a global object.
declare var Firebase;

bootstrap(AppComponent, []);