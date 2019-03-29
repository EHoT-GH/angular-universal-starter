import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration.component';

const registrationRoutes: Routes = [
  {
    path: '',
    component: RegistrationComponent,
    data: {
      meta: {
        title: 'auth.ts.registration.title',
        description: 'auth.ts.registration.text',
        override: true,
      },
    }
  }
];

export const RegistrationRoutes = RouterModule.forChild(registrationRoutes);
