# @desoukysvyc/languages

[![npm version](https://badge.fury.io/js/%40desoukysvyc%2Flanguages.svg)](https://www.npmjs.com/package/@desoukysvyc/languages)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A specialized sub-package for accessing language-related information, including language codes, details, and more.

## Installation

You can install this package using npm:

```bash
npm install @desoukysvyc/languages
```

## Usage

### Querying Currencies

The package provides a convenient query method for filtering languages based on various criteria. Examples:


#### Find details about the English language

```typescript
import { languages } from "@desoukysvyc/languages";

const englishDetails = languages.query({ name: "English" });

/* Output
    [ { name: 'English', alpha2: 'en', alpha3: 'eng' } ]
*/
```

#### Find languages with a specific alpha-3 code

```typescript
import { languages } from "@desoukysvyc/languages";

const alpha3Languages = languages.query({ alpha3: "spa" });

/* [ { name: 'Spanish', alpha2: 'es', alpha3: 'spa' } ] */
```

## Typescript Support

### Language

```typescript
type Language = {
  name: string;
  alpha2: LanguageAlpha2;
  alpha3: LanguageAlpha3;
};

type LanguageAlpha2 = "ab" | "aa" | "af" | "ak" | "sq" | "am" | "ar" | "an" | "hy" | "as" | "av" | "ae" | "ay" | "az" | "bm" | "ba" | "eu" | "be" | "bn" | "bi" | "bs" | "br" | "bg" | "my" | "ca" | "km" | "ch" | ... 156 more ... 

type LanguageAlpha3 = "abk" | "aar" | "afr" | "aka" | "sqi" | "amh" | "ara" | "arg" | "hye" | "asm" | "ava" | "ave" | "aym" | "aze" | "bam" | "bak" | "eus" | "bel" | "ben" | "bis" | "bos" | "bre" | "bul" | ... 160 more ...
```