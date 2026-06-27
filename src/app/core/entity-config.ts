export type FieldType = 'text' | 'textarea' | 'checkbox' | 'email' | 'select' | 'number';

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  readonly?: boolean;
  maxLength?: number;
  optionEntityKey?: string;
  optionLabelKey?: string;
}

export interface FormTabConfig {
  key: string;
  label: string;
  fieldKeys?: string[];
  description?: string;
}

export interface EntityConfig {
  key: string;
  title: string;
  group: string;
  endpoint: string;
  displayColumns: string[];
  fields: FieldConfig[];
  formTabs?: FormTabConfig[];
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
  {
    key: 'financialAssetTypes',
    title: 'Types actifs financiers',
    group: 'Referentiels ALM',
    endpoint: '/referentiels-alm/types-actifs-financiers',
    displayColumns: ['code', 'libelle', 'categorieActifLibelle', 'description', 'actif'],
    fields: [
      ...referenceFields,
      { key: 'categorieActifId', label: 'Categorie actif', type: 'select', optionEntityKey: 'assetCategories' }
    ]
  },
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
    displayColumns: ['username', 'email', 'nomComplet', 'filialeLibelle', 'profilLibelle', 'actif'],
    fields: [
      { key: 'username', label: 'Identifiant', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'nomComplet', label: 'Nom complet', type: 'text', required: true },
      { key: 'passwordHash', label: 'Hash mot de passe', type: 'text' },
      { key: 'passwordChangeRequired', label: 'Changement requis', type: 'checkbox' },
      { key: 'failedLoginAttempts', label: 'Echecs connexion', type: 'text' },
      { key: 'lockedUntil', label: 'Verrouille jusqu au', type: 'text' },
      { key: 'lastLoginAt', label: 'Derniere connexion', type: 'text' },
      { key: 'filialeId', label: 'Filiale', type: 'select', optionEntityKey: 'subsidiaries' },
      { key: 'profilId', label: 'Profil', type: 'select', optionEntityKey: 'profiles' },
      { key: 'actif', label: 'Actif', type: 'checkbox' }
    ]
  },
  {
    key: 'sessions',
    title: 'Sessions',
    group: 'Securite',
    endpoint: '/securite/sessions',
    displayColumns: ['userId', 'ipAddress', 'expiresAt', 'revokedAt', 'active'],
    fields: [
      { key: 'userId', label: 'Utilisateur', type: 'select', optionEntityKey: 'users', optionLabelKey: 'username' },
      { key: 'sessionToken', label: 'Token session', type: 'textarea' },
      { key: 'ipAddress', label: 'Adresse IP', type: 'text' },
      { key: 'userAgent', label: 'User agent', type: 'textarea' },
      { key: 'expiresAt', label: 'Expire le', type: 'text' },
      { key: 'revokedAt', label: 'Revoque le', type: 'text' },
      { key: 'active', label: 'Active', type: 'checkbox' }
    ]
  },
  {
    key: 'refreshTokens',
    title: 'Refresh tokens',
    group: 'Securite',
    endpoint: '/securite/refresh-tokens',
    displayColumns: ['userId', 'expiresAt', 'revokedAt', 'active'],
    fields: [
      { key: 'userId', label: 'Utilisateur', type: 'select', optionEntityKey: 'users', optionLabelKey: 'username' },
      { key: 'tokenHash', label: 'Hash token', type: 'textarea' },
      { key: 'expiresAt', label: 'Expire le', type: 'text' },
      { key: 'revokedAt', label: 'Revoque le', type: 'text' },
      { key: 'active', label: 'Active', type: 'checkbox' }
    ]
  },
  {
    key: 'auditLogs',
    title: 'Journal audit',
    group: 'Securite',
    endpoint: '/securite/audit',
    displayColumns: ['username', 'action', 'resourceType', 'resourceId', 'ipAddress'],
    fields: [
      { key: 'userId', label: 'Utilisateur', type: 'select', optionEntityKey: 'users', optionLabelKey: 'username' },
      { key: 'username', label: 'Identifiant', type: 'text' },
      { key: 'action', label: 'Action', type: 'text', required: true },
      { key: 'resourceType', label: 'Type ressource', type: 'text' },
      { key: 'resourceId', label: 'ID ressource', type: 'text' },
      { key: 'ipAddress', label: 'Adresse IP', type: 'text' },
      { key: 'userAgent', label: 'User agent', type: 'textarea' },
      { key: 'details', label: 'Details', type: 'textarea' }
    ]
  },
  {
    key: 'securityParameters',
    title: 'Parametres securite',
    group: 'Securite',
    endpoint: '/securite/parametres',
    displayColumns: ['code', 'libelle', 'valeur', 'actif'],
    fields: [
      { key: 'code', label: 'Code', type: 'text', required: true },
      { key: 'libelle', label: 'Libelle', type: 'text', required: true },
      { key: 'valeur', label: 'Valeur', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'actif', label: 'Actif', type: 'checkbox' }
    ]
  },
  {
    key: 'passwordResetTokens',
    title: 'Tokens reset password',
    group: 'Securite',
    endpoint: '/securite/password-reset-tokens',
    displayColumns: ['userId', 'expiresAt', 'usedAt'],
    fields: [
      { key: 'userId', label: 'Utilisateur', type: 'select', optionEntityKey: 'users', optionLabelKey: 'username' },
      { key: 'tokenHash', label: 'Hash token', type: 'textarea' },
      { key: 'expiresAt', label: 'Expire le', type: 'text' },
      { key: 'usedAt', label: 'Utilise le', type: 'text' }
    ]
  }
];

