import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgxGraphModule} from '@swimlane/ngx-graph';
import {GraphComponent} from './graph/graph.component';
import {RouterModule, Routes} from '@angular/router';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ProgramBoardComponent} from './program-board/program-board.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import { BoardComponent } from './board/board.component';


const appRoutes: Routes = [
  {path: 'graph', component: GraphComponent},
  {path: 'programBoard', component: ProgramBoardComponent},
  {path: 'board', component: BoardComponent},
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    ProgramBoardComponent,
    BoardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxGraphModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true} // <-- debugging purposes only
    ),
    NgxChartsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    NgbModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
