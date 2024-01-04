const wiki = "https://en.wikipedia.org/wiki/";
export const urls = {
    iso3166: wiki + "ISO_3166-1",
    iso3166Extended: wiki + "List_of_ISO_3166_country_codes",
    iso639_3: "https://iso639-3.sil.org/sites/iso639-3/files/downloads/iso-639-3.tab",
    iso639_2: "https://www.loc.gov/standards/iso639-2/ISO-639-2_utf-8.txt",
    iso31661Overview: wiki + "ISO_3166-1_alpha-2",
    iso31662: wiki + "ISO_3166-2:",
    iso31663: wiki + "ISO_3166-3",
    isoLanguagesByCountry: wiki + 'List_of_official_languages_by_country_and_territory',
    iso3166AltNames: wiki + "List_of_alternative_country_names",
    isoCurrencies: "https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list-one.xml",
    fifaCodes: wiki + "List_of_FIFA_country_codes",
    olympicCodes: wiki + "List_of_IOC_country_codes#Current_NOCs",
    fifaComparisonCountryCodes: wiki + "Comparison_of_alphabetic_country_codes",
    countriesCapitals: wiki +
        "List_of_countries_and_dependencies_and_their_capitals_in_native_languages",
    callingCodes: wiki + "List_of_country_calling_codes#Alphabetical_order",
};
export function clean(d) {
    return d
        .replace(/\[[^\]]+]/g, "")
        .replace(/\(i\.e\., [^\]]+\)/g, "")
        .replace(/†$/g, "")
        .replace(/\(local variant[^)]*\)/g, "")
        .replace(/\s+/g, ($0) => ($0.includes("\n") ? "\n" : " "))
        .trim();
}
export function cleanLanguage(d) {
    return d.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').replace(/Other|Several/gm, '')
        .trim();
}
export function booleanify(d) {
    return new RegExp(/yes|true/gm).test(d.toLocaleLowerCase());
}