const acquisitionFields: FieldConfig[] = [
  { key: 'code', label: 'Code dossier', type: 'text', required: true, readonly: true },
  { key: 'libelle', label: 'Libelle', type: 'text', required: true },
  { key: 'filialeId', label: 'Filiale', type: 'select', required: true, optionEntityKey: 'subsidiaries' },
  { key: 'typeActifId', label: 'Type actif', type: 'select', optionEntityKey: 'financialAssetTypes' },
  { key: 'categorieActifId', label: 'Categorie actif', type: 'select', optionEntityKey: 'assetCategories' },
  { key: 'deviseId', label: 'Devise', type: 'select', optionEntityKey: 'currencies' },
  { key: 'montantNominal', label: 'Montant nominal', type: 'number' },
  { key: 'dateSoumission', label: 'Date soumission', type: 'text' },
  { key: 'dateAutorisation', label: 'Date autorisation', type: 'text' },
  { key: 'dateValidation', label: 'Date validation', type: 'text' },
  { key: 'statut', label: 'Statut', type: 'text' },
  { key: 'gestionnaire', label: 'Gestionnaire', type: 'text' },
  { key: 'daf', label: 'DAF', type: 'text' },
  { key: 'dg', label: 'DG', type: 'text' },
  { key: 'motifRejet', label: 'Motif rejet', type: 'textarea' }
];

const acquisitionWorkflowFieldKeys = [
  'filialeId',
  'dateSoumission',
  'dateAutorisation',
  'dateValidation',
  'statut',
  'gestionnaire',
  'daf',
  'dg',
  'motifRejet'
];

const acquisitionGeneralFieldKeys = acquisitionFields
  .map((field) => field.key)
  .filter((key) => !acquisitionWorkflowFieldKeys.includes(key));

const financialAssetFields: FieldConfig[] = [
  { key: 'code', label: 'Code actif', type: 'text', required: true },
  { key: 'libelle', label: 'Libelle', type: 'text', required: true },
  { key: 'acquisitionId', label: 'Dossier acquisition', type: 'select', optionEntityKey: 'assetAcquisitions' },
  { key: 'filialeId', label: 'Filiale', type: 'select', required: true, optionEntityKey: 'subsidiaries' },
  { key: 'typeActifId', label: 'Type actif', type: 'select', optionEntityKey: 'financialAssetTypes' },
  { key: 'categorieActifId', label: 'Categorie actif', type: 'select', optionEntityKey: 'assetCategories' },
  { key: 'paysEmetteurId', label: 'Pays emetteur', type: 'select', optionEntityKey: 'countries' },
  { key: 'deviseId', label: 'Devise', type: 'select', optionEntityKey: 'currencies' },
  { key: 'emetteur', label: 'Emetteur', type: 'text' },
  { key: 'valeurNominale', label: 'Valeur nominale', type: 'text' },
  { key: 'valeurAcquisition', label: 'Valeur acquisition', type: 'text' },
  { key: 'tauxCoupon', label: 'Taux coupon', type: 'text' },
  { key: 'dateAcquisition', label: 'Date acquisition', type: 'text' },
  { key: 'dateEcheance', label: 'Date echeance', type: 'text' },
  { key: 'statut', label: 'Statut', type: 'text' },
  { key: 'actif', label: 'Actif', type: 'checkbox' }
];

