# `Program Board avec Angular et JSPlumb`
## But
Prototype permettant de réaliser graphiquement un tableau type kanban avec le drag and drop d’éléments ainsi que de créer des liens entre ces éléments

Ce document sert de tutoriel afin de créer le prototype.
## Pré-requis
Avant de commencer, il faut s'assurer d'avoir Node.js ainsi que NPM installé sur sa machine.
## Mise en place

### Installation d'Angular (https://github.com/sebibigbob8/programBoard/blob/master/src/assets/angular.png)
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
