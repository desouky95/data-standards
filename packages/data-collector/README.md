# @desoukysvyc/data-collector

The @desoukysvyc/data-collector npm package is a comprehensive collection of data related to ISO standard codes. It provides a simple and efficient way to access information about countries, languages, currencies, and more, based on ISO standards.

[![npm version](https://badge.fury.io/js/%40desoukysvyc%2Fdata-collector.svg)](https://www.npmjs.com/package/@desoukysvyc/data-collector)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Installation

Install @desoukysvyc/data-collector with npm

```bash {"id":"01HFWTN7RGK6GKFRM4Y919NYAD"}
  npm install @desoukysvyc/data-collector
```

## Usage/Examples

### Querying Countries

The package provides a convenient query method for filtering countries based on various criteria. Example:

```typescript {"id":"01HFWTN7RGK6GKFRM4Y9N1HMRZ"}

import { countries } from "@desoukysvyc/data-collector";

const filteredCountries = countries.query({
  alpha2: "US",
  currencies: ["USD"],
  languages: ["eng"],
});

console.log(filteredCountries);

```

Output

```typescript {"id":"01HFWTN7RGK6GKFRM4YDM8J6SG"}
[
    {
        "name": "United States",
        "alpha2": "US",
        "alpha3": "USA",
        "callingCode": "+1",
        "capital": "Washington, D.C.",
        "currencies": [
            "USD",
            "USN"
        ],
        "internetTld": [
            ".us"
        ],
        "languages": [
            "eng"
        ],
        "numericCode": "840",
        "officialName": "The United States of America",
        "secondaryName": "United States of America"
    },
]
```

#### Find countries with a specific calling code

```typescript {"id":"01HFWTN7RGK6GKFRM4YDWQRCQR"}
const countriesWithCallingCode = countries.query({ callingCode: "+20" });

```

Output

```typescript {"id":"01HFWTN7RGK6GKFRM4YH61G2Y9"}
[
     {
        "name": "Egypt",
        "alpha2": "EG",
        "alpha3": "EGY",
        "callingCode": "+20",
        "capital": "Cairo",
        "currencies": [
            "EGP"
        ],
        "internetTld": [
            ".eg"
        ],
        "languages": [
            "ara"
        ],
        "numericCode": "818",
        "officialName": "The Arab Republic of Egypt",
        "secondaryName": "Egypt"
    },
]
```

#### Accessing Football Federations

~ *Including England,Scotland,etc.*

```typescript {"id":"01HFWTN7RGK6GKFRM4YJ0ERR2W"}
import { countriesFootballFederations } from "@desoukysvyc/data-collector";

console.log(countriesFootballFederations);
```

Output

```typescript {"id":"01HFWTN7RGK6GKFRM4YKAJWVWV"}

[
  {
    name: 'Albania',
    alpha2: 'AL',
    alpha3: 'ALB',
    internetTld: [ '.al' ],
    numericCode: '008',
    officialName: 'The Republic of Albania',
    country: 'Albania',
    code: 'ALB',
    federation: 'Albanian Football Association'
  },
  {
    name: 'Algeria',
    alpha2: 'DZ',
    alpha3: 'DZA',
    internetTld: [ '.dz' ],
    numericCode: '012',
    officialName: "The People's Democratic Republic of Algeria",
    country: 'Algeria',
    code: 'ALG',
    federation: 'Algerian Football Federation'
  },
  {
    country: 'England',
    code: 'ENG',
    federation: 'The Football Association'
  }
  ...169 more items
]
```

### Advanced Querying with Lodash

Utilize the power of lodash functions to perform advanced queries:

```typescript {"id":"01HFWTN7RGK6GKFRM4YPHE876D"}
import { countries } from "@desoukysvyc/data-collector";
import { filter, map, keyBy } from "lodash";

// Map countries to an object for quick lookup
const countriesMap = keyBy(countries, "alpha2");
const usaInfo = countriesMap["US"];

```

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License

## Support and Donation

### Support

If you encounter any issues or have questions about the `@desoukysvyc/data-collector` package, feel free to open an issue on the [GitHub repository](https://github.com/desouky95/country-data/issues). We welcome your feedback and contributions!

