import { ErrorPageConfig, ErrorType } from '../models/error-page.model';

export const ERROR_PAGE_CONFIGS: ErrorPageConfig[] = [
  {
    type: 'invalid-id',
    title: 'Oups… identifiant invalide',
    message:
      "L'identifiant du pays est invalide ou mal formé. Revenez au tableau de bord et sélectionnez un pays dans la liste.",
  },
  {
    type: 'bad-url',
    title: 'Oups… page introuvable',
    message:
      "L'adresse saisie ne correspond à aucune page. Vérifiez l'URL ou revenez au tableau de bord.",
  },
  {
    type: 'missing-data',
    title: 'Oups… données indisponibles',
    message:
      "Les données nécessaires pour afficher cette page sont indisponibles ou n'ont pas pu être chargées.",
  },
  {
    type: 'unknown',
    title: 'Oups… une erreur est survenue',
    message:
      "Une erreur inattendue s'est produite. Vous pouvez revenir au tableau de bord et réessayer.",
  },
];

export const DEFAULT_ERROR_TYPE: ErrorType = 'unknown';

export const DEFAULT_ERROR_PAGE_CONFIG: ErrorPageConfig =
  ERROR_PAGE_CONFIGS.find((cfg) => cfg.type === DEFAULT_ERROR_TYPE)!;

export function getErrorPageConfigByType(type: ErrorType): ErrorPageConfig {
  for (const config of ERROR_PAGE_CONFIGS) {
    if (config.type === type) {
      return config;
    }
  }
  return DEFAULT_ERROR_PAGE_CONFIG;
}
