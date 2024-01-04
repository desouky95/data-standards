# @desoukysvyc/currencies

[![npm version](https://badge.fury.io/js/%40desoukysvyc%2Fcurrencies.svg)](https://www.npmjs.com/package/@desoukysvyc/currencies)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A specialized sub-package for accessing currency-related information, including currency codes, details, and more.

## Installation

You can install this package using npm:

```bash
npm install @desoukysvyc/currencies
```

## Usage

### Querying Currencies

The package provides a convenient query method for filtering currencies based on various criteria. Examples:

#### Find details about Currency By Code

```typescript
import { currencies } from "@desoukysvyc/currencies";

const euroDetails = currencies.query({ code: "EUR" });

/* Output
    [ 
        { code: 'EUR', decimal: 2, name: 'Euro', num: '978', symbol: '€' }
    ]
*/
```

#### Find currencies with a specific decimal value

```typescript
import { currencies } from "@desoukysvyc/currencies";

const decimalCurrencies = currencies.query({ decimal: 2 });

/* Output

[
  {
    code: 'AED',
    decimal: 2,
    name: 'United Arab Emirates dirham',
    num: '784',
    symbol: 'د.إ'
  },
  {
    code: 'AFN',
    decimal: 2,
    name: 'Afghan afghani',
    num: '971',
    symbol: '؋'
  },
  {
    code: 'ALL',
    decimal: 2,
    name: 'Albanian lek',
    num: '008',
    symbol: 'L'
  },
  {
    code: 'AMD',
    decimal: 2,
    name: 'Armenian dram',
    num: '051',
    symbol: '֏'
  }
  ... 136 more items
]
 */
```

#### Find currencies with a specific symbol

```typescript
import { currencies } from "@desoukysvyc/currencies";

const currencyWithSymbol = currencies.query({ symbol: "$" });

/* Output

[
  {
    code: 'ARS',
    decimal: 2,
    name: 'Argentine peso',
    num: '032',
    symbol: '$'
  },
  {
    code: 'AUD',
    decimal: 2,
    name: 'Australian dollar',
    num: '036',
    symbol: '$'
  },
  {
    code: 'BBD',
    decimal: 2,
    name: 'Barbados dollar',
    num: '052',
    symbol: '$'
  },
  {
    code: 'BMD',
    decimal: 2,
    name: 'Bermudian dollar',
    num: '060',
    symbol: '$'
  }
  ... 136 more items
]
 */
```

## Typescript Support

### Currency

```typescript
type Currency = {
  code: CurrencyCode;
  decimal?: number;
  name: string;
  num: CurrencyNum;
  symbol: string;
};

type CurrencyCode = "ALL" | "DZD" | "USD" | "EUR" | "AOA" | "XCD" | "ARS" | "AMD" | "AWG" | "AUD" | "AZN" | "BHD" | "GBP" | "BDT" | "BBD" | "BYN" | "BZD" | "XOF" | "BMD" | "BTN" | "INR" | "BOB" | "BOV" | ... 156 more ... | "XXX"

type CurrencyNum = "008" | "012" | "032" | "051" | "533" | "036" | "048" | "050" | "052" | "084" | "060" | "064" | "068" | "072" | "096" | "108" | "116" | "124" | "132" | "136" | "152" | "156" | "170" | ... 156 more ... | "932"
```
