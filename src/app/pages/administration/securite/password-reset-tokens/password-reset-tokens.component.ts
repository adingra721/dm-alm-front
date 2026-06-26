import { Component } from '@angular/core';
import { EntityCrudComponent } from '../../../entity-crud/entity-crud.component';

@Component({
  selector: 'app-password-reset-tokens',
  standalone: true,
  imports: [EntityCrudComponent],
  templateUrl: './password-reset-tokens.component.html',
  styleUrl: './password-reset-tokens.component.css'
})
export class PasswordResetTokensComponent {
  readonly entityKey = 'passwordResetTokens';
}
