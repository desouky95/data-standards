# @desoukysvyc/countries

[![npm version](https://badge.fury.io/js/%40desoukysvyc%2Fcountries.svg)](https://www.npmjs.com/package/@desoukysvyc/countries)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A specialized sub-package for accessing country-related information, including ISO codes, calling codes, and more.

## Installation

You can install this package using npm:

```bash
npm install @desoukysvyc/countries
```

## Usage

```typescript
import { countries, countriesFootballFederations } from '@desoukysvyc/countries'

// Example: Query countries based on specific criteria
const europeanCountries = countries.query({
  internetTld: ['eu'],
  currencies: ['EUR'],
  languages: ['eng', 'fre', 'ger'],
});

// Example: Access football federations associated with countries
console.log(countriesFootballFederations);

// Access individual country details
const usaDetails = countries.query({ alpha2: 'US' });
console.log(usaDetails);
```

## Typescript Support

### Country

```typescript
type Country = {
    alpha2: Alpha2;
    alpha3: Alpha3;
    internetTld: TLD[];
    numericCode: CountryNumericCode;
    // ... other properties
  };
```

### ExtendedCountry

```typescript
type ExtendedCountry = Country & {
    fifaCode: FifaCode;
    iocCode: OlympicCode;
    callingCode: string;
    currencies: Array<CurrencyCode>;
    capital: string;
    languages: Array<LanguageAlpha3>;
  };
  
```

### FifaWCountry

```typescript
type FifaWCountry = {
    name?: string;
    alpha2?: string;
    alpha3?: string;
    internetTld?: string[];
    numericCode?: string;
    officialName?: string;
    country: string;
    code: FifaCode;
    federation: string;
  };
```
