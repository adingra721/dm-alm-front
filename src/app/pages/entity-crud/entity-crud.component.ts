import { DecimalPipe, NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, forkJoin, of, switchMap, takeUntil } from 'rxjs';
import { ApiService, CrudRecord } from '../../core/api.service';
import { EntityConfig, FieldConfig, FormTabConfig, entityConfigByKey } from '../../core/entity-config';

interface ActivityRecord {
  type: string;
  title: string;
  description: string;
  timestamp: string;
  date: string;
  user?: {
    avatar: string;
    name: string;
  };
  metadata?: {
    ip?: string;
    device?: string;
    location?: string;
    file?: string;
    amount?: number;
  };
}

interface ActivityGroup {
  date: string;
  items: ActivityRecord[];
}

interface WorkflowAction {
  key: string;
  label: string;
  icon: string;
  tone: 'primary' | 'success' | 'warning' | 'validation' | 'danger' | 'neutral';
  requiresComment?: boolean;
}

interface WorkflowStep {
  status: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-entity-crud',
  standalone: true,
  imports: [DecimalPipe, FormsModule, NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, ReactiveFormsModule],
  templateUrl: './entity-crud.component.html',
  styleUrls: ['./entity-crud.component.css']
})
export class EntityCrudComponent implements OnChanges, OnInit, OnDestroy {
  @Input() entityKey?: string;

  config?: EntityConfig;
  rows: CrudRecord[] = [];
  options: Record<string, CrudRecord[]> = {};
  selected?: CrudRecord;
  loading = false;
  saving = false;
  showForm = false;
  formMode: 'create' | 'edit' | 'view' = 'create';
  columnFilters: Record<string, string> = {};
  visibleColumnKeys = new Set<string>();
  selectedRowIds = new Set<number>();
  currentPage = 1;
  pageSize = 10;
  activeFormTabKey = '';
  searchQuery = '';
  selectedFilter = 'all';
  readonly pageSizeOptions = [5, 10, 20, 50];
  readonly rolePermissionGroups = [
    {
      key: 'users',
      label: 'Gestion des utilisateurs',
      permissions: [
        { key: 'users.read', title: 'Consulter les utilisateurs', description: 'Voir la liste et les details' },
        { key: 'users.create', title: 'Creer un utilisateur', description: 'Ajouter de nouveaux utilisateurs' },
        { key: 'users.update', title: 'Modifier un utilisateur', description: 'Editer les informations' },
        { key: 'users.delete', title: 'Supprimer un utilisateur', description: 'Retirer du systeme' },
        { key: 'users.export', title: 'Exporter les utilisateurs', description: 'Telecharger en CSV/Excel' }
      ]
    },
    {
      key: 'roles',
      label: 'Gestion des roles',
      permissions: [
        { key: 'roles.read', title: 'Consulter les roles', description: 'Voir les roles et permissions' },
        { key: 'roles.create', title: 'Creer un role', description: 'Ajouter un nouveau role' },
        { key: 'roles.update', title: 'Modifier un role', description: 'Mettre a jour les permissions' }
      ]
    }
  ];
  selectedRolePermissionKeys = new Set<string>();
  readonly filters = [
    { label: 'Toutes', value: 'all' },
    { label: 'Connexions', value: 'login' },
    { label: 'Modifications', value: 'update' },
    { label: 'Creations', value: 'create' },
    { label: 'Suppressions', value: 'delete' },
    { label: 'Paiements', value: 'payment' }
  ];
  readonly activities: ActivityRecord[] = [
    {
      type: 'login',
      title: 'Connexion reussie',
      description: 'Connexion depuis un nouvel appareil detecte.',
      timestamp: '2024-01-15T09:23:00',
      date: 'Lundi 15 janvier 2024',
      user: { avatar: 'AD', name: 'Admin CIMA' },
      metadata: { ip: '192.168.1.42', device: 'MacBook Pro', location: 'Paris, France' }
    },
    {
      type: 'update',
      title: 'Profil mis a jour',
      description: 'Les informations du profil ont ete modifiees.',
      timestamp: '2024-01-15T11:45:00',
      date: 'Lundi 15 janvier 2024',
      user: { avatar: 'AD', name: 'Admin CIMA' },
      metadata: { ip: '192.168.1.42', device: 'MacBook Pro', location: 'Paris, France' }
    },
    {
      type: 'create',
      title: 'Nouveau dossier cree',
      description: 'Le dossier d acquisition a ete cree.',
      timestamp: '2024-01-15T14:30:00',
      date: 'Lundi 15 janvier 2024',
      user: { avatar: 'NA', name: 'Nadia Assurances' },
      metadata: { ip: '192.168.1.42', device: 'MacBook Pro', location: 'Paris, France' }
    },
    {
      type: 'comment',
      title: 'Commentaire ajoute',
      description: 'Commentaire sur la validation du dossier.',
      timestamp: '2024-01-14T16:12:00',
      date: 'Dimanche 14 janvier 2024',
      user: { avatar: 'DA', name: 'Direction Financiere' },
      metadata: { ip: '192.168.1.42', device: 'MacBook Pro', location: 'Paris, France' }
    },
    {
      type: 'share',
      title: 'Document partage',
      description: 'Le fichier "Rapport Q4" a ete partage avec l equipe.',
      timestamp: '2024-01-14T10:00:00',
      date: 'Dimanche 14 janvier 2024',
      user: { avatar: 'DG', name: 'Direction Generale' },
      metadata: { ip: '10.0.0.5', device: 'iPhone 15', location: 'Lyon, France', file: 'Rapport Q4.pdf' }
    },
    {
      type: 'payment',
      title: 'Paiement enregistre',
      description: 'Un paiement lie au dossier a ete enregistre.',
      timestamp: '2024-01-13T08:40:00',
      date: 'Samedi 13 janvier 2024',
      user: { avatar: 'CP', name: 'Comptabilite' },
      metadata: { amount: 2500000, file: 'Piece comptable.pdf' }
    }
  ];
  error = '';
  success = '';

