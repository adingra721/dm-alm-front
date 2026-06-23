import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EntityConfig } from './entity-config';

export type CrudRecord = Record<string, string | number | boolean | null | undefined>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  findAll(config: EntityConfig): Observable<CrudRecord[]> {
    return this.http.get<CrudRecord[]>(`${this.baseUrl}${config.endpoint}`);
  }

  create(config: EntityConfig, payload: CrudRecord): Observable<CrudRecord> {
    return this.http.post<CrudRecord>(`${this.baseUrl}${config.endpoint}`, payload);
  }

  update(config: EntityConfig, id: number, payload: CrudRecord): Observable<CrudRecord> {
    return this.http.put<CrudRecord>(`${this.baseUrl}${config.endpoint}/${id}`, payload);
  }

  delete(config: EntityConfig, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${config.endpoint}/${id}`);
  }
}
