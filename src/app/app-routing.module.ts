import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './shared/pages/home/home.component';
import { LoginComponent } from './shared/pages/login/login.component';
import { MarketComponent } from './shared/pages/market/market.component';
import { RegisterComponent } from './shared/pages/register/register.component';
import { SymbolComponent } from './shared/pages/symbol/symbol.component';
import { UserComponent } from './shared/pages/user/user.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'symbol', component: SymbolComponent },
  { path: 'user', component: UserComponent },
  { path: 'markets', component: MarketComponent},
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
