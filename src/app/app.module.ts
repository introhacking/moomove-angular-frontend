import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShipmentQuoteGenerationComponent } from './shipment-quote-generation/shipment-quote-generation.component';
import { ShipmentAggregateComponent } from './shipment-aggregate/shipment-aggregate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { QuotationPageComponent } from './quotation-page/quotation-page.component';

import { NavbaarComponent } from './NavbarLayout/navbaar/navbaar.component';
import { RateListComponent } from './rate-list/rate-list.component';
import { SearchFilterPipe } from './rate-list/Pipe/search-filter.pipe';
import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoggingInterceptor } from './helpers/logging.interceptor';
import { AuthGuard } from './helpers/auth.guard';
import { EditManualRateComponent } from './dialogModal/edit-manual-rate/edit-manual-rate.component';
import { LayoutComponent } from './layout/layout.component';
import { CloneManualRateComponent } from './dialogModal/clone-manual-rate/clone-manual-rate.component';
import { DashboardUiComponent } from './dashboard-ui/dashboard-ui.component';

@NgModule({
  declarations: [
    AppComponent,
    ShipmentQuoteGenerationComponent,
    ShipmentAggregateComponent,
    QuotationPageComponent,

    NavbaarComponent,
    RateListComponent,
    SearchFilterPipe,
    LoginComponent,
    HomePageComponent,
    EditManualRateComponent,
    LayoutComponent,
    CloneManualRateComponent,
    DashboardUiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    // MatDialogModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
