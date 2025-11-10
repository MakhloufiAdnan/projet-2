# Notes d'architecture – TéléSport / Jeux Olympiques

## 1. Contexte & environnement

- `npm install` : OK, ajout de 941 packages.

Observations :

- Plusieurs warnings de dépendances dépréciées (`rimraf@3`, `glob@7`, `inflight`, `critters`), liées à des sous-dépendances Angular/CLI.
- `npm audit` signale 11 vulnérabilités (6 low, 4 moderate, 1 high).

Conclusion :

- Les vulnérabilités et dépréciations sont à surveiller dans un contexte réel, mais ne bloquent pas la mise en place ni l'analyse de l'architecture pour ce projet.

## 2. Comparatif du rendu du site par rapport au cahier des charges

- 1. **Page d'acceuil**

  - Les boxs number of countries et number of JOs sont inversées
  - Le visuel de la légende n'est pas conforme
  - les couleurs attribuées au pays ne sont pas conforme.
  - il manque United Kigdom
  - la bulle au survole n'est pas conforme.
  - Font-family non conforme -> sans-serif
  - Page non responsive

- 2. **Page détail**
  - Font-family non conforme -> sans-serif
  - Number en Majuscule dans Total Number of medals et total Number of athletes
  - Nombre de tate de participation insuffisant
  - Page non responsive

## 3. Architechture du projet

**Structure des services** : - Observation : aucun \*.service.ts dans le projet actuel. - Impact : Les composants gèrent eux-mêmes les données (chargement, filtrage, transformation), ce qui rend le code moins réutilisable et plus difficile à tester. - Bonne pratique : déplacer la logique métier et d’accès aux données dans des services injectables.

**Typage et modèles** : - Observation : aucun dossier models/types/interfaces n’est présent dans le projet actuel. - Impact : le projet utilise des types faibles (any) et du typage implicite. - Bonne pratique : créer des interfaces TypeScript dédiées (Country, MedalStats, etc.) et les réutiliser dans les composants et services.

**Modularisation de l’application** - Observation : l’application n’a qu’un AppModule avec un dossier pages ; aucun module fonctionnel (CountryModule, HomeModule, etc.). - Impact : structure n'est pas adaptée à une application qui est amenées à grandir. - Bonne pratique : introduire des feature modules par domaine métier et, éventuellement, des modules Core et Shared.

**Source des données** - Observation : les données des JO sont chargées depuis assets/mock/olympic.json. - Impact : acceptable pour un exercice, mais il faut préparer l’architecture pour une API. - Axe d'amélioration : encapsuler l’accès aux données dans un service Angular, de façon à pouvoir le remplacer facilement par des appels HTTP plus tard.

## 4. Analyse du code :

**NgModule** - Observation : Le projet est en ngModule or - angular 18 - pousse à une architechture standalone. - Localisation de l'observation : `app.module.ts` et `app-routing.module.ts`. - Impact : Pas aligné avec les pratiques récentes. - Axe d'amélioration : envisager une migration vers des composants standalone

**Gestion des données et des appels HTTP** - Observation : Les composants appellent directement `HttpClient.get` sur `assets/mock/olympic.json` et contiennent la logique de filtrage/agrégation des données. - Localisation de l'observation : `home.component.ts` et `country.component.ts` - Impact :
=> Un couplage fort entre la vue et la source de données.
=> Une duplication de l’URL et de certaines logiques.
=> Le code est moins testable.
=> Plus difficile à faire évoluer vers une vraie API back-end. - Axe d'amélioration : Implémenter `OlympicService` et `StatisticsService` pour centraliser l’accès aux données et les calculs, les composants ne faisant plus qu’appeler des méthodes de haut niveau.

**Typage et modèles** - Observation : Utilisation répétée de `any`. Aucun modèle TypeScript n’est défini pour représenter les entités métier (pays, participations, médailles). - Localisation de l'observation : `home.component.ts` et `country.component.ts` - Impact : Perte des bénéfices du mode strict (`tsconfig`), risques de bugs à l’exécution (Par exemple : accès à `selectedCountry.country` si `find` ne renvoie rien), auto-complétion et refactorings plus difficiles. - Axe d'amélioration: Créer des interfaces dans un dossier `models` et les utiliser dans les services et composants.

**Observables** - Observation : Les composants s’abonnent directement aux observables (par exemple : `paramMap.subscribe`, `http.get(...).subscribe`) et n’utilisent pas d’opérateurs de composition (expl. `switchMap`) ni l’`async` pipe. - Localisation de l'observation : `country.component.ts` et `home.component.ts` - Impact : Le code mélange de la logique de transformation et de l’affichage dans les composants. Difficulté à factoriser la logique de flux de données. - Axe d'amélioration : Déporter la gestion des flux dans les services, utiliser des opérateurs (`map`, `switchMap`, etc.) et, côté template, privilégier l’`async` pipe lorsque c’est pertinent.

