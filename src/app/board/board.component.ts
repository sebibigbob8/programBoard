import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalVarService} from '../global-var.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  teams;
  iterations;
  isReadyTeam;
  isReadyIteration;

  constructor(private http: HttpClient, public global: GlobalVarService) {
    this.teams = new Array();
    this.iterations = new Array();
    this.isReadyTeam = false;
    this.isReadyIteration = false;
  }

  /**
   * Retrieve teams and iterations
   */
  ngOnInit() {
    this.http.get(this.global.urlApi + 'teams').subscribe(teamsGet => {
      for (const team of Object.values(teamsGet)) {
        this.teams.push(team);
      }
      this.isReadyTeam = true;
    }, err => {
      console.error('error during teams retrieving', err);
    });
    this.http.get(this.global.urlApi + 'iterations').subscribe(iterationsGet => {
      for (const iteration of Object.values(iterationsGet)) {
        this.iterations.push(iteration);
      }
      this.isReadyIteration = true;
    }, err => {
      console.error('error during iterations retrieving', err);
    });
  }
  logIt(thing) {
    console.log(thing.number);
  }

}
