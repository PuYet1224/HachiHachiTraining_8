import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { setData } from '@progress/kendo-angular-intl';

import likelySubtags from 'cldr-data/supplemental/likelySubtags.json';
import weekData from 'cldr-data/supplemental/weekData.json';
import numbers from 'cldr-data/main/vi/numbers.json';
import caGregorian from 'cldr-data/main/vi/ca-gregorian.json';
import timeZoneNames from 'cldr-data/main/vi/timeZoneNames.json';
import dateFields from 'cldr-data/main/vi/dateFields.json';

setData({
  supplemental: {
    likelySubtags: likelySubtags,
    weekData: weekData
  },
  main: {
    vi: {
      numbers: numbers.main.vi,
      caGregorian: caGregorian.main.vi,
      timeZoneNames: timeZoneNames.main.vi,
      dateFields: dateFields.main.vi
    }
  }
});

import { AppModule } from './app/app.module';
import { environment } from '../src/environments/environments';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
