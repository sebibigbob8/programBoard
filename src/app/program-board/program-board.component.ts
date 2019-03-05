import {AfterViewInit, Component, OnInit} from '@angular/core';

declare var jsPlumb: any;


@Component({
  selector: 'app-program-board',
  templateUrl: './program-board.component.html',
  styleUrls: ['./program-board.component.css']
})


export class ProgramBoardComponent implements AfterViewInit {

  jsPlumbInstance;
  showConnectionToggle = false;
  endpointOptions = {isSource: true, isTarget: true};
  exampleGreyEndpointOptions = {
    endpoint: 'Rectangle',
    paintStyle: {width: 25, height: 21, fill: '#666'},
    isSource: true,
    connectorStyle: {stroke: '#666'},
    isTarget: true
  };

  ngAfterViewInit() {
    this.jsPlumbInstance = jsPlumb.getInstance();
    /*
    this.jsPlumbInstance.draggable(['Source', 'Target1', 'Target2']);
    this.jsPlumbInstance.addEndpoint(['Source', 'Target1', 'Target2'], this.exampleGreyEndpointOptions); */
    this.jsPlumbInstance.importDefaults({
      Anchors: ['Left', 'BottomRight']
    });
  }

  showConnectOnClick() {
    this.showConnectionToggle = !this.showConnectionToggle;
    if (this.showConnectionToggle) {
      this.jsPlumbInstance = jsPlumb.getInstance();
      this.connectSourceToTargetUsingJSPlumb();
    } else {
      this.jsPlumbInstance.reset();
    }
  }

  connectSourceToTargetUsingJSPlumb() {
    let labelName;
    labelName = 'connection';
    this.jsPlumbInstance.connect({
      connector: ['Flowchart', {stub: [212, 67], cornerRadius: 1, alwaysRespectStubs: true}],
      source: 'Source',
      target: 'Target1',
      anchor: ['Right', 'Left'],
      paintStyle: {stroke: '#456', strokeWidth: 4},
      overlays: [
        ['Label', {label: labelName, location: 0.5, cssClass: 'connectingConnectorLabel'}]
      ],
    });

  }
}
