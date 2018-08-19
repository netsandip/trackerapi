import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

//Maps Components
import { overviewComponent } from './overview/overview.component';
import { settingComponent } from './setting/setting.component';


export const ProfileRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'overview',
                component: overviewComponent,
                data: {
                    title: 'overview'
                }
            },
            {
                path: 'setting',
                component: settingComponent,
                data: {
                    title: 'setting'
                }
            }
           ]
    }
];

