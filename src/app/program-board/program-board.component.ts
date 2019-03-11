import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConnectionRequest} from '../../models/connection-request';
import {GlobalVarService} from '../global-var.service';
import {BoardComponent} from '../board/board.component';

declare var $: any;
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
  mouseX;
  mouseY;
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

  constructor(private http: HttpClient, public global: GlobalVarService, private elementRef: ElementRef) {
    this.connections = new Array();
    this.features = new Array();
    this.alreadyDrag = new Array();
    this.connectionRequest = new ConnectionRequest();
    this.getFeatures();
    this.featuresLoaded = false;
    this.mouseX = 0;
    this.mouseY = 0;
  }


  /**
   * TODO :
   * !!!!!!!Limit the draggable area to the center. So the mouseup's position will always be at the correct place
   * Editable feature
   * save new feature
   * generate front ID
   * new jquery draggable syntax
   */
  ngAfterViewInit() {
    this.jsPlumbInstance = jsPlumb.getInstance();
    this.drawDependencies();


    $(document).ready(function () {
      $('.boardCell').on('dropFeature', function (e, featureId) {
        const feature = e;
        const cell = $(this)[0];
        const attr = $(this).attr('data-iteration');
        cell.offsetBottom = cell.offsetTop + cell.offsetHeight;
        cell.offsetRight = cell.offsetLeft + cell.offsetWidth;
        if ((feature.pageY > cell.offsetTop) &&
          (feature.pageY < cell.offsetBottom) &&
          (feature.pageX > cell.offsetLeft) &&
          (feature.pageX < cell.offsetRight)) {
          const cellIteration = $(this).attr('data-iteration');
          const cellTeam = $(this).attr('data-team');
          console.log('feature', featureId, '/team', cellTeam, '/iteration', cellIteration);
        }

      });
      let isDragging = false;
      let wasDragging = false;
      $('.customBox')
        .mousedown(function () {
          isDragging = false;
        })
        .mousemove(function () {
          isDragging = true;
        })
        .mouseup(function (e) {
          wasDragging = isDragging;
          isDragging = false;
          if (wasDragging) {
            $('.customBox').mousemove(function (b) {
              if (wasDragging) {
                const customClick = new jQuery.Event('dropFeature');
                customClick.pageX = b.pageX;
                customClick.pageY = b.pageY;
                $('.boardCell').trigger(customClick, $(this).attr('id'));
                wasDragging = false;
              }
            });
          }
        });

    });
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
      console.log(this.features);
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
        this.jsPlumbInstance.connect({
          uuids: [`${dependence.sourceId}-source`, `${dependence.targetId}-end`]
        });
      }
    });
  }

  /**
   * Set jsPlumb attributes to html elements
   * htmlId
   */

  setParams(theFeature) {
    const htmlId = theFeature.htmlId;
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
    if (typeof theFeature.team === 'undefined' || typeof theFeature.iteration === 'undefined') {
      return;
    }
    console.log(theFeature.team);
    const escapeIteration = theFeature.iteration.toString().replace(/\./g, '\\.');
    const stringSelector = `#${escapeIteration}-${theFeature.team}`;
    $(document).ready(function () {
      $('#login').appendTo(stringSelector); // #1\\.2-Alpha
    });
    console.log(stringSelector);
    console.log('#2\\\\.5-Alpha');

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
      console.error('Drakeee ?! Array?!');
      return;
    }
    this.connections = [];
    for (const connection of Object.values(tblConnections)) {
      this.connections.push({sourceId: connection.sourceId, targetId: connection.targetId});
    }
  }

  createFeature() {
    this.features.push({name: 'BAHH', htmlId: 'BAAAAAAAAAAAh'});
  }
}

