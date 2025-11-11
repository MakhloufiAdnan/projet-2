# ARCHITECTURE – Front-end TéléSport / Jeux Olympiques

## 1. Vue d’ensemble
L’application est une SPA Angular (version 18+) construite **en standalone** :

- Démarrage via `bootstrapApplication` dans `main.ts`.
- Le **routing** et **HttpClient** sont fournis au niveau global.
- Les **données** des Jeux Olympiques sont centralisées dans un `DataService`.
- La **logique de calcul** (totaux, agrégations) est isolée dans un `StatisticsService`.
- Les pages (`Home`, `Country`, `NotFound`) orchestrent des **composants de présentation** (charts, stat-card).

Objectif : avoir une base claire, testable et prête à consommer une future API back-end.

## 2. Arborescence principale après refactorisation

```txt
src/
  main.ts

  app/
    app.component.*
    app.routes.ts

    models/
      olympic.model.ts
      participation.model.ts

    services/
      data.service.ts
      statistics.service.ts

    pages/
      home/
        home.component.*
      country/
        country.component.*
      not-found/
        not-found.component.*

    components/
      medals-pie-chart/
        medals-pie-chart.component.*
      country-medals-line-chart/
        country-medals-line-chart.component.*
      stat-card/
        stat-card.component.*
    ...
```

**main.ts**
Bootstrape l’application avec AppComponent.
Fournit :
  provideRouter(routes) pour le routing.
  provideHttpClient() pour les accès HTTP.

**AppComponent**
Composant racine standalone.
Contient le <router-outlet>.
Ne porte pas de logique métier : sert uniquement de shell.

**app.route.ts**
Déclare les routes de l’application :
  HomeComponent
  CountryComponent
  NotFoundComponent

**participation.model.ts et olympic.model.ts**
Interface représentant une participation d’un pays à une édition et un pays et ses participations.
Ces modèles sont utilisés dans les services et les composants pour éviter any et sécuriser les accès aux propriétés.

**DataService**
Rôle : centraliser l’accès aux données des JO.
  Charge les données depuis assets/mock/olympic.json via HttpClient.
  Expose une méthode principale :
    getOlympics(): Observable<Olympic[]>
Déclaré avec providedIn: 'root' → <pattern Singleton> : une seule instance partagée dans toute l’app.
Aujourd’hui, les données proviennent d’un JSON local ; demain, cette méthode pourra appeler une API REST sans toucher aux composants.

**StatisticsService**
Rôle : regrouper la logique de calcul métier (statistiques), par exemple :
  getTotalCountries(olympics: Olympic[]): number
  getTotalJOs(olympics: Olympic[]): number
  getTotalMedals(participations: Participation[]): number
  getTotalAthletes(participations: Participation[]): number
Les composants de page ne font plus les calculs à la main : ils délèguent au service, ce qui :
  limite la duplication de code ;
  simplifie les tests unitaires (fonctions pures).

**Pages (pages/)**
Les pages sont des composants standalone gérés par le router. Elles orchestrent :
  la récupération des données via les services ;
  la préparation des données d’affichage ;
  l’assemblage des composants de présentation.

**HomeComponent** (pages/home)
Rôle : page d’accueil / vue globale.
Responsabilités :
  Récupérer la liste des Olympic via DataService.
  Utiliser StatisticsService pour calculer :
    le nombre total de pays ;
    le nombre total d’éditions (JO) ;
    le total de médailles par pays.
  Exposer au template :
    les valeurs pour les cartes de stats ;
    les tableaux countries / sumOfAllMedalsYears pour le graphique.
Template :
  Affiche un titre de page.
  Utilise plusieurs <app-stat-card> pour les KPI.
  Affiche le graphique <app-medals-pie-chart>.

**CountryComponent** (pages/country)
Rôle : page de détail d’un pays.
Responsabilités :
  Lire le paramètre de route (countryName ou id).
  Charger les données via DataService.
  Sélectionner le pays correspondant.
  Préparer les données pour :
    les cartes de stats (entrées, médailles, athlètes) ;
    le graphique d’évolution (années / médailles).
    Gérer les cases d’erreur (pays non trouvé, aucun paramètre, erreur HTTP).
Template :
  Affiche le nom du pays.
  Affiche les KPI via <app-stat-card>.
  Affiche le graphique <app-country-medals-line-chart>.
  Propose un lien pour revenir à la page d’accueil.

**NotFoundComponent** (pages/not-found)
Rôle : afficher un message 404 en cas de route inconnue.

**StatCardComponent**
Rôle : afficher un indicateur (label + valeur).
Inputs :
  label: string
  value: number | string | null
Utilisé autant sur la page d’accueil que sur la page pays.

**MedalsPieChartComponent**
Rôle : encapsuler le graphique en secteurs (Chart.js) pour les médailles par pays.
Inputs :
  countries: string[]
  medals: number[]
Crée un graphique Chart<'pie'> sur un <canvas>.
Le composant gère uniquement le rendu du graphique et les interactions bas niveau, ce qui permet de le rendre réutilisable.

**CountryMedalsLineChartComponent**
Rôle : encapsuler le graphique en ligne (Chart.js) montrant l’évolution des médailles d’un pays.
Inputs :
  years: number[]
  medals: number[]
Crée un graphique Chart<'line'> sur un <canvas>.

**Préparation à une future API back-end**
Cette architecture anticipe l’arrivée d’un back-end/API :
  Tous les composants passent par DataService pour récupérer les données.
  Le remplacement de olympic.json par une API REST consistera à :
    modifier la méthode getOlympics() (URL, HttpClient, éventuellement gestion d’auth).
    sans changer la structure des pages ni des composants de présentation.
  StatisticsService reste inchangé : il reçoit toujours un tableau typé et calcule les résultats.