import { NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, forkJoin, of, switchMap, takeUntil } from 'rxjs';
import { ApiService, CrudRecord } from '../../core/api.service';
import { EntityConfig, FieldConfig, entityConfigByKey } from '../../core/entity-config';

@Component({
  selector: 'app-entity-crud',
  standalone: true,
  imports: [NgFor, NgIf, NgSwitch, NgSwitchCase, ReactiveFormsModule],
  templateUrl: './entity-crud.component.html',
  styleUrls: ['./entity-crud.component.css']
})
export class EntityCrudComponent implements OnInit, OnDestroy {
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
  readonly pageSizeOptions = [5, 10, 20, 50];
  error = '';
  success = '';

  readonly form: UntypedFormGroup;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: ApiService,
    private readonly fb: UntypedFormBuilder
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const entityKey = params.get('entityKey') ?? '';
        const config = entityConfigByKey.get(entityKey);
        if (!config) {
          this.error = 'Ressource inconnue.';
          return;
        }
        this.config = config;
        this.buildForm(config);
        this.clearFilters();
        this.closeForm();
        this.loadData();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    return value === null || value === undefined || value === '' ? '-' : String(value);
  }

  optionLabel(field: FieldConfig, option: CrudRecord): string {
    const labelKey = field.optionLabelKey ?? 'libelle';
    return String(option[labelKey] ?? option['code'] ?? option['id'] ?? '');
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
      this.selectedRowIds.add(id);
    } else {
      this.selectedRowIds.delete(id);
    }
  }

  view(row: CrudRecord): void {
    this.selected = row;
    this.formMode = 'view';
    this.showForm = true;
    this.success = '';
    this.form.patchValue(row);
    this.form.disable();
  }

  togglePagedRowsSelection(event: Event): void {
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
    this.showForm = true;
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
        this.loadData();
      },
      error: (error) => this.handleError(error),
      complete: () => (this.saving = false)
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
        this.loadData();
      },
      error: (error) => this.handleError(error)
    });
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

    this.loadOptions(this.config)
      .pipe(switchMap(() => this.config ? this.api.findAll(this.config) : of([])))
      .subscribe({
        next: (rows) => {
          this.rows = rows;
          this.currentPage = 1;
          this.clearSelection();
        },
        error: (error) => this.handleError(error),
        complete: () => (this.loading = false)
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

  private handleError(error: unknown): void {
    this.saving = false;
    this.loading = false;
    this.error = "Une erreur est survenue pendant l'appel API.";

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        this.error = "API indisponible. Verifiez que le backend Spring Boot est demarre sur http://localhost:8080.";
        return;
      }

      if (error.status === 200) {
        this.error = "La route API retourne une reponse non JSON. Verifiez que le backend Spring Boot est demarre et que le proxy /api pointe bien vers http://localhost:8080.";
        return;
      }

      this.error = error.error?.message ?? `Erreur API (${error.status}) : ${error.statusText || 'requete impossible'}.`;
      return;
    }

    if (typeof error === 'object' && error !== null && 'error' in error) {
      const apiError = (error as { error?: { message?: string } }).error;
      this.error = apiError?.message ?? this.error;
    }
  }
}
