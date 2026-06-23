export type FieldType = 'text' | 'textarea' | 'checkbox' | 'email' | 'select';

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  maxLength?: number;
  optionEntityKey?: string;
  optionLabelKey?: string;
}

export interface EntityConfig {
  key: string;
  title: string;
  group: string;
  endpoint: string;
  displayColumns: string[];
  fields: FieldConfig[];
}

const referenceFields: FieldConfig[] = [
  { key: 'code', label: 'Code', type: 'text', required: true, maxLength: 60 },
  { key: 'libelle', label: 'Libelle', type: 'text', required: true, maxLength: 150 },
  { key: 'description', label: 'Description', type: 'textarea', maxLength: 500 },
  { key: 'actif', label: 'Actif', type: 'checkbox' }
];

const referenceColumns = ['code', 'libelle', 'description', 'actif'];

export const entityConfigs: EntityConfig[] = [
  {
    key: 'countries',
    title: 'Pays',
    group: 'Organisation',
    endpoint: '/organisation/pays',
    displayColumns: ['code', 'libelle', 'codeIso3', 'zoneCima', 'actif'],
    fields: [
      ...referenceFields,
      { key: 'codeIso3', label: 'Code ISO3', type: 'text', maxLength: 3 },
      { key: 'zoneCima', label: 'Zone CIMA', type: 'text' }
    ]
  },
  {
    key: 'currencies',
    title: 'Devises',
    group: 'Organisation',
    endpoint: '/organisation/devises',
    displayColumns: ['code', 'libelle', 'codeIso', 'symbole', 'actif'],
    fields: [
      ...referenceFields,
      { key: 'codeIso', label: 'Code ISO', type: 'text', required: true, maxLength: 3 },
      { key: 'symbole', label: 'Symbole', type: 'text' }
    ]
  },
  {
    key: 'addresses',
    title: 'Adresses',
    group: 'Organisation',
    endpoint: '/organisation/adresses',
    displayColumns: ['ligne1', 'ville', 'codePostal', 'paysId'],
    fields: [
      { key: 'ligne1', label: 'Ligne 1', type: 'text' },
      { key: 'ligne2', label: 'Ligne 2', type: 'text' },
      { key: 'ville', label: 'Ville', type: 'text' },
      { key: 'codePostal', label: 'Code postal', type: 'text' },
      { key: 'paysId', label: 'Pays', type: 'select', optionEntityKey: 'countries' }
    ]
  },
  {
    key: 'companies',
    title: 'Compagnies',
    group: 'Organisation',
    endpoint: '/organisation/compagnies',
    displayColumns: ['code', 'raisonSociale', 'numeroAgrement', 'paysId', 'actif'],
    fields: [
      { key: 'code', label: 'Code', type: 'text', required: true },
      { key: 'raisonSociale', label: 'Raison sociale', type: 'text', required: true },
      { key: 'numeroAgrement', label: 'Numero agrement', type: 'text' },
      { key: 'paysId', label: 'Pays', type: 'select', optionEntityKey: 'countries' },
      { key: 'deviseFonctionnelleId', label: 'Devise fonctionnelle', type: 'select', optionEntityKey: 'currencies' },
      { key: 'adresseSiegeId', label: 'Adresse siege', type: 'select', optionEntityKey: 'addresses', optionLabelKey: 'ville' },
      { key: 'actif', label: 'Actif', type: 'checkbox' }
    ]
  },
  {
    key: 'subsidiaries',
    title: 'Filiales',
    group: 'Organisation',
    endpoint: '/organisation/filiales',
    displayColumns: ['code', 'libelle', 'compagnieId', 'paysId', 'actif'],
    fields: [
      { key: 'code', label: 'Code', type: 'text', required: true },
      { key: 'libelle', label: 'Libelle', type: 'text', required: true },
      { key: 'compagnieId', label: 'Compagnie', type: 'select', required: true, optionEntityKey: 'companies', optionLabelKey: 'raisonSociale' },
      { key: 'paysId', label: 'Pays', type: 'select', optionEntityKey: 'countries' },
      { key: 'adresseId', label: 'Adresse', type: 'select', optionEntityKey: 'addresses', optionLabelKey: 'ville' },
      { key: 'actif', label: 'Actif', type: 'checkbox' }
    ]
  },
  { key: 'financialAssetTypes', title: 'Types actifs financiers', group: 'Referentiels ALM', endpoint: '/referentiels-alm/types-actifs-financiers', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'assetCategories', title: 'Categories actifs', group: 'Referentiels ALM', endpoint: '/referentiels-alm/categories-actifs', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'liabilityTypes', title: 'Types passifs', group: 'Referentiels ALM', endpoint: '/referentiels-alm/types-passifs', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'portfolioTypes', title: 'Types portefeuilles', group: 'Referentiels ALM', endpoint: '/referentiels-alm/types-portefeuilles', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'riskTypes', title: 'Types risques', group: 'Referentiels ALM', endpoint: '/referentiels-alm/types-risques', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'scenarioTypes', title: 'Types scenarios', group: 'Referentiels ALM', endpoint: '/referentiels-alm/types-scenarios', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'yieldCurves', title: 'Courbes de taux', group: 'Parametres financiers', endpoint: '/parametres-financiers/courbes-taux', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'exchangeRates', title: 'Taux de change', group: 'Parametres financiers', endpoint: '/parametres-financiers/taux-change', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'financialIndexes', title: 'Indices financiers', group: 'Parametres financiers', endpoint: '/parametres-financiers/indices-financiers', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'financialRatings', title: 'Notations financieres', group: 'Parametres financiers', endpoint: '/parametres-financiers/notations-financieres', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'projectionHorizons', title: 'Horizons de projection', group: 'Parametres financiers', endpoint: '/parametres-financiers/horizons-projection', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'insuranceBranches', title: 'Branches assurance', group: 'Parametres assurance', endpoint: '/parametres-assurance/branches-assurance', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'insuranceProducts', title: 'Produits assurance', group: 'Parametres assurance', endpoint: '/parametres-assurance/produits-assurance', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'contractTypes', title: 'Types contrats', group: 'Parametres assurance', endpoint: '/parametres-assurance/types-contrats', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'provisionTypes', title: 'Types provisions', group: 'Parametres assurance', endpoint: '/parametres-assurance/types-provisions', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'mortalityTables', title: 'Tables mortalite', group: 'Parametres assurance', endpoint: '/parametres-assurance/tables-mortalite', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'profiles', title: 'Profils', group: 'Securite', endpoint: '/securite/profils', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'roles', title: 'Roles', group: 'Securite', endpoint: '/securite/roles', displayColumns: referenceColumns, fields: referenceFields },
  { key: 'permissions', title: 'Permissions', group: 'Securite', endpoint: '/securite/permissions', displayColumns: referenceColumns, fields: referenceFields },
  {
    key: 'users',
    title: 'Utilisateurs',
    group: 'Securite',
    endpoint: '/securite/utilisateurs',
    displayColumns: ['username', 'email', 'nomComplet', 'profilId', 'actif'],
    fields: [
      { key: 'username', label: 'Identifiant', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'nomComplet', label: 'Nom complet', type: 'text', required: true },
      { key: 'passwordHash', label: 'Hash mot de passe', type: 'text' },
      { key: 'profilId', label: 'Profil', type: 'select', optionEntityKey: 'profiles' },
      { key: 'actif', label: 'Actif', type: 'checkbox' }
    ]
  }
];

export const entityConfigByKey = new Map(entityConfigs.map((config) => [config.key, config]));

export const groupedEntityConfigs = entityConfigs.reduce<Record<string, EntityConfig[]>>((groups, config) => {
  groups[config.group] = [...(groups[config.group] ?? []), config];
  return groups;
}, {});
