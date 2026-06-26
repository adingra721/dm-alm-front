import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-refresh-tokens',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './refresh-tokens.component.html',
  styleUrl: './refresh-tokens.component.css'
})
export class RefreshTokensComponent {
  readonly entityKey = 'refreshTokens';
}