**Résponsabilité des composant et l'intégration de chart.js** - Observation : Les composants gèrent la préparation des données, la configuration détaillée de Chart.js et, pour `HomeComponent`, la navigation sur clic dans le graphique. - Localisation de l'observation :`HomeComponent` et `CountryComponent` - Impact : Les composants sont très “chargés” qui mélangent logique métier, intégration d’une librairie externe et routing. Il est difficile de réutiliser les graphiques ailleurs sans faire des copier-coller et créer de la dupplication de code. - Axe d'amélioration : Créer des composants dédiés aux graphiques (expl. `PieMedalsChartComponent`, `CountryMedalsLineChartComponent`) qui reçoivent les données en entrée (`@Input`) et encapsulent Chart.js.

**Tests non aligné avec le code et débuggage** - Observation : Présence de `console.log` de debug et de test non aligné. Le test de `CountryComponent` est nommé `DetailComponent`. - Localisation de l'observation : `HomeComponent`, `AppComponent`, `app.component.spec.ts`et `country.component.spec.ts`. - Impact : Bruit dans la console en exécution, tests trompeurs ou cassés qui ne reflètent pas le comportement réel. - Axe d'amélioration : aligner les tests après une correction du code et supprimer les console.log() après validation.

**Styles & responsive design** - Observation:
=> Styles globaux définis dans `styles.scss` (`.center`, `.split`, etc.), réutilisés sur plusieurs pages.
=> Certains éléments sont partiellement responsives (expl : `country.component.scss` réduit la largeur du container sous 1000px), mais le reste de la page ne suit pas.
=> Manque de grille ou de système de layout cohérent (pas de design system identifié). - Impact :
=> Pages peu ou pas responsives, surtout sur mobile.
=> Classes très génériques, ce qui peut rendre la maintenance plus difficile à mesure que le projet grandit. - Axe d'amélioration :
=> Travailler un layout responsive global (flexbox/grille cohérente).
=> Introduire des composants de présentation réutilisables.
=> Nommer les classes de manière plus sémantique (expl. `.stats-container`, `.stats-card`) et limiter le style global aux vrais éléments transverses.

**_ Arborescence _**
src/
  index.html
  styles.scss
  main.ts                                         // bootstrapApplication + provideRouter + provideHttpClient
  test.ts

  app/
    app.component.ts                              // composant racine standalone
    app.component.html
    app.component.scss
    app.routes.ts                                  // Je supprime l'allusion à ngModule dans le nom du fichier

      models/                                     // Les objets typés en any (pays, participations, médailles) 
                                                  //seront décrits par des interfaces (Country, Participation) et utilisés dans les services et composants.
        Olympic.model.ts
        participation.model.ts

      services/                                   // La logique actuellement dans HomeComponent et CountryComponent 
                                                  // (appel à HttpClient, filtrage des pays, calculs de stats) sera déplacée dans ces services.
        data.service.ts                           // Contiendra tout l’accès aux données des JO (lecture du JSON mock aujourd’hui, API REST demain).
        statistics.service.ts                     // Contiendra les calculs métiers (totaux de médailles, nombre de JO, nombre d’athlètes, etc.).

      pages/
        home/
          home.component.ts                       // standalone
          home.component.html
          home.component.scss
          home.component.spec.ts

        country/
          country.component.ts                    // standalone
          country.component.html
          country.component.scss
          country.component.spec.ts

        not-found/
          not-found.component.ts                  // standalone
          not-found.component.html
          not-found.component.scss
          not-found.component.spec.ts

      components/
        medals-pie-chart/                         // Encapsulera la logique Chart.js du graphique en secteurs (actuellement dans HomeComponent).
          medals-pie-chart.component.ts
          medals-pie-chart.component.html
          medals-pie-chart.component.scss

        country-medals-line-chart/                // Encapsulera la logique Chart.js du graphique en ligne (actuellement dans CountryComponent).
          country-medals-line-chart.component.ts
          country-medals-line-chart.component.html
          country-medals-line-chart.component.scss

        stat-card/                                // Composant générique pour afficher un bloc de chiffres (titre + valeur), 
                                                  réutilisable sur la home et sur la page détail.
          stat-card.component.ts
          stat-card.component.html
          stat-card.component.scss

  assets/
    images/
      teleSport.png
    mock/
      olympic.json

  environments/
    environment.ts
    environment.prod.ts