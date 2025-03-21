import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { L10N_PREFIX, LocalizationService } from '@progress/kendo-angular-l10n';
import { IntlModule } from '@progress/kendo-angular-intl';
@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DateInputsModule,
    IntlModule 
  ],
  providers: [
    LocalizationService,
    { provide: L10N_PREFIX, useValue: 'kendo' }  
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}