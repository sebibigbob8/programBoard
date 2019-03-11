# `Program Board avec Angular et JSPlumb`
## But
Le Program Board est un tableau de bord, chaque ligne représente une équipe, chaque colonne représente une itération de projet Agile. Dans les différentes cases du tableau viennent se déposer des post-it représentants des fonctionnalités ou des évènements. Ces éléments sont reliés par un trait s’il existe une dépendance entre eux. 
Cet outil permet d’avoir une vue d’ensemble sur la planification des fonctionnalités.


Ce document sert de tutoriel afin de créer un prototype de cet outil.
## Pré-requis
Avant de commencer, il faut s'assurer d'avoir Node.js ainsi que NPM installé sur sa machine.
## Mise en place

### Installation d'Angular 
![Logo Angular](https://github.com/sebibigbob8/programBoard/blob/master/src/assets/angular.png "Logo Andular")
  1. Installez le client Angular : `npm install -g @angular/cli`
  2. Créez votre application : `ng new nomDeMonApp`
  3. Rendez-vous dans le dossier de l'application : `cd nomDeMonApp`
  4. Démarrez là : `ng serve --open`
Vous avez maintenant une application de base angular qui fonctionne.

### Installation de JSPlumb
JSPlumb est une librairie qui permet de créer de schéma de type 'flowchart' en javascript. Il existe une version payante et une gratuite. Cette dernière est largement suffisante en vu des objectifs qui nous interressent ici.

  1. Installez la librairie : `npm install jsplumb --save`
  2. Ajoutez cette ligne dans le fichier _angular.json_ : 
  `"scripts": ["../node_modules/jsplumb/dist/js/jsplumb.min.js"],`
  
## Utilisation de JSPlumb
### Déclarations
Les morceaux de code qui vont suivre sont a placer dans le component Angular de votre choix.

1. Declarez une variable jsPlumb
```javascript
declare var jsPlumb: any;                                                              
```                                                                     

2. Initialisez une instance de la librairie dans le hook angular AfterViewinit(ne pas oublier de l'implémenter à votre classe)
```javascript
jsPlumbInstance;

 ngAfterViewInit() {
     this.jsPlumbInstance = jsPlumb.getInstance();
 }
 ```
C'est par cet instance `this.jsPlumbInstance` que les fonctionnalités de la librairie sont accessibles. Pour plus de détails sur les possibilités qu'offre la librairie, rendez-vous sur la documentation officielle :[jsPlumb Doc](https://community.jsplumbtoolkit.com/apidocs/classes/jsPlumbInstance.html)

### Ajouter du Drag&Drop

Voici un exemple d'éléments html
```html
<div id="elem1">
  <span>Premier élément</span>
</div>
<div id="elem1">
  <span>Premier élément</span>
</div>

```
A l'aide de jsPlumb, il est possible d'attribuer le drag & drop à cette div.
```javascript
this.jsPlumbInstance.draggable('elem1');
```
! Cet fonction ne vérifie pas si elle est déjà passée sur un élément. Si vous appelez draggable() 2 fois sur le même élément, des erreurs sont à prévoir.

### Créer des connexions
1.Définitions des points d'entrée et sortie
```javascript
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
```
2.Assignation des points de connexion à l'élément html
```javascript
this.jsPlumbInstance.addEndpoint('elem1', sourcePoint, {uuid: `elem1-source`});
this.jsPlumbInstance.addEndpoint('elem1', endPoint, {uuid: `elem1-end`});
```
L'attribut ``uuid`` n'est pas obligatoire mais peut s'avérer très utile afin de cibler précisément un point de connexion.


Vous savez maintenant comment créer des éléments et leurs assigner du drag and drop ainsi que la possibilité de créer des connexions.
![Example](https://github.com/sebibigbob8/programBoard/blob/master/src/assets/Capture-jsPlumbBasic.PNG "example")

###Création d'un tableau adapté au nombres d'équipes et d'itérations
Il faut tout d'abord récupérer les données dans le fichier .ts de votre component. Pour cet exemple, les données seront stockées dans deux tableaux(`this.features` & `this.iterations`).

Le but est que l'html de votre component se base sur ces deux variables afin de se construire. De ce fait, dès que ces variables seront mises à jour, votre tableau aussi.

```angular2html
<table id="board">
  <caption>Program-Board</caption>
  <tr id="iterationsLine">
    <th></th>
    <th *ngFor="let iteration of this.iterations">{{iteration.number}}</th>
  </tr>
  <tr *ngFor="let team of this.teams">
    <td class="teamNameCell">{{team.name}}</td>
    <td class="boardCell"*ngFor="let iteration of this.iterations" id="{{iteration.number}}-{{team.name}}" [attr.data-iteration]="iteration.number" [attr.data-team]="team.name"></td>
  </tr>
</table>
```
`*ngFor` permet de faire une boucle sur une variable éxistant dans le javascript.
Ici le 1er ngFor permet de créer les colonnes d'itérations, le 2ème permet de créer toutes les cellules.
Les deux attributs `data-...` permettent de stocker la position de la cellule dans le html.

###Sauvegarder la position des post-its

Afin de réaliser cette fonctionnalité, jQuery doit être installé.

  1.Lancez dans votre invite de commande
```
npm install jquery — save
```
  2.Ajoutez dans angular.json à la racine de votre application
```
"scripts": [ "../node_modules/jquery/dist/jquery.min.js" ]
```

  3.Dans app.module.ts, ajoutez
```
import * as $ from 'jquery';
```
  4.Dans votre component, ajoutez
  ```
  declare var $: any;
  ```

Il faut maintennt détecter le moment du drop.
```javascript
$('.classOfElem')
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
            $('.classOfElem').mousemove(function (b) {
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
```
Au moment du drop, un évènement custom est créer sur les cellules du tableau. En paramètre sont passé les positions x et y de la souris au moment du drop.

Il faut maintenant réceptionner l'évènement.
```javascript
$('.boardCell').on('dropFeature', (e, featureId) => {
        const feature = e;
        const cell = e.currentTarget;
        cell.offsetBottom = cell.offsetTop + cell.offsetHeight;
        cell.offsetRight = cell.offsetLeft + cell.offsetWidth;
        if ((feature.pageY > cell.offsetTop) &&
          (feature.pageY < cell.offsetBottom) &&
          (feature.pageX > cell.offsetLeft) &&
          (feature.pageX < cell.offsetRight)) {
          const cellIteration = $(cell).attr('data-iteration');
          const cellTeam = $(cell).attr('data-team');
          this.updateFeature(featureId, cellTeam, cellIteration);
        }
      });
```
Le ``IF`` permet de détecter dans quelle cellule l'évènement custom est lancé.

Voic le contenu de ``updateFeature``:
```javascript
  updateFeature(featureId, team, iteration) {
    let mongodId = null;
    this.features.find(function (element) {
      if (element.htmlId === featureId) {
        element.team = team;
        element.iteration = iteration;
        mongodId = element._id;
      }
    });
    this.http.patch(`${this.global.urlApi}features/${mongodId}`, {
      'team': team,
      'iteration': iteration
    }).subscribe(featureUpdated => {
      console.log(featureUpdated);
    }, err => {
      console.error(err);
    });
  }
```
Cette fonction met à jour le tableau puis le backend.