const assetLinkField: FieldConfig = { key: 'actifId', label: 'Actif', type: 'select', optionEntityKey: 'financialAssets' };

entityConfigs.push(
  {
    key: 'assetAcquisitions',
    title: 'Acquisition d\'actif',
    group: 'Investissements',
    endpoint: '/investissements/acquisitions',
    displayColumns: ['code', 'libelle', 'filialeId', 'montantNominal', 'statut'],
    fields: acquisitionFields,
    formTabs: [
      {
        key: 'general',
        label: 'Information generale',
        fieldKeys: acquisitionGeneralFieldKeys
      },
      {
        key: 'documents',
        label: 'Document',
        description: 'Les documents rattaches a cette acquisition seront geres ici.'
      },
      {
        key: 'workflow',
        label: 'Workflow',
        description: 'Circuit de soumission, autorisation, validation et rejet.'
      },
      {
        key: 'history',
        label: 'Historique',
        description: 'Historique des actions realisees sur cette acquisition.'
      }
    ]
  },
  {
    key: 'financialAssets',
    title: 'Actifs financiers',
    group: 'Investissements',
    endpoint: '/investissements/actifs',
    displayColumns: ['code', 'libelle', 'emetteur', 'valeurNominale', 'dateEcheance', 'statut'],
    fields: financialAssetFields,
    formTabs: [
      {
        key: 'general',
        label: 'Information generale',
        fieldKeys: financialAssetFields.map((field) => field.key)
      },
      {
        key: 'documents',
        label: 'Document',
        description: 'Les documents rattaches a cet actif seront geres ici.'
      },
      {
        key: 'workflow',
        label: 'Workflow',
        description: 'Circuit de controle, validation, activation et rejet.'
      },
      {
        key: 'amortissement',
        label: 'Amortissement',
        description: 'Le tableau d amortissement de cet actif sera gere ici.'
      },
      {
        key: 'tombee',
        label: 'Tombee',
        description: 'Les tombees prevues et encaissees de cet actif seront gerees ici.'
      },
      {
        key: 'history',
        label: 'Historique',
        description: 'Historique des actions realisees sur cet actif.'
      }
    ]
  },
  {
    key: 'assetMaturities',
    title: 'Tombees',
    group: 'Investissements',
    endpoint: '/investissements/tombees',
    displayColumns: ['actifId', 'typeTombee', 'datePrevue', 'montantAttendu', 'montantRecu', 'statut'],
    fields: [
      assetLinkField,
      { key: 'typeTombee', label: 'Type tombee', type: 'text', required: true },
      { key: 'datePrevue', label: 'Date prevue', type: 'text' },
      { key: 'dateReception', label: 'Date reception', type: 'text' },
      { key: 'montantAttendu', label: 'Montant attendu', type: 'text' },
      { key: 'montantRecu', label: 'Montant recu', type: 'text' },
      { key: 'statut', label: 'Statut', type: 'text' },
      { key: 'referencePiece', label: 'Reference piece', type: 'text' },
      { key: 'commentaire', label: 'Commentaire', type: 'textarea' }
    ]
  },
  {
    key: 'amortizationSchedules',
    title: 'Tableaux amortissement',
    group: 'Investissements',
    endpoint: '/investissements/amortissements',
    displayColumns: ['actifId', 'numeroEcheance', 'dateEcheance', 'capitalDebut', 'interet', 'capitalFin'],
    fields: [
      assetLinkField,
      { key: 'numeroEcheance', label: 'Numero echeance', type: 'text' },
      { key: 'dateEcheance', label: 'Date echeance', type: 'text' },
      { key: 'capitalDebut', label: 'Capital debut', type: 'text' },
      { key: 'interet', label: 'Interet', type: 'text' },
      { key: 'amortissement', label: 'Amortissement', type: 'text' },
      { key: 'capitalFin', label: 'Capital fin', type: 'text' },
      { key: 'statut', label: 'Statut', type: 'text' }
    ]
  },
  {
    key: 'assetDocuments',
    title: 'Documents actifs',
    group: 'Investissements',
    endpoint: '/investissements/documents',
    displayColumns: ['acquisitionId', 'actifId', 'typeDocument', 'nomFichier', 'obligatoire', 'valide'],
    fields: [
      { key: 'acquisitionId', label: 'Dossier acquisition', type: 'select', optionEntityKey: 'assetAcquisitions' },
      assetLinkField,
      { key: 'typeDocument', label: 'Type document', type: 'text', required: true },
      { key: 'nomFichier', label: 'Nom fichier', type: 'text', required: true },
      { key: 'referenceStockage', label: 'Reference stockage', type: 'text' },
      { key: 'obligatoire', label: 'Obligatoire', type: 'checkbox' },
      { key: 'valide', label: 'Valide', type: 'checkbox' }
    ]
  },
  {
    key: 'assetRatings',
    title: 'Ratings actifs',
    group: 'Investissements',
    endpoint: '/investissements/ratings',
    displayColumns: ['actifId', 'agence', 'noteEmetteur', 'notePays', 'dateNotation', 'perspective'],
    fields: [
      assetLinkField,
      { key: 'agence', label: 'Agence', type: 'text', required: true },
      { key: 'noteEmetteur', label: 'Note emetteur', type: 'text' },
      { key: 'notePays', label: 'Note pays', type: 'text' },
      { key: 'dateNotation', label: 'Date notation', type: 'text' },
      { key: 'perspective', label: 'Perspective', type: 'text' },
      { key: 'commentaire', label: 'Commentaire', type: 'textarea' }
    ]
  },
  {
    key: 'accountingMappings',
    title: 'Mappings SYSCOHADA',
    group: 'Comptabilisation',
    endpoint: '/investissements/mappings-comptables',
    displayColumns: ['typeOperation', 'categorieActifId', 'compteDebit', 'compteCredit', 'journalCode', 'actif'],
    fields: [
      { key: 'typeOperation', label: 'Type operation', type: 'text', required: true },
      { key: 'categorieActifId', label: 'Categorie actif', type: 'select', optionEntityKey: 'assetCategories' },
      { key: 'compteDebit', label: 'Compte debit', type: 'text', required: true },
      { key: 'compteCredit', label: 'Compte credit', type: 'text', required: true },
      { key: 'journalCode', label: 'Journal', type: 'text' },
      { key: 'libelle', label: 'Libelle', type: 'text' },
      { key: 'actif', label: 'Actif', type: 'checkbox' }
    ]
  },
  {
    key: 'sageExports',
    title: 'Exports SAGE',
    group: 'Comptabilisation',    endpoint: '/investissements/exports-sage',
    displayColumns: ['referenceExport', 'compagnieId', 'periodeDebut', 'periodeFin', 'formatCible', 'statut'],
    fields: [
      { key: 'referenceExport', label: 'Reference export', type: 'text', required: true },
      { key: 'compagnieId', label: 'Compagnie', type: 'select', optionEntityKey: 'companies', optionLabelKey: 'raisonSociale' },
      { key: 'periodeDebut', label: 'Periode debut', type: 'text' },
      { key: 'periodeFin', label: 'Periode fin', type: 'text' },
      { key: 'formatCible', label: 'Format cible', type: 'text' },
      { key: 'modeExport', label: 'Mode export', type: 'text' },
      { key: 'statut', label: 'Statut', type: 'text' },
      { key: 'nombreEcritures', label: 'Nombre ecritures', type: 'text' },
      { key: 'montantTotal', label: 'Montant total', type: 'text' },
      { key: 'fichierGenere', label: 'Fichier genere', type: 'text' },
      { key: 'messageErreur', label: 'Message erreur', type: 'textarea' }
    ]
  },
  {
    key: 'regulatoryReports',
    title: 'Etats CIMA',
    group: 'Reporting',
    endpoint: '/investissements/etats-cima',
    displayColumns: ['codeEtat', 'libelle', 'compagnieId', 'periodeDebut', 'periodeFin', 'statut'],
    fields: [
      { key: 'codeEtat', label: 'Code etat', type: 'text', required: true },
      { key: 'libelle', label: 'Libelle', type: 'text', required: true },
      { key: 'compagnieId', label: 'Compagnie', type: 'select', optionEntityKey: 'companies', optionLabelKey: 'raisonSociale' },
      { key: 'periodeDebut', label: 'Periode debut', type: 'text' },
      { key: 'periodeFin', label: 'Periode fin', type: 'text' },
      { key: 'statut', label: 'Statut', type: 'text' },
      { key: 'fichierGenere', label: 'Fichier genere', type: 'text' },
      { key: 'commentaire', label: 'Commentaire', type: 'textarea' }
    ]
  }
);

export const entityConfigByKey = new Map(entityConfigs.map((config) => [config.key, config]));

export const groupedEntityConfigs = entityConfigs.reduce<Record<string, EntityConfig[]>>((groups, config) => {
  groups[config.group] = [...(groups[config.group] ?? []), config];
  return groups;
}, {});