  readonly form: UntypedFormGroup;
  private readonly destroy$ = new Subject<void>();
  private readonly loadCancel$ = new Subject<void>();
  private configuredEntityKey = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: ApiService,
    private readonly fb: UntypedFormBuilder,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    if (this.entityKey) {
      return;
    }

    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.configureEntity(params.get('entityKey') ?? '');
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const entityKey = changes['entityKey']?.currentValue;
    if (entityKey) {
      this.configureEntity(entityKey);
    }
  }

  ngOnDestroy(): void {
    this.loadCancel$.next();
    this.loadCancel$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private configureEntity(entityKey: string): void {
    if (this.configuredEntityKey === entityKey) {
      return;
    }

    const config = entityConfigByKey.get(entityKey);
    if (!config) {
      this.error = 'Ressource inconnue.';
      return;
    }

    this.loadCancel$.next();
    this.configuredEntityKey = entityKey;
    this.config = config;
    this.rows = [];
    this.options = {};
    this.activeFormTabKey = config.formTabs?.[0]?.key ?? '';
    this.error = '';
    this.success = '';
    this.buildForm(config);
    this.clearFilters();
    this.closeForm();
    this.cdr.detectChanges();
    this.loadData();
  }

  get columns(): string[] {
    return this.config?.displayColumns ?? [];
  }

  get visibleColumns(): string[] {
    const visibleColumns = this.columns.filter((column) => this.visibleColumnKeys.has(column));
    return visibleColumns.length ? visibleColumns : this.columns;
  }

  get filteredRows(): CrudRecord[] {
    const activeFilters = Object.entries(this.columnFilters)
      .map(([key, value]) => [key, value.trim().toLowerCase()] as const)
      .filter(([, value]) => value.length > 0);

    if (!activeFilters.length) {
      return this.rows;
    }

    return this.rows.filter((row) =>
      activeFilters.every(([key, value]) =>
        this.displayValue(row, key).toLowerCase().includes(value)
      )
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get pagedRows(): CrudRecord[] {
    const page = Math.min(this.currentPage, this.totalPages);
    const start = (page - 1) * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get paginationStart(): number {
    if (!this.filteredRows.length) {
      return 0;
    }
    return (Math.min(this.currentPage, this.totalPages) - 1) * this.pageSize + 1;
  }

  get paginationEnd(): number {
    return Math.min(Math.min(this.currentPage, this.totalPages) * this.pageSize, this.filteredRows.length);
  }

  get selectedCount(): number {
    return this.selectedRowIds.size;
  }

  get selectedWorkflowRow(): CrudRecord | undefined {
    if (this.selectedRowIds.size !== 1) {
      return undefined;
    }
    const selectedId = Array.from(this.selectedRowIds)[0];
    return this.rows.find((row) => this.rowId(row) === selectedId);
  }

  get formTabs(): FormTabConfig[] {
    const tabs = [...(this.config?.formTabs ?? [])];
    if (!this.isWorkflowEntity || tabs.some((tab) => tab.key === 'workflow')) {
      return tabs;
    }

    const historyIndex = tabs.findIndex((tab) => tab.key === 'history');
    const workflowTab: FormTabConfig = {
      key: 'workflow',
      label: 'Workflow',
      description: this.config?.key === 'assetAcquisitions'
        ? 'Circuit de soumission, autorisation, validation et rejet.'
        : 'Circuit de controle, validation, activation et rejet.'
    };

    if (historyIndex >= 0) {
      tabs.splice(historyIndex, 0, workflowTab);
    } else {
      tabs.push(workflowTab);
    }

    return tabs;
  }

  get hasFormTabs(): boolean {
    return this.formTabs.length > 0;
  }

  get isRoleForm(): boolean {
    return this.config?.key === 'roles';
  }

  get isWorkflowEntity(): boolean {
    return this.config?.key === 'assetAcquisitions' || this.config?.key === 'financialAssets';
  }

  get selectedRolePermissionCount(): number {
    return this.selectedRolePermissionKeys.size;
  }

  get activeFormTab(): FormTabConfig | undefined {
    return this.formTabs.find((tab) => tab.key === this.activeFormTabKey);
  }

  get visibleFormFields(): FieldConfig[] {
    if (!this.config) {
      return [];
    }

    const tab = this.activeFormTab;
    if (!tab?.fieldKeys?.length) {
      return this.hasFormTabs ? [] : this.config.fields;
    }

    const fieldKeys = new Set(tab.fieldKeys);
    return this.config.fields.filter((field) => fieldKeys.has(field.key));
  }

  get allPagedRowsSelected(): boolean {
    return this.pagedRows.length > 0 && this.pagedRows.every((row) => this.isRowSelected(row));
  }

  get somePagedRowsSelected(): boolean {
    return this.pagedRows.some((row) => this.isRowSelected(row)) && !this.allPagedRowsSelected;
  }

  displayValue(row: CrudRecord, key: string): string {
    const value = row[key];
    if (typeof value === 'boolean') {
      return value ? 'Oui' : 'Non';
    }
    const relationLabel = this.displayRelationLabel(row, key);
    if (relationLabel) {
      return relationLabel;
    }
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    if (this.isStatusKey(key)) {
      return this.statusLabel(value);
    }
    const optionValue = this.displayOptionValue(key, value);
    if (optionValue) {
      return optionValue;
    }
    if (this.isDateKey(key)) {
      return this.formatDateValue(value);
    }
    if (this.isAmountKey(key)) {
      return this.formatNumberValue(value);
    }
    return String(value);
  }

  statusLabel(status: unknown): string {
    const normalized = this.normalizeStatusValue(status);
    if (this.config?.key === 'assetAcquisitions') {
      const acquisitionLabels: Record<string, string> = {
        BROUILLON: 'BROUILLON',
        SOUMIS: 'EN AUTORISATION',
        AUTORISE: 'EN VALIDATION',
        VALIDE: 'ACTIF',
        REJETE: 'REJETE'
      };
      return acquisitionLabels[normalized] ?? this.formatStatusValue(normalized);
    }

    const labels: Record<string, string> = {
      BROUILLON: 'BROUILLON',
      SOUMIS: 'SOUMIS',
      AUTORISE: 'AUTORISE',
      EN_CONTROLE: 'EN CONTROLE',
      EN_VALIDATION: 'EN VALIDATION',
      VALIDE: 'VALIDE',
      ACTIF: 'ACTIF',
      REJETE: 'REJETE'
    };
    return labels[normalized] ?? this.formatStatusValue(normalized);
  }

  statusTone(status: unknown): string {
    const normalized = this.normalizeStatusValue(status);
    if (normalized === 'VALIDE' || normalized === 'ACTIF') {
      return 'success';
    }
    if (normalized === 'REJETE') {
      return 'danger';
    }
    if (normalized === 'EN_VALIDATION' || (this.config?.key === 'assetAcquisitions' && normalized === 'AUTORISE')) {
      return 'validation';
    }
    if (normalized === 'SOUMIS' || normalized === 'AUTORISE' || normalized === 'EN_CONTROLE' || normalized === 'EN_VALIDATION') {
      return 'warning';
    }
    return 'neutral';
  }

  columnClass(column: string): string {
    return this.isAmountKey(column) ? 'amount-cell' : '';
  }

  columnLabel(column: string): string {
    const directField = this.config?.fields.find((field) => field.key === column);
    if (directField) {
      return directField.label;
    }

    if (column.endsWith('Libelle')) {
      const relationFieldKey = `${column.slice(0, -'Libelle'.length)}Id`;
      const relationField = this.config?.fields.find((field) => field.key === relationFieldKey);
      if (relationField) {
        return relationField.label;
      }
    }

    return column;
  }

  workflowSteps(): WorkflowStep[] {
    if (this.config?.key === 'assetAcquisitions') {
      return [
        { status: 'BROUILLON', label: 'BROUILLON', description: 'Dossier prepare par le gestionnaire.' },
        { status: 'SOUMIS', label: 'EN AUTORISATION', description: 'Dossier envoye pour autorisation.' },
        { status: 'AUTORISE', label: 'EN VALIDATION', description: 'Autorisation obtenue, dossier en validation.' },
        { status: 'VALIDE', label: 'ACTIF', description: 'Dossier valide et actif.' }
      ];
    }

    return [
      { status: 'BROUILLON', label: 'BROUILLON', description: 'Actif en preparation.' },
      { status: 'EN_CONTROLE', label: 'EN CONTROLE', description: 'Controle ALM et conformite.' },
      { status: 'VALIDE', label: 'VALIDE', description: 'Actif valide pour activation.' },
      { status: 'ACTIF', label: 'ACTIF', description: 'Actif integre au portefeuille.' }
    ];
  }

  isWorkflowStepDone(status: string): boolean {
    const selectedStatus = this.normalizeStatusValue(this.form.get('statut')?.value);
    const steps = this.workflowSteps().map((step) => step.status);
    return steps.indexOf(status) <= steps.indexOf(selectedStatus) && steps.indexOf(selectedStatus) >= 0;
  }

  workflowActions(row?: CrudRecord): WorkflowAction[] {
    if (!this.config || !this.isWorkflowEntity) {
      return [];
    }

    const status = this.normalizeStatusValue(row?.['statut'] ?? this.form.get('statut')?.value);
    if (this.config.key === 'assetAcquisitions') {
      const actions: Record<string, WorkflowAction[]> = {
        BROUILLON: [{ key: 'submit', label: 'Soumettre', icon: 'fa-paper-plane', tone: 'primary' }],
        REJETE: [{ key: 'submit', label: 'Resoumettre', icon: 'fa-paper-plane', tone: 'primary' }],
        SOUMIS: [
          { key: 'authorize', label: 'Autoriser', icon: 'fa-check-circle', tone: 'success' },
          { key: 'reject', label: 'Rejeter', icon: 'fa-times-circle', tone: 'danger', requiresComment: true }
        ],
        AUTORISE: [
          { key: 'validate', label: 'Valider', icon: 'fa-check', tone: 'success' },
          { key: 'reject', label: 'Rejeter', icon: 'fa-times-circle', tone: 'danger', requiresComment: true }
        ],
        VALIDE: [{ key: 'reactivate', label: 'Reouvrir', icon: 'fa-undo', tone: 'warning' }]
      };
      return actions[status] ?? actions['BROUILLON'];
    }

    const actions: Record<string, WorkflowAction[]> = {
      BROUILLON: [{ key: 'submit', label: 'Controle', icon: 'fa-search', tone: 'primary' }],
      REJETE: [{ key: 'submit', label: 'Reprendre', icon: 'fa-undo', tone: 'primary' }],
      EN_CONTROLE: [
        { key: 'validate', label: 'Valider', icon: 'fa-check-circle', tone: 'success' },
        { key: 'reject', label: 'Rejeter', icon: 'fa-times-circle', tone: 'danger', requiresComment: true }
      ],
      EN_VALIDATION: [
        { key: 'validate', label: 'Valider', icon: 'fa-check-circle', tone: 'success' },
        { key: 'reject', label: 'Rejeter', icon: 'fa-times-circle', tone: 'danger', requiresComment: true }
      ],
      VALIDE: [{ key: 'activate', label: 'Activer', icon: 'fa-play', tone: 'success' }],
      ACTIF: [{ key: 'reactivate', label: 'Reouvrir', icon: 'fa-undo', tone: 'warning' }]
    };
    return actions[status] ?? actions['BROUILLON'];
  }

  optionLabel(field: FieldConfig, option: CrudRecord): string {
    const labelKey = field.optionLabelKey ?? 'libelle';
    return String(option[labelKey] ?? option['code'] ?? option['id'] ?? '');
  }

  private displayOptionValue(key: string, value: string | number | boolean): string {
    const field = this.config?.fields.find((item) => item.key === key);
    if (!field?.optionEntityKey) {
      return '';
    }

    const option = this.options[field.optionEntityKey]?.find((item) => String(item['id']) === String(value));
    return option ? this.optionLabel(field, option) : '';
  }

  private displayRelationLabel(row: CrudRecord, key: string): string {
    if (!key.endsWith('Libelle')) {
      return '';
    }

    const relationFieldKey = `${key.slice(0, -'Libelle'.length)}Id`;
    const relationId = row[relationFieldKey];
    if (relationId === null || relationId === undefined || relationId === '') {
      return '';
    }

    return this.displayOptionValue(relationFieldKey, relationId);
  }

  isColumnVisible(column: string): boolean {
    return this.visibleColumnKeys.has(column);
  }

  toggleColumn(column: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.visibleColumnKeys.add(column);
    } else {
      this.visibleColumnKeys.delete(column);
      delete this.columnFilters[column];
      this.currentPage = 1;
    }
  }

  showAllColumns(): void {
    this.visibleColumnKeys = new Set(this.columns);
  }

  rowId(row: CrudRecord): number {
    return Number(row['id']);
  }

  isRowSelected(row: CrudRecord): boolean {
    return this.selectedRowIds.has(this.rowId(row));
  }

  toggleRowSelection(row: CrudRecord, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const id = this.rowId(row);
    if (!Number.isFinite(id)) {
      return;
    }

    if (checkbox.checked) {
      if (this.isWorkflowEntity) {
        this.selectedRowIds.clear();
        this.openWorkflowForm(row);
      }
      this.selectedRowIds.add(id);
    } else {
      this.selectedRowIds.delete(id);
      if (this.isWorkflowEntity && Number(this.selected?.['id']) === id) {
        this.closeForm();
      }
    }
  }

  view(row: CrudRecord): void {
    this.selected = row;
    this.formMode = 'view';
    this.showForm = true;
    this.openFirstFormTab();
    this.success = '';
    this.form.patchValue(row);
    this.form.disable();
  }

  private openWorkflowForm(row: CrudRecord): void {
    this.selected = row;
    this.formMode = 'view';
    this.showForm = true;
    this.activeFormTabKey = 'workflow';
    this.success = '';
    this.error = '';
    this.form.patchValue(row);
    this.form.disable();
    this.cdr.detectChanges();
  }

  togglePagedRowsSelection(event: Event): void {
    if (this.isWorkflowEntity) {
      (event.target as HTMLInputElement).checked = false;
      return;
    }

    const checkbox = event.target as HTMLInputElement;
    this.pagedRows.forEach((row) => {
      const id = this.rowId(row);
      if (!Number.isFinite(id)) {
        return;
      }
      if (checkbox.checked) {
        this.selectedRowIds.add(id);
      } else {
        this.selectedRowIds.delete(id);
      }
    });
  }

  clearSelection(): void {
    this.selectedRowIds.clear();
  }

  setColumnFilter(column: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.columnFilters[column] = input.value;
    this.currentPage = 1;
  }

  clearFilters(): void {
    this.columnFilters = {};
    this.currentPage = 1;
    this.clearSelection();
  }

  changePage(page: number): void {
    this.currentPage = Math.min(Math.max(page, 1), this.totalPages);
  }

  changePageSize(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize = Number(select.value);
    this.currentPage = 1;
  }

  edit(row: CrudRecord): void {
    this.selected = row;
    this.formMode = 'edit';
    this.showForm = true;
    this.openFirstFormTab();
    this.success = '';
    this.form.enable();
    this.form.patchValue(row);
  }

  create(): void {
    this.selected = undefined;
    this.formMode = 'create';
    this.success = '';
    this.error = '';
    this.form.enable();
    this.resetForm();
    this.openFirstFormTab();
    this.showForm = true;
  }

  setFormTab(tabKey: string): void {
    this.activeFormTabKey = tabKey;
  }

  isRolePermissionSelected(permissionKey: string): boolean {
    return this.selectedRolePermissionKeys.has(permissionKey);
  }

  isRolePermissionGroupSelected(group: { permissions: Array<{ key: string }> }): boolean {
    return group.permissions.every((permission) => this.isRolePermissionSelected(permission.key));
  }

  toggleRolePermission(permissionKey: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedRolePermissionKeys.add(permissionKey);
    } else {
      this.selectedRolePermissionKeys.delete(permissionKey);
    }
  }

  toggleRolePermissionGroup(group: { permissions: Array<{ key: string }> }, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    group.permissions.forEach((permission) => {
      if (checkbox.checked) {
        this.selectedRolePermissionKeys.add(permission.key);
      } else {
        this.selectedRolePermissionKeys.delete(permission.key);
      }
    });
  }

  cancel(): void {
    this.closeForm();
  }

  save(): void {
    if (this.formMode === 'view') {
      return;
    }

    if (!this.config || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.normalizePayload(this.form.getRawValue() as CrudRecord);
    const id = Number(this.selected?.['id']);
    this.saving = true;
    this.error = '';
    this.success = '';

    const request$ = this.selected
      ? this.api.update(this.config, id, payload)
      : this.api.create(this.config, payload);

    request$.subscribe({
      next: () => {
        this.success = this.selected ? 'Element modifie avec succes.' : 'Element cree avec succes.';
        this.closeForm();
        this.cdr.detectChanges();
        this.loadData();
      },
      error: (error) => this.handleError(error),
      complete: () => {
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyWorkflowAction(row: CrudRecord | undefined, action: WorkflowAction): void {
    if (!this.config || !this.isWorkflowEntity) {
      return;
    }

    const target = row ?? this.selected;
    const id = Number(target?.['id']);
    if (!Number.isFinite(id)) {
      this.error = 'Enregistrez d abord la fiche avant de lancer le workflow.';
      return;
    }

    let commentaire = '';
    if (action.requiresComment) {
      commentaire = prompt('Motif ou commentaire de rejet')?.trim() ?? '';
      if (!commentaire) {
        return;
      }
    }

    this.saving = true;
    this.error = '';
    this.success = '';

    this.api.workflowAction(this.config, id, action.key, {
      commentaire,
      utilisateur: 'Utilisateur courant'
    } as CrudRecord).subscribe({
      next: (updated) => {
        this.success = `Workflow mis a jour : ${this.statusLabel(updated['statut'])}.`;
        if (!row) {
          this.selected = updated;
          this.form.patchValue(updated);
        }
        this.cdr.detectChanges();
        this.loadData();
      },
      error: (error) => this.handleError(error),
      complete: () => {
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  delete(row: CrudRecord): void {
    if (!this.config || !row['id']) {
      return;
    }

    const label = String(row['libelle'] ?? row['raisonSociale'] ?? row['username'] ?? row['code'] ?? row['id']);
    if (!confirm(`Supprimer "${label}" ?`)) {
      return;
    }

    this.api.delete(this.config, Number(row['id'])).subscribe({
      next: () => {
        this.success = 'Element supprime avec succes.';
        this.cdr.detectChanges();
        this.loadData();
      },
      error: (error) => this.handleError(error)
    });
  }

  getFilteredActivities(): ActivityRecord[] {
    const query = this.searchQuery.trim().toLowerCase();
    return this.activities.filter((activity) => {
      const matchesFilter = this.selectedFilter === 'all' || activity.type === this.selectedFilter;
      const matchesQuery = !query ||
        activity.title.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        activity.date.toLowerCase().includes(query) ||
        activity.user?.name.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  }

  groupByDate(activities: ActivityRecord[]): ActivityGroup[] {
    return activities.reduce<ActivityGroup[]>((groups, activity) => {
      const group = groups.find((item) => item.date === activity.date);
      if (group) {
        group.items.push(activity);
      } else {
        groups.push({ date: activity.date, items: [activity] });
      }
      return groups;
    }, []);
  }

  getActivityClass(type: string): string {
    const classes: Record<string, string> = {
      login: 'activity--success',
      update: 'activity--warning',
      create: 'activity--info',
      delete: 'activity--danger',
      payment: 'activity--primary',
      comment: 'activity--neutral',
      share: 'activity--primary'
    };
    return classes[type] ?? 'activity--neutral';
  }

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      login: 'fa-sign-in',
      update: 'fa-pencil',
      create: 'fa-plus-circle',
      delete: 'fa-trash',
      payment: 'fa-credit-card',
      comment: 'fa-commenting-o',
      share: 'fa-share-alt'
    };
    return icons[type] ?? 'fa-clock-o';
  }

  getRelativeTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  clearActivityFilters(): void {
    this.searchQuery = '';
    this.selectedFilter = 'all';
  }

  private buildForm(config: EntityConfig): void {
    this.visibleColumnKeys = new Set(config.displayColumns);
    Object.keys(this.form.controls).forEach((key) => this.form.removeControl(key));
    config.fields.forEach((field) => {
      const validators = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      if (field.maxLength) {
        validators.push(Validators.maxLength(field.maxLength));
      }
      if (field.type === 'email') {
        validators.push(Validators.email);
      }
      this.form.addControl(field.key, this.fb.control(field.type === 'checkbox' ? true : null, validators));
    });
  }

  loadData(): void {
    if (!this.config) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    const config = this.config;

    this.loadOptions(config)
      .pipe(
        switchMap(() => this.api.findAll(config)),
        takeUntil(this.loadCancel$)
      )
      .subscribe({
        next: (rows) => {
          this.rows = rows;
          this.currentPage = 1;
          this.clearSelection();
          this.cdr.detectChanges();
        },
        error: (error) => this.handleError(error),
        complete: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  private loadOptions(config: EntityConfig) {
    const optionConfigs = config.fields
      .map((field) => field.optionEntityKey)
      .filter((key): key is string => Boolean(key))
      .map((key) => entityConfigByKey.get(key))
      .filter((item): item is EntityConfig => Boolean(item));

    if (!optionConfigs.length) {
      this.options = {};
      return of({});
    }

    const requests = Object.fromEntries(optionConfigs.map((item) => [item.key, this.api.findAll(item)]));
    return forkJoin(requests).pipe(
      switchMap((options) => {
        this.options = options;
        this.cdr.detectChanges();
        return of(options);
      })
    );
  }

  private resetForm(): void {
    this.form.reset();
    this.config?.fields
      .filter((field) => field.type === 'checkbox')
      .forEach((field) => this.form.get(field.key)?.setValue(true));
  }

  private closeForm(): void {
    this.selected = undefined;
    this.formMode = 'create';
    this.showForm = false;
    this.form.enable();
    this.resetForm();
  }

  private openFirstFormTab(): void {
    this.activeFormTabKey = this.formTabs[0]?.key ?? '';
  }

  private normalizePayload(value: CrudRecord): CrudRecord {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        if (item === '') {
          return [key, null];
        }
        if (key.endsWith('Id') && item !== null && item !== undefined) {
          return [key, Number(item)];
        }
        return [key, item];
      })
    );
  }

  normalizeStatusValue(status: unknown): string {
    return String(status ?? 'BROUILLON').trim().toUpperCase();
  }

  private isAmountKey(key: string): boolean {
    const normalized = key.toLowerCase();
    return !normalized.endsWith('id') && (
      normalized.includes('montant') ||
      normalized.includes('valeur') ||
      normalized.includes('capital') ||
      normalized.includes('interet') ||
      normalized.includes('amortissement') ||
      normalized.includes('prix') ||
      normalized.includes('solde')
    );
  }

  private isDateKey(key: string): boolean {
    return key.toLowerCase().includes('date') || key.toLowerCase().endsWith('at') || key.toLowerCase().endsWith('until');
  }

  private isStatusKey(key: string): boolean {
    const normalized = key.toLowerCase();
    return normalized === 'statut' || normalized === 'status';
  }

  private formatStatusValue(status: string): string {
    return status.replace(/_/g, ' ').toUpperCase();
  }

  private formatNumberValue(value: string | number | boolean): string {
    const numberValue = typeof value === 'number' ? value : Number(String(value).replace(',', '.'));
    if (!Number.isFinite(numberValue)) {
      return String(value);
    }
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: Number.isInteger(numberValue) ? 0 : 2,
      maximumFractionDigits: 4
    }).format(numberValue);
  }

  private formatDateValue(value: string | number | boolean): string {
    if (typeof value === 'boolean') {
      return value ? 'Oui' : 'Non';
    }

    const rawValue = String(value);
    const dateValue = new Date(rawValue);
    if (Number.isNaN(dateValue.getTime())) {
      return rawValue;
    }

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateValue);
  }

  private handleError(error: unknown): void {
    this.saving = false;
    this.loading = false;
    this.error = "Une erreur est survenue pendant l'appel API.";

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        this.error = "API indisponible. Verifiez que le backend Spring Boot est demarre sur http://localhost:8080.";
        this.cdr.detectChanges();
        return;
      }

      if (error.status === 200) {
        this.error = "La route API retourne une reponse non JSON. Verifiez que le backend Spring Boot est demarre et que le proxy /api pointe bien vers http://localhost:8080.";
        this.cdr.detectChanges();
        return;
      }

      this.error = error.error?.message ?? `Erreur API (${error.status}) : ${error.statusText || 'requete impossible'}.`;
      this.cdr.detectChanges();
      return;
    }

    if (typeof error === 'object' && error !== null && 'error' in error) {
      const apiError = (error as { error?: { message?: string } }).error;
      this.error = apiError?.message ?? this.error;
    }

    this.cdr.detectChanges();
  }
}
