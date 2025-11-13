# TéléSport – Dashboard Jeux Olympiques 🏅

Application front-end Angular permettant de visualiser les performances des pays aux Jeux Olympiques pour TéléSport.

- Un **dashboard** affichant les pays et leurs médailles.
- Une **page de détail** par pays avec l’évolution de ses résultats.
- Une **gestion d’erreurs utilisateur** (URL incorrecte, identifiant invalide, données manquantes).
- Une **architecture modulaire** prête à être branchée sur une API back-end.

---

## 🧰 Stack technique
- **Framework** : Angular (standalone components, Angular 18+)
- **Langage** : TypeScript
- **Graphiques** : [Chart.js](https://www.chartjs.org/)
- **Gestion des styles** : SCSS / CSS Grid / Flexbox
- **HTTP & routing** : `HttpClient`, `provideRouter`, `bootstrapApplication`

---

## ⚙️ Installation

 **Cloner le dépôt**
- git clone https://github.com/MakhloufiAdnan/projet-2.git
- cd <NOM_DU_DOSSIER>
- Installer les dépendances
- Copier le code
- npm install

## 🚀 Lancer l’application
- ng serve
- Puis ouvrir un navigateur à l’adresse :
  - http://localhost:4200/

📁 Structure du projet
Structure logique du dossier src/ après refactorisation :

```txt
Copier le code
src/
  main.ts                      # Bootstrap de l'app (bootstrapApplication + provideRouter + provideHttpClient)

  app/
    app.component.*            # Composant racine standalone (shell + <router-outlet>)
    app.routes.ts              # Configuration du routing

    models/
      olympic.model.ts         # Interface Olympic (pays + participations)
      participation.model.ts   # Interface Participation (année, ville, médailles, athlètes)
      error-page.model.ts      # Types des pages d'erreur (ErrorType, ErrorPageConfig)

    services/
      data.service.ts          # Accès aux données JO (lecture du JSON mock)
      statistics.service.ts    # Calculs métiers (totaux, agrégations)
      error-navigation.service.ts  # Gestion de la navigation vers /not-found avec un type d'erreur

    config/
      error-page.config.ts     # Configuration centralisée des messages d'erreur

    pages/
      home/
        home.component.ts
        home.component.html
        home.component.scss    # Dashboard (vue globale)
      country/
        country.component.ts
        country.component.html
        country.component.scss # Page détail d'un pays
      not-found/
        not-found.component.ts
        not-found.component.html
        not-found.component.scss # Page d'erreur utilisateur

    components/
      header/
        header.component.ts
        header.component.html
        header.component.scss  # En-tête réutilisable (titre + indicateurs)
      stat-card/
        stat-card.component.ts
        stat-card.component.html
        stat-card.component.scss # Carte d'indicateur (label + valeur)
      medals-pie-chart/
        medals-pie-chart.component.ts
        medals-pie-chart.component.html
        medals-pie-chart.component.scss # Graphique en secteurs (médailles par pays)
      country-medals-line-chart/
        country-medals-line-chart.component.ts
        country-medals-line-chart.component.html
        country-medals-line-chart.component.scss # Graphique en ligne (évolution des médailles)

  assets/
    mock/
      olympic.json             # Données simulées des Jeux Olympiques
    images/
      teleSport.png            # Logo TéléSport (si utilisé)

  environments/
    environment.ts
    environment.prod.ts

  ARCHITECTURE.md              # Documentation de l'architecture front
  notes-architecture.md        # Notes d'analyse du starter et décisions de refactor
  ...
```

## 🧱 Architecture fonctionnelle
**Routes principales**
- / → HomeComponent (Dashboard)
- /country/:id → CountryComponent (Détail pays)
- /not-found → NotFoundComponent
- ** → route générique, redirigée vers NotFoundComponent avec un type d’erreur bad-url

**Dashboard (HomeComponent)**
- Charge la liste des pays via DataService.getOlympics().
- Utilise StatisticsService pour calculer :
  - le nombre de pays,
  - le nombre d’éditions des JO,
  - le total de médailles par pays.

  **Affiche**
- un texte d’introduction,
- un header <app-header> avec les indicateurs clés,
- un pie chart <app-medals-pie-chart> affichant les pays et leurs médailles.

  **Comportement**
- au clic sur un segment du pie chart, redirection vers /country/:id pour le pays correspondant.

**Page détail pays (CountryComponent)**
- Récupère l’id du pays via ActivatedRoute (/country/:id).
- Charge les données via DataService.getOlympics() et sélectionne le pays par id.
- Utilise StatisticsService pour calculer :
  - nombre de participations,
  - total de médailles,
  - total d’athlètes.
- Expose deux tableaux years et medals pour le line chart.

  **Affiche**
- un header <app-header> avec le nom du pays et ses indicateurs,
- un line chart <app-country-medals-line-chart> montrant l’évolution des médailles,
- un bouton “← Back to dashboard”.

**Page d’erreur (NotFoundComponent)**
- Utilise ErrorNavigationService et les data de la route pour déterminer un ErrorType :
  - bad-url → URL mal formée ou inconnue,
  - invalid-id → ID numérique valide, mais ne correspondant à aucun pays,
  - missing-data → données indisponibles ou non chargées,
  - unknown → erreur générique.
- Récupère la configuration correspondante dans error-page.config.ts et affiche un titre + message adapté.
- Présence d'un bouton pour retourner au dashboard.

## 🧮 Services et modèles
**DataService**
- Rôle : centraliser l’accès aux données.
- Implémentation :
  - lit un fichier JSON assets/mock/olympic.json via HttpClient,
  - expose getOlympics(): Observable<Olympic[]>.
- Intérêt :
  - prépare l’architecture à un futur remplacement du JSON par une API REST sans impacter les composants.

**StatisticsService**
- Rôle : regrouper les calculs métiers.
- Intérêt :
  - éviter la duplication de logique dans les composants,
  - faciliter les tests unitaires (fonctions pures).

**ErrorNavigationService + error-page.config.ts**
- ErrorNavigationService :
  - stocke le type d’erreur courant (ErrorType),
  - expose triggerError(type: ErrorType) qui mémorise le type et navigue vers /not-found.
  - error-page.config.ts :
  - définit un tableau ERROR_PAGE_CONFIGS de ErrorPageConfig (type, titre, message),
  - expose une fonction getErrorPageConfigByType(type: ErrorType) pour retrouver la configuration à afficher.

## 🎨 UI & responsive
**Mise en page en CSS Grid :**
- Dashboard et page pays :
  - mobile : 4 colonnes, contenu empilé,
  - tablette : 8 colonnes,
  - desktop : 12 colonnes, header et graphique côte à côte.
- Composants graphiques (medals-pie-chart, country-medals-line-chart) :
  - gestion de l’aspect ratio pour conserver une lisibilité correcte sur mobile.

## ⚠️ Limites actuelles & pistes d’amélioration
**Données statiques**
- Les données proviennent d’un fichier JSON local (assets/mock/olympic.json).
- Piste : remplacer progressivement ce mock par des appels HTTP réels vers une API REST.

**Gestion des états (loading / empty / error)**
- La navigation vers /not-found permet de gérer les erreurs majeures, mais les pages n’exposent pas encore d’états visuels distincts (loading, empty) dans le template.
- Piste : introduire des propriétés isLoading, isEmpty, hasError dans les pages et des blocs *ngIf dédiés.

**Accessibilité (a11y)**
- Les graphiques Chart.js sont intégrés, mais ne disposent pas encore d’alternatives textuelles détaillées ni d’attributs ARIA spécifiques.
- Piste : ajouter des descriptions pour les charts et améliorer la navigation clavier.
