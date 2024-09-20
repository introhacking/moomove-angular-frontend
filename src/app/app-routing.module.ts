import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShipmentQuoteGenerationComponent } from './shipment-quote-generation/shipment-quote-generation.component';
import { ShipmentAggregateComponent } from './shipment-aggregate/shipment-aggregate.component';
import { QuotationPageComponent } from './quotation-page/quotation-page.component';
import { RateListComponent } from './rate-list/rate-list.component';
import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from './helpers/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { DashboardUiComponent } from './dashboard-ui/dashboard-ui.component';

// const routes: Routes = [
//   {path:'',redirectTo:'login', pathMatch:'full'},
//   {path:'login',component:LoginComponent,

//     // children:[{
//     //   path:'shipmentQuoteGeneration',component:ShipmentQuoteGenerationComponent,outlet:'shipmentQuoteGen'
//     // }]
//   },

//   {path:'home',component:HomePageComponent},
//   {path:'shipmentQuoteGeneration',component:ShipmentQuoteGenerationComponent,canActivate: [AuthGuard]},

//   {path:'shipmentAggregate',component:ShipmentAggregateComponent,canActivate: [AuthGuard]},
//   {path:'quotation_page',component:QuotationPageComponent,canActivate: [AuthGuard]},
//   {path:'rate_List',component:RateListComponent,canActivate: [AuthGuard]}
// ];


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',component: LayoutComponent,
    children: [
      { path: 'home', component: HomePageComponent },
      { path: 'dashboard', component: DashboardUiComponent, canActivate: [AuthGuard] },
      { path: 'shipmentQuoteGeneration', component: ShipmentQuoteGenerationComponent, canActivate: [AuthGuard] },
      { path: 'shipmentAggregate', component: ShipmentAggregateComponent, canActivate: [AuthGuard] },
      { path: 'quotation_page', component: QuotationPageComponent, canActivate: [AuthGuard] },
      { path: 'rate_List', component: RateListComponent, canActivate: [AuthGuard] }
    ],
  },
  // Additional routes (like a login page) can be added here outside of the layout
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule]
})
export class AppRoutingModule { }
