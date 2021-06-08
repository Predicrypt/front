import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './shared/pages/login/login.component';
import { RegisterComponent } from './shared/pages/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { HeaderComponent } from './shared/components/header/header.component';
import { GraphComponent } from './shared/components/graph/graph.component';
import { OrdersComponent } from './shared/components/orders/orders.component';
import { OrderTabComponent } from './shared/components/order-tab/order-tab.component';
import { SymbolComponent } from './shared/pages/symbol/symbol.component';
import { MatSelectModule } from '@angular/material/select';
import { ActiveOrdersComponent } from './shared/components/active-orders/active-orders.component';
import { UserComponent } from './shared/pages/user/user.component';
import { BalanceListComponent } from './shared/components/balance-list/balance-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    GraphComponent,
    OrdersComponent,
    OrderTabComponent,
    SymbolComponent,
    ActiveOrdersComponent,
    UserComponent,
    BalanceListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
