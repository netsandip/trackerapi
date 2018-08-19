import { Component, OnInit } from '@angular/core';
import { Globals } from './../services/global';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './common-layout.component.html',
    styleUrls: ['common-layout.component.css'],
})

export class CommonLayoutComponent implements OnInit {
public username:any;
    public app : any;
    public headerThemes: any;
    public changeHeader: any;
    public sidenavThemes: any;
    public changeSidenav: any;
    public headerSelected: any;
    public sidenavSelected : any;
    public searchActived : any;
    public searchModel: any;

    constructor( private global: Globals, private router: Router) {

        this.app = {
            layout: {
                sidePanelOpen: false,
                isMenuOpened: true,
                isMenuCollapsed: false,
                themeConfigOpen: false,
                rtlActived: false,
                searchActived: false
            }
        };

        this.headerThemes = ['header-default', 'header-primary', 'header-info', 'header-success', 'header-danger', 'header-dark'];
        this.changeHeader = changeHeader;

        function changeHeader(headerTheme) {
            this.headerSelected = headerTheme;
        }

        this.sidenavThemes = ['sidenav-default', 'side-nav-dark'];
        this.changeSidenav = changeSidenav;

        function changeSidenav(sidenavTheme) {
            this.sidenavSelected = sidenavTheme;
        }
    }


    ngOnInit(){
       // this.username= localStorage.getItem('user')
        this.global.username = sessionStorage.getItem('userid');
    }
    logout(){

      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/'])
    }
}
