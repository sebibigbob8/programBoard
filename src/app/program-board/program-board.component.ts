import {AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Connections} from 'jsplumb';
import {ConnectionRequest} from '../../models/connection-request';
import {GlobalVarService} from '../global-var.service';

declare var jsPlumb: any;


@Component({
  selector: 'app-program-board',
  templateUrl: './program-board.component.html',
  styleUrls: ['./program-board.component.css']
})


export class ProgramBoardComponent implements AfterViewInit {

  jsPlumbInstance;
  connections;
  features;
  featuresLoaded;
  alreadyDrag;
  sourcePoint = {
    endpoint: 'Rectangle',
    paintStyle: {width: 15, height: 10, fill: '#666'},
    isSource: true,
    connectorStyle: {stroke: '#f44242'},
    maxConnections: 3,
    anchor: 'Right'
  };
  endPoint = {
    endpoint: 'Dot',
    paintStyle: {width: 15, height: 10, fill: '#666'},
    isTarget: true,
    maxConnections: 3,
    anchor: 'Left'
  };
  connectionRequest: ConnectionRequest;

  constructor(private http: HttpClient, public global: GlobalVarService) {
    this.connections = new Array();
    this.features = new Array();
    this.alreadyDrag = new Array();
    this.connectionRequest = new ConnectionRequest();
    this.getFeatures();
    this.featuresLoaded = false;
  }

  ngAfterViewInit() {
    this.jsPlumbInstance = jsPlumb.getInstance();
    this.drawDependencies();
  }

  /**
   * Retrieve all features from the API and save it in an array
   * Once they are all downloaded, the html elements are crated
   */
  getFeatures() {
    this.http.get(this.global.urlApi + 'features').subscribe(featuresGet => {
      for (const feature of Object.values(featuresGet)) {
        this.features.push(feature);
      }
      this.featuresLoaded = true;
      console.log('Array build');
    }, err => {
      console.error(err);
    });
  }

  /**
   * Retrieve all dependencies from the API and draw connections between features with jsPlumb
   */
  drawDependencies() {
    this.http.get(this.global.urlApi + 'dependencies').subscribe(dependencies => {
      for (const dependence of Object.values(dependencies)) {
        console.log(dependence.sourceId);
        this.jsPlumbInstance.connect({
          uuids: [`${dependence.sourceId}-source`, `${dependence.targetId}-end`]
        });
      }
    });
  }

  /**
   * Set jsPlumb attribute to html elements
   * htmlId
   */

  setParams(htmlId) {
    const found = this.alreadyDrag.find(function (element) {
      return element === htmlId;
    });
    if (typeof found !== 'undefined') {
      return;
    }
    this.jsPlumbInstance.draggable(htmlId);
    this.jsPlumbInstance.addEndpoint(htmlId, this.sourcePoint, {uuid: `${htmlId}-source`});
    this.jsPlumbInstance.addEndpoint(htmlId, this.endPoint, {uuid: `${htmlId}-end`});
    this.alreadyDrag.push(htmlId);
  }

  /**
   * Delete dependencies and save the new ones
   */
  saveConnections() {
    this.createTblConnections();
    if (!Array.isArray(this.connections)) {
      console.error('Not a correct array');
      return;
    }
    this.http.delete(this.global.urlApi + 'dependencies').subscribe(deleted => {
      console.log('Deleted', deleted);
      for (const connection of Object.values(this.connections)) {
        this.connectionRequest.sourceId = connection['sourceId'];
        this.connectionRequest.targetId = connection['targetId'];
        this.http.post(this.global.urlApi + 'dependencies', this.connectionRequest).subscribe(newConnection => {
          console.log('The new connection', newConnection);
        }, error1 => {
          console.error(error1);
        });
      }
    }, err => {
      console.error('Error during dependencies deleting', err);
    });
  }

  /**
   * Create the array where dependencies are stored
   */
  createTblConnections() {
    const tblConnections = this.jsPlumbInstance.getAllConnections();
    if (!Array.isArray(tblConnections)) {
      console.log('Drakeee ?! Array?!');
      return;
    }
    this.connections = [];
    for (const connection of Object.values(tblConnections)) {
      this.connections.push({sourceId: connection.sourceId, targetId: connection.targetId});
    }
  }
}
