import { Routes } from '@angular/router';
import { authGuard } from '../core/auth.guard';

export const entityPageRoutes: Routes = [
  {
    path: 'parametrage/countries',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/organisation/countries/countries.component').then((m) => m.CountriesComponent)
  },
  {
    path: 'parametrage/currencies',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/organisation/currencies/currencies.component').then((m) => m.CurrenciesComponent)
  },
  {
    path: 'parametrage/addresses',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/organisation/addresses/addresses.component').then((m) => m.AddressesComponent)
  },
  {
    path: 'parametrage/companies',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/organisation/companies/companies.component').then((m) => m.CompaniesComponent)
  },
  {
    path: 'parametrage/subsidiaries',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/organisation/subsidiaries/subsidiaries.component').then((m) => m.SubsidiariesComponent)
  },
  {
    path: 'parametrage/financialAssetTypes',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/referentiels-alm/financial-asset-types/financial-asset-types.component').then((m) => m.FinancialAssetTypesComponent)
  },
  {
    path: 'parametrage/assetCategories',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/referentiels-alm/asset-categories/asset-categories.component').then((m) => m.AssetCategoriesComponent)
  },
  {
    path: 'parametrage/liabilityTypes',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/referentiels-alm/liability-types/liability-types.component').then((m) => m.LiabilityTypesComponent)
  },
  {
    path: 'parametrage/portfolioTypes',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/referentiels-alm/portfolio-types/portfolio-types.component').then((m) => m.PortfolioTypesComponent)
  },
  {
    path: 'parametrage/riskTypes',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/referentiels-alm/risk-types/risk-types.component').then((m) => m.RiskTypesComponent)
  },
  {
    path: 'parametrage/scenarioTypes',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/referentiels-alm/scenario-types/scenario-types.component').then((m) => m.ScenarioTypesComponent)
  },
  {
    path: 'parametrage/yieldCurves',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/parametres-financiers/yield-curves/yield-curves.component').then((m) => m.YieldCurvesComponent)
  },
  {
    path: 'parametrage/exchangeRates',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/parametres-financiers/exchange-rates/exchange-rates.component').then((m) => m.ExchangeRatesComponent)
  },
  {
    path: 'parametrage/financialIndexes',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/parametres-financiers/financial-indexes/financial-indexes.component').then((m) => m.FinancialIndexesComponent)
  },
  {
    path: 'parametrage/financialRatings',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/parametres-financiers/financial-ratings/financial-ratings.component').then((m) => m.FinancialRatingsComponent)
  },
  {
    path: 'parametrage/projectionHorizons',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/parametres-financiers/projection-horizons/projection-horizons.component').then((m) => m.ProjectionHorizonsComponent)
  },
  {
    path: 'parametrage/insuranceBranches',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/parametres-assurance/insurance-branches/insurance-branches.component').then((m) => m.InsuranceBranchesComponent)
  },
  {
    path: 'parametrage/insuranceProducts',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/parametres-assurance/insurance-products/insurance-products.component').then((m) => m.InsuranceProductsComponent)
  },
  {
    path: 'parametrage/contractTypes',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/parametres-assurance/contract-types/contract-types.component').then((m) => m.ContractTypesComponent)
  },
  {
    path: 'parametrage/provisionTypes',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/parametres-assurance/provision-types/provision-types.component').then((m) => m.ProvisionTypesComponent)
  },
  {
    path: 'parametrage/mortalityTables',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/parametres-assurance/mortality-tables/mortality-tables.component').then((m) => m.MortalityTablesComponent)
  },
  {
    path: 'parametrage/profiles',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/securite/profiles/profiles.component').then((m) => m.ProfilesComponent)
  },
  {
    path: 'parametrage/roles',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/securite/roles/roles.component').then((m) => m.RolesComponent)
  },
  {
    path: 'parametrage/permissions',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/securite/permissions/permissions.component').then((m) => m.PermissionsComponent)
  },
  {
    path: 'parametrage/users',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/securite/users/users.component').then((m) => m.UsersComponent)
  },
  {
    path: 'parametrage/sessions',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/securite/sessions/sessions.component').then((m) => m.SessionsComponent)
  },
  {
    path: 'parametrage/refreshTokens',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/securite/refresh-tokens/refresh-tokens.component').then((m) => m.RefreshTokensComponent)
  },
  {
    path: 'parametrage/auditLogs',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/securite/audit-logs/audit-logs.component').then((m) => m.AuditLogsComponent)
  },
  {
    path: 'parametrage/securityParameters',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/securite/security-parameters/security-parameters.component').then((m) => m.SecurityParametersComponent)
  },
  {
    path: 'parametrage/passwordResetTokens',
    canActivate: [authGuard],
    loadComponent: () => import('./administration/securite/password-reset-tokens/password-reset-tokens.component').then((m) => m.PasswordResetTokensComponent)
  },
  {
    path: 'parametrage/assetAcquisitions',
    canActivate: [authGuard],
    loadComponent: () => import('./investissements/asset-acquisitions/asset-acquisitions.component').then((m) => m.AssetAcquisitionsComponent)
  },
  {
    path: 'parametrage/financialAssets',
    canActivate: [authGuard],
    loadComponent: () => import('./investissements/financial-assets/financial-assets.component').then((m) => m.FinancialAssetsComponent)
  },
  {
    path: 'parametrage/assetMaturities',
    canActivate: [authGuard],
    loadComponent: () => import('./investissements/asset-maturities/asset-maturities.component').then((m) => m.AssetMaturitiesComponent)
  },
  {
    path: 'parametrage/amortizationSchedules',
    canActivate: [authGuard],
    loadComponent: () => import('./investissements/amortization-schedules/amortization-schedules.component').then((m) => m.AmortizationSchedulesComponent)
  },
  {
    path: 'parametrage/assetDocuments',
    canActivate: [authGuard],
    loadComponent: () => import('./investissements/asset-documents/asset-documents.component').then((m) => m.AssetDocumentsComponent)
  },
  {
    path: 'parametrage/assetRatings',
    canActivate: [authGuard],
    loadComponent: () => import('./investissements/asset-ratings/asset-ratings.component').then((m) => m.AssetRatingsComponent)
  },
  {
    path: 'parametrage/accountingMappings',
    canActivate: [authGuard],
    loadComponent: () => import('./comptabilisation/accounting-mappings/accounting-mappings.component').then((m) => m.AccountingMappingsComponent)
  },
  {
    path: 'parametrage/sageExports',
    canActivate: [authGuard],
    loadComponent: () => import('./comptabilisation/sage-exports/sage-exports.component').then((m) => m.SageExportsComponent)
  },
  {
    path: 'parametrage/regulatoryReports',
    canActivate: [authGuard],
    loadComponent: () => import('./reporting/regulatory-reports/regulatory-reports.component').then((m) => m.RegulatoryReportsComponent)
  }
];
