import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivate } from '@angular/router';
import { AuthGuardService as AuthGuard} from './services/auth.guard.service';
// Layouts
import { CommonLayoutComponent } from './common/common-layout.component';
import { AuthenticationLayoutComponent } from './common/authentication-layout.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'authentication/sign-in',
        pathMatch: 'full',
    },
    {
        path: '',
        component: CommonLayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: './dashboard/dashboard.module#DashboardModule'
            },
            {
              path: 'maps',
              loadChildren: './maps/maps.modules#MapsModule',
              // canActivate: [AuthGuard]
            },
            {
              path: 'shipments',
              loadChildren: './shipments/shipments.modules#ShipmentsModule'
            },
            {
              path: 'profile',
              loadChildren: './profile/profile.modules#ProfileModule'
            },
            {
              path: 'alerts',
              loadChildren: './configure/configure.modules#Configure_Module'
          },
            {
                path: 'apps',
                loadChildren: './apps/apps.modules#AppsModule'
            },
            {
                path: 'ui-elements',
                loadChildren: './ui-elements/ui-elements.modules#UiElementsModule'
            },

            {
                path: 'tables',
                loadChildren: './tables/tables.modules#TablesModule'
            },
            {
                path: 'charts',
                loadChildren: './charts/charts.modules#Charts_Module'
            },
            {
                path: 'extras',
                loadChildren: './extras/extras.modules#ExtrasModule'
            }
        ]
    },
    {
        path: '',
        component: AuthenticationLayoutComponent,
        children: [
            {
                path: 'authentication',
                loadChildren: './extras/authentication.modules#AuthenticationModule'
            }
        ]
    },
    { path: '**', redirectTo: '' }
];

