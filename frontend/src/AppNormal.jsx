import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import LatencyChart from "./LatencyChart";

// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS & DATA
// ═══════════════════════════════════════════════════════════════════════

const R = 5; // globe radius
const ARC_H = 1.0; // max arc height above surface
const ATMO = 5.3; // atmosphere radius

const ALL_NODES = [
  {
    id: "ORAAR",
    name: "Oranjestad",
    lat: 12.5,
    lon: -69.96666666,
    asn: "AS1000",
    region: "Americas",
    country: "Aruba",
  },
  {
    id: "KABAF",
    name: "Kabul",
    lat: 33,
    lon: 65,
    asn: "AS1001",
    region: "Asia",
    country: "Afghanistan",
  },
  {
    id: "LUAAN",
    name: "Luanda",
    lat: -12.5,
    lon: 18.5,
    asn: "AS1002",
    region: "Africa",
    country: "Angola",
  },
  {
    id: "THEAN",
    name: "The Valley",
    lat: 18.25,
    lon: -63.16666666,
    asn: "AS1003",
    region: "Americas",
    country: "Anguilla",
  },
  {
    id: "MARÅL",
    name: "Mariehamn",
    lat: 60.116667,
    lon: 19.9,
    asn: "AS1004",
    region: "Europe",
    country: "Åland Islands",
  },
  {
    id: "TIRAL",
    name: "Tirana",
    lat: 41,
    lon: 20,
    asn: "AS1005",
    region: "Europe",
    country: "Albania",
  },
  {
    id: "ANDAN",
    name: "Andorra la Vella",
    lat: 42.5,
    lon: 1.5,
    asn: "AS1006",
    region: "Europe",
    country: "Andorra",
  },
  {
    id: "ABUUN",
    name: "Abu Dhabi",
    lat: 24,
    lon: 54,
    asn: "AS1007",
    region: "Asia",
    country: "United Arab Emirates",
  },
  {
    id: "BUEAR",
    name: "Buenos Aires",
    lat: -34,
    lon: -64,
    asn: "AS1008",
    region: "Americas",
    country: "Argentina",
  },
  {
    id: "YERAR",
    name: "Yerevan",
    lat: 40,
    lon: 45,
    asn: "AS1009",
    region: "Asia",
    country: "Armenia",
  },
  {
    id: "PAGAM",
    name: "Pago Pago",
    lat: -14.33333333,
    lon: -170,
    asn: "AS1010",
    region: "Oceania",
    country: "American Samoa",
  },
  {
    id: "UNKAN",
    name: "Unknown",
    lat: -90,
    lon: 0,
    asn: "AS1011",
    region: "Antarctic",
    country: "Antarctica",
  },
  {
    id: "PORFR",
    name: "Port-aux-Français",
    lat: -49.25,
    lon: 69.167,
    asn: "AS1012",
    region: "Antarctic",
    country: "French Southern and Antarctic Lands",
  },
  {
    id: "SAIAN",
    name: "Saint John's",
    lat: 17.05,
    lon: -61.8,
    asn: "AS1013",
    region: "Americas",
    country: "Antigua and Barbuda",
  },
  {
    id: "CANAU",
    name: "Canberra",
    lat: -27,
    lon: 133,
    asn: "AS1014",
    region: "Oceania",
    country: "Australia",
  },
  {
    id: "VIEAU",
    name: "Vienna",
    lat: 47.33333333,
    lon: 13.33333333,
    asn: "AS1015",
    region: "Europe",
    country: "Austria",
  },
  {
    id: "BAKAZ",
    name: "Baku",
    lat: 40.5,
    lon: 47.5,
    asn: "AS1016",
    region: "Asia",
    country: "Azerbaijan",
  },
  {
    id: "GITBU",
    name: "Gitega",
    lat: -3.5,
    lon: 30,
    asn: "AS1017",
    region: "Africa",
    country: "Burundi",
  },
  {
    id: "BRUBE",
    name: "Brussels",
    lat: 50.83333333,
    lon: 4,
    asn: "AS1018",
    region: "Europe",
    country: "Belgium",
  },
  {
    id: "PORBE",
    name: "Porto-Novo",
    lat: 9.5,
    lon: 2.25,
    asn: "AS1019",
    region: "Africa",
    country: "Benin",
  },
  {
    id: "OUABU",
    name: "Ouagadougou",
    lat: 13,
    lon: -2,
    asn: "AS1020",
    region: "Africa",
    country: "Burkina Faso",
  },
  {
    id: "DHABA",
    name: "Dhaka",
    lat: 24,
    lon: 90,
    asn: "AS1021",
    region: "Asia",
    country: "Bangladesh",
  },
  {
    id: "SOFBU",
    name: "Sofia",
    lat: 43,
    lon: 25,
    asn: "AS1022",
    region: "Europe",
    country: "Bulgaria",
  },
  {
    id: "MANBA",
    name: "Manama",
    lat: 26,
    lon: 50.55,
    asn: "AS1023",
    region: "Asia",
    country: "Bahrain",
  },
  {
    id: "NASBA",
    name: "Nassau",
    lat: 24.25,
    lon: -76,
    asn: "AS1024",
    region: "Americas",
    country: "Bahamas",
  },
  {
    id: "SARBO",
    name: "Sarajevo",
    lat: 44,
    lon: 18,
    asn: "AS1025",
    region: "Europe",
    country: "Bosnia and Herzegovina",
  },
  {
    id: "GUSSA",
    name: "Gustavia",
    lat: 18.5,
    lon: -63.41666666,
    asn: "AS1026",
    region: "Americas",
    country: "Saint Barthélemy",
  },
  {
    id: "JAMSA",
    name: "Jamestown",
    lat: -15.95,
    lon: -5.72,
    asn: "AS1027",
    region: "Africa",
    country: "Saint Helena, Ascension and Tristan da Cunha",
  },
  {
    id: "MINBE",
    name: "Minsk",
    lat: 53,
    lon: 28,
    asn: "AS1028",
    region: "Europe",
    country: "Belarus",
  },
  {
    id: "BELBE",
    name: "Belmopan",
    lat: 17.25,
    lon: -88.75,
    asn: "AS1029",
    region: "Americas",
    country: "Belize",
  },
  {
    id: "HAMBE",
    name: "Hamilton",
    lat: 32.33333333,
    lon: -64.75,
    asn: "AS1030",
    region: "Americas",
    country: "Bermuda",
  },
  {
    id: "SUCBO",
    name: "Sucre",
    lat: -17,
    lon: -65,
    asn: "AS1031",
    region: "Americas",
    country: "Bolivia",
  },
  {
    id: "KRACA",
    name: "Kralendijk",
    lat: 12.18,
    lon: -68.25,
    asn: "AS1032",
    region: "Americas",
    country: "Caribbean Netherlands",
  },
  {
    id: "BRABR",
    name: "Brasília",
    lat: -10,
    lon: -55,
    asn: "AS1033",
    region: "Americas",
    country: "Brazil",
  },
  {
    id: "BRIBA",
    name: "Bridgetown",
    lat: 13.16666666,
    lon: -59.53333333,
    asn: "AS1034",
    region: "Americas",
    country: "Barbados",
  },
  {
    id: "BANBR",
    name: "Bandar Seri Begawan",
    lat: 4.5,
    lon: 114.66666666,
    asn: "AS1035",
    region: "Asia",
    country: "Brunei",
  },
  {
    id: "THIBH",
    name: "Thimphu",
    lat: 27.5,
    lon: 90.5,
    asn: "AS1036",
    region: "Asia",
    country: "Bhutan",
  },
  {
    id: "UNKBO",
    name: "Unknown",
    lat: -54.43333333,
    lon: 3.4,
    asn: "AS1037",
    region: "Antarctic",
    country: "Bouvet Island",
  },
  {
    id: "GABBO",
    name: "Gaborone",
    lat: -22,
    lon: 24,
    asn: "AS1038",
    region: "Africa",
    country: "Botswana",
  },
  {
    id: "BANCE",
    name: "Bangui",
    lat: 7,
    lon: 21,
    asn: "AS1039",
    region: "Africa",
    country: "Central African Republic",
  },
  {
    id: "OTTCA",
    name: "Ottawa",
    lat: 60,
    lon: -95,
    asn: "AS1040",
    region: "Americas",
    country: "Canada",
  },
  {
    id: "WESCO",
    name: "West Island",
    lat: -12.5,
    lon: 96.83333333,
    asn: "AS1041",
    region: "Oceania",
    country: "Cocos (Keeling) Islands",
  },
  {
    id: "BERSW",
    name: "Bern",
    lat: 47,
    lon: 8,
    asn: "AS1042",
    region: "Europe",
    country: "Switzerland",
  },
  {
    id: "SANCH",
    name: "Santiago",
    lat: -30,
    lon: -71,
    asn: "AS1043",
    region: "Americas",
    country: "Chile",
  },
  {
    id: "BEICH",
    name: "Beijing",
    lat: 35,
    lon: 105,
    asn: "AS1044",
    region: "Asia",
    country: "China",
  },
  {
    id: "YAMIV",
    name: "Yamoussoukro",
    lat: 8,
    lon: -5,
    asn: "AS1045",
    region: "Africa",
    country: "Ivory Coast",
  },
  {
    id: "YAOCA",
    name: "Yaoundé",
    lat: 6,
    lon: 12,
    asn: "AS1046",
    region: "Africa",
    country: "Cameroon",
  },
  {
    id: "KINDR",
    name: "Kinshasa",
    lat: 0,
    lon: 25,
    asn: "AS1047",
    region: "Africa",
    country: "DR Congo",
  },
  {
    id: "BRACO",
    name: "Brazzaville",
    lat: -1,
    lon: 15,
    asn: "AS1048",
    region: "Africa",
    country: "Congo",
  },
  {
    id: "AVACO",
    name: "Avarua",
    lat: -21.23333333,
    lon: -159.76666666,
    asn: "AS1049",
    region: "Oceania",
    country: "Cook Islands",
  },
  {
    id: "BOGCO",
    name: "Bogotá",
    lat: 4,
    lon: -72,
    asn: "AS1050",
    region: "Americas",
    country: "Colombia",
  },
  {
    id: "MORCO",
    name: "Moroni",
    lat: -12.16666666,
    lon: 44.25,
    asn: "AS1051",
    region: "Africa",
    country: "Comoros",
  },
  {
    id: "PRACA",
    name: "Praia",
    lat: 16,
    lon: -24,
    asn: "AS1052",
    region: "Africa",
    country: "Cape Verde",
  },
  {
    id: "SANCO",
    name: "San José",
    lat: 10,
    lon: -84,
    asn: "AS1053",
    region: "Americas",
    country: "Costa Rica",
  },
  {
    id: "HAVCU",
    name: "Havana",
    lat: 21.5,
    lon: -80,
    asn: "AS1054",
    region: "Americas",
    country: "Cuba",
  },
  {
    id: "WILCU",
    name: "Willemstad",
    lat: 12.116667,
    lon: -68.933333,
    asn: "AS1055",
    region: "Americas",
    country: "Curaçao",
  },
  {
    id: "FLYCH",
    name: "Flying Fish Cove",
    lat: -10.5,
    lon: 105.66666666,
    asn: "AS1056",
    region: "Oceania",
    country: "Christmas Island",
  },
  {
    id: "GEOCA",
    name: "George Town",
    lat: 19.5,
    lon: -80.5,
    asn: "AS1057",
    region: "Americas",
    country: "Cayman Islands",
  },
  {
    id: "NICCY",
    name: "Nicosia",
    lat: 35,
    lon: 33,
    asn: "AS1058",
    region: "Europe",
    country: "Cyprus",
  },
  {
    id: "PRACZ",
    name: "Prague",
    lat: 49.75,
    lon: 15.5,
    asn: "AS1059",
    region: "Europe",
    country: "Czechia",
  },
  {
    id: "BERGE",
    name: "Berlin",
    lat: 51,
    lon: 9,
    asn: "AS1060",
    region: "Europe",
    country: "Germany",
  },
  {
    id: "DJIDJ",
    name: "Djibouti",
    lat: 11.5,
    lon: 43,
    asn: "AS1061",
    region: "Africa",
    country: "Djibouti",
  },
  {
    id: "ROSDO",
    name: "Roseau",
    lat: 15.41666666,
    lon: -61.33333333,
    asn: "AS1062",
    region: "Americas",
    country: "Dominica",
  },
  {
    id: "COPDE",
    name: "Copenhagen",
    lat: 56,
    lon: 10,
    asn: "AS1063",
    region: "Europe",
    country: "Denmark",
  },
  {
    id: "SANDO",
    name: "Santo Domingo",
    lat: 19,
    lon: -70.66666666,
    asn: "AS1064",
    region: "Americas",
    country: "Dominican Republic",
  },
  {
    id: "ALGAL",
    name: "Algiers",
    lat: 28,
    lon: 3,
    asn: "AS1065",
    region: "Africa",
    country: "Algeria",
  },
  {
    id: "QUIEC",
    name: "Quito",
    lat: -2,
    lon: -77.5,
    asn: "AS1066",
    region: "Americas",
    country: "Ecuador",
  },
  {
    id: "CAIEG",
    name: "Cairo",
    lat: 27,
    lon: 30,
    asn: "AS1067",
    region: "Africa",
    country: "Egypt",
  },
  {
    id: "ASMER",
    name: "Asmara",
    lat: 15,
    lon: 39,
    asn: "AS1068",
    region: "Africa",
    country: "Eritrea",
  },
  {
    id: "ELWE",
    name: "El Aaiún",
    lat: 24.5,
    lon: -13,
    asn: "AS1069",
    region: "Africa",
    country: "Western Sahara",
  },
  {
    id: "MADSP",
    name: "Madrid",
    lat: 40,
    lon: -4,
    asn: "AS1070",
    region: "Europe",
    country: "Spain",
  },
  {
    id: "TALES",
    name: "Tallinn",
    lat: 59,
    lon: 26,
    asn: "AS1071",
    region: "Europe",
    country: "Estonia",
  },
  {
    id: "ADDET",
    name: "Addis Ababa",
    lat: 8,
    lon: 38,
    asn: "AS1072",
    region: "Africa",
    country: "Ethiopia",
  },
  {
    id: "HELFI",
    name: "Helsinki",
    lat: 64,
    lon: 26,
    asn: "AS1073",
    region: "Europe",
    country: "Finland",
  },
  {
    id: "SUVFI",
    name: "Suva",
    lat: -18,
    lon: 175,
    asn: "AS1074",
    region: "Oceania",
    country: "Fiji",
  },
  {
    id: "STAFA",
    name: "Stanley",
    lat: -51.75,
    lon: -59,
    asn: "AS1075",
    region: "Americas",
    country: "Falkland Islands",
  },
  {
    id: "PARFR",
    name: "Paris",
    lat: 46,
    lon: 2,
    asn: "AS1076",
    region: "Europe",
    country: "France",
  },
  {
    id: "TÓRFA",
    name: "Tórshavn",
    lat: 62,
    lon: -7,
    asn: "AS1077",
    region: "Europe",
    country: "Faroe Islands",
  },
  {
    id: "PALMI",
    name: "Palikir",
    lat: 6.91666666,
    lon: 158.25,
    asn: "AS1078",
    region: "Oceania",
    country: "Micronesia",
  },
  {
    id: "LIBGA",
    name: "Libreville",
    lat: -1,
    lon: 11.75,
    asn: "AS1079",
    region: "Africa",
    country: "Gabon",
  },
  {
    id: "LONUN",
    name: "London",
    lat: 54,
    lon: -2,
    asn: "AS1080",
    region: "Europe",
    country: "United Kingdom",
  },
  {
    id: "TBIGE",
    name: "Tbilisi",
    lat: 42,
    lon: 43.5,
    asn: "AS1081",
    region: "Asia",
    country: "Georgia",
  },
  {
    id: "ST.GU",
    name: "St. Peter Port",
    lat: 49.46666666,
    lon: -2.58333333,
    asn: "AS1082",
    region: "Europe",
    country: "Guernsey",
  },
  {
    id: "ACCGH",
    name: "Accra",
    lat: 8,
    lon: -2,
    asn: "AS1083",
    region: "Africa",
    country: "Ghana",
  },
  {
    id: "GIBGI",
    name: "Gibraltar",
    lat: 36.13333333,
    lon: -5.35,
    asn: "AS1084",
    region: "Europe",
    country: "Gibraltar",
  },
  {
    id: "CONGU",
    name: "Conakry",
    lat: 11,
    lon: -10,
    asn: "AS1085",
    region: "Africa",
    country: "Guinea",
  },
  {
    id: "BASGU",
    name: "Basse-Terre",
    lat: 16.25,
    lon: -61.583333,
    asn: "AS1086",
    region: "Americas",
    country: "Guadeloupe",
  },
  {
    id: "BANGA",
    name: "Banjul",
    lat: 13.46666666,
    lon: -16.56666666,
    asn: "AS1087",
    region: "Africa",
    country: "Gambia",
  },
  {
    id: "BISGU",
    name: "Bissau",
    lat: 12,
    lon: -15,
    asn: "AS1088",
    region: "Africa",
    country: "Guinea-Bissau",
  },
  {
    id: "MALEQ",
    name: "Malabo",
    lat: 2,
    lon: 10,
    asn: "AS1089",
    region: "Africa",
    country: "Equatorial Guinea",
  },
  {
    id: "ATHGR",
    name: "Athens",
    lat: 39,
    lon: 22,
    asn: "AS1090",
    region: "Europe",
    country: "Greece",
  },
  {
    id: "ST.GR",
    name: "St. George's",
    lat: 12.11666666,
    lon: -61.66666666,
    asn: "AS1091",
    region: "Americas",
    country: "Grenada",
  },
  {
    id: "NUUGR",
    name: "Nuuk",
    lat: 72,
    lon: -40,
    asn: "AS1092",
    region: "Americas",
    country: "Greenland",
  },
  {
    id: "GUAGU",
    name: "Guatemala City",
    lat: 15.5,
    lon: -90.25,
    asn: "AS1093",
    region: "Americas",
    country: "Guatemala",
  },
  {
    id: "CAYFR",
    name: "Cayenne",
    lat: 4,
    lon: -53,
    asn: "AS1094",
    region: "Americas",
    country: "French Guiana",
  },
  {
    id: "HAGGU",
    name: "Hagåtña",
    lat: 13.46666666,
    lon: 144.78333333,
    asn: "AS1095",
    region: "Oceania",
    country: "Guam",
  },
  {
    id: "GEOGU",
    name: "Georgetown",
    lat: 5,
    lon: -59,
    asn: "AS1096",
    region: "Americas",
    country: "Guyana",
  },
  {
    id: "CITHO",
    name: "City of Victoria",
    lat: 22.267,
    lon: 114.188,
    asn: "AS1097",
    region: "Asia",
    country: "Hong Kong",
  },
  {
    id: "UNKHE",
    name: "Unknown",
    lat: -53.1,
    lon: 72.51666666,
    asn: "AS1098",
    region: "Antarctic",
    country: "Heard Island and McDonald Islands",
  },
  {
    id: "TEGHO",
    name: "Tegucigalpa",
    lat: 15,
    lon: -86.5,
    asn: "AS1099",
    region: "Americas",
    country: "Honduras",
  },
  {
    id: "ZAGCR",
    name: "Zagreb",
    lat: 45.16666666,
    lon: 15.5,
    asn: "AS1100",
    region: "Europe",
    country: "Croatia",
  },
  {
    id: "PORHA",
    name: "Port-au-Prince",
    lat: 19,
    lon: -72.41666666,
    asn: "AS1101",
    region: "Americas",
    country: "Haiti",
  },
  {
    id: "BUDHU",
    name: "Budapest",
    lat: 47,
    lon: 20,
    asn: "AS1102",
    region: "Europe",
    country: "Hungary",
  },
  {
    id: "JAKIN",
    name: "Jakarta",
    lat: -5,
    lon: 120,
    asn: "AS1103",
    region: "Asia",
    country: "Indonesia",
  },
  {
    id: "DOUIS",
    name: "Douglas",
    lat: 54.25,
    lon: -4.5,
    asn: "AS1104",
    region: "Europe",
    country: "Isle of Man",
  },
  {
    id: "NEWIN",
    name: "New Delhi",
    lat: 20,
    lon: 77,
    asn: "AS1105",
    region: "Asia",
    country: "India",
  },
  {
    id: "DIEBR",
    name: "Diego Garcia",
    lat: -6,
    lon: 71.5,
    asn: "AS1106",
    region: "Africa",
    country: "British Indian Ocean Territory",
  },
  {
    id: "DUBIR",
    name: "Dublin",
    lat: 53,
    lon: -8,
    asn: "AS1107",
    region: "Europe",
    country: "Ireland",
  },
  {
    id: "TEHIR",
    name: "Tehran",
    lat: 32,
    lon: 53,
    asn: "AS1108",
    region: "Asia",
    country: "Iran",
  },
  {
    id: "BAGIR",
    name: "Baghdad",
    lat: 33,
    lon: 44,
    asn: "AS1109",
    region: "Asia",
    country: "Iraq",
  },
  {
    id: "REYIC",
    name: "Reykjavik",
    lat: 65,
    lon: -18,
    asn: "AS1110",
    region: "Europe",
    country: "Iceland",
  },
  {
    id: "JERIS",
    name: "Jerusalem",
    lat: 31.47,
    lon: 35.13,
    asn: "AS1111",
    region: "Asia",
    country: "Israel",
  },
  {
    id: "ROMIT",
    name: "Rome",
    lat: 42.83333333,
    lon: 12.83333333,
    asn: "AS1112",
    region: "Europe",
    country: "Italy",
  },
  {
    id: "KINJA",
    name: "Kingston",
    lat: 18.25,
    lon: -77.5,
    asn: "AS1113",
    region: "Americas",
    country: "Jamaica",
  },
  {
    id: "SAIJE",
    name: "Saint Helier",
    lat: 49.25,
    lon: -2.16666666,
    asn: "AS1114",
    region: "Europe",
    country: "Jersey",
  },
  {
    id: "AMMJO",
    name: "Amman",
    lat: 31,
    lon: 36,
    asn: "AS1115",
    region: "Asia",
    country: "Jordan",
  },
  {
    id: "TOKJA",
    name: "Tokyo",
    lat: 36,
    lon: 138,
    asn: "AS1116",
    region: "Asia",
    country: "Japan",
  },
  {
    id: "ASTKA",
    name: "Astana",
    lat: 48,
    lon: 68,
    asn: "AS1117",
    region: "Asia",
    country: "Kazakhstan",
  },
  {
    id: "NAIKE",
    name: "Nairobi",
    lat: 1,
    lon: 38,
    asn: "AS1118",
    region: "Africa",
    country: "Kenya",
  },
  {
    id: "BISKY",
    name: "Bishkek",
    lat: 41,
    lon: 75,
    asn: "AS1119",
    region: "Asia",
    country: "Kyrgyzstan",
  },
  {
    id: "PHNCA",
    name: "Phnom Penh",
    lat: 13,
    lon: 105,
    asn: "AS1120",
    region: "Asia",
    country: "Cambodia",
  },
  {
    id: "SOUKI",
    name: "South Tarawa",
    lat: 1.41666666,
    lon: 173,
    asn: "AS1121",
    region: "Oceania",
    country: "Kiribati",
  },
  {
    id: "BASSA",
    name: "Basseterre",
    lat: 17.33333333,
    lon: -62.75,
    asn: "AS1122",
    region: "Americas",
    country: "Saint Kitts and Nevis",
  },
  {
    id: "SEOSO",
    name: "Seoul",
    lat: 37,
    lon: 127.5,
    asn: "AS1123",
    region: "Asia",
    country: "South Korea",
  },
  {
    id: "PRIKO",
    name: "Pristina",
    lat: 42.666667,
    lon: 21.166667,
    asn: "AS1124",
    region: "Europe",
    country: "Kosovo",
  },
  {
    id: "KUWKU",
    name: "Kuwait City",
    lat: 29.5,
    lon: 45.75,
    asn: "AS1125",
    region: "Asia",
    country: "Kuwait",
  },
  {
    id: "VIELA",
    name: "Vientiane",
    lat: 18,
    lon: 105,
    asn: "AS1126",
    region: "Asia",
    country: "Laos",
  },
  {
    id: "BEILE",
    name: "Beirut",
    lat: 33.83333333,
    lon: 35.83333333,
    asn: "AS1127",
    region: "Asia",
    country: "Lebanon",
  },
  {
    id: "MONLI",
    name: "Monrovia",
    lat: 6.5,
    lon: -9.5,
    asn: "AS1128",
    region: "Africa",
    country: "Liberia",
  },
  {
    id: "TRILI",
    name: "Tripoli",
    lat: 25,
    lon: 17,
    asn: "AS1129",
    region: "Africa",
    country: "Libya",
  },
  {
    id: "CASSA",
    name: "Castries",
    lat: 13.88333333,
    lon: -60.96666666,
    asn: "AS1130",
    region: "Americas",
    country: "Saint Lucia",
  },
  {
    id: "VADLI",
    name: "Vaduz",
    lat: 47.26666666,
    lon: 9.53333333,
    asn: "AS1131",
    region: "Europe",
    country: "Liechtenstein",
  },
  {
    id: "COLSR",
    name: "Colombo",
    lat: 7,
    lon: 81,
    asn: "AS1132",
    region: "Asia",
    country: "Sri Lanka",
  },
  {
    id: "MASLE",
    name: "Maseru",
    lat: -29.5,
    lon: 28.5,
    asn: "AS1133",
    region: "Africa",
    country: "Lesotho",
  },
  {
    id: "VILLI",
    name: "Vilnius",
    lat: 56,
    lon: 24,
    asn: "AS1134",
    region: "Europe",
    country: "Lithuania",
  },
  {
    id: "LUXLU",
    name: "Luxembourg",
    lat: 49.75,
    lon: 6.16666666,
    asn: "AS1135",
    region: "Europe",
    country: "Luxembourg",
  },
  {
    id: "RIGLA",
    name: "Riga",
    lat: 57,
    lon: 25,
    asn: "AS1136",
    region: "Europe",
    country: "Latvia",
  },
  {
    id: "UNKMA",
    name: "Unknown",
    lat: 22.16666666,
    lon: 113.55,
    asn: "AS1137",
    region: "Asia",
    country: "Macau",
  },
  {
    id: "MARSA",
    name: "Marigot",
    lat: 18.08333333,
    lon: -63.95,
    asn: "AS1138",
    region: "Americas",
    country: "Saint Martin",
  },
  {
    id: "RABMO",
    name: "Rabat",
    lat: 32,
    lon: -5,
    asn: "AS1139",
    region: "Africa",
    country: "Morocco",
  },
  {
    id: "MONMO",
    name: "Monaco",
    lat: 43.73333333,
    lon: 7.4,
    asn: "AS1140",
    region: "Europe",
    country: "Monaco",
  },
  {
    id: "CHIMO",
    name: "Chișinău",
    lat: 47,
    lon: 29,
    asn: "AS1141",
    region: "Europe",
    country: "Moldova",
  },
  {
    id: "ANTMA",
    name: "Antananarivo",
    lat: -20,
    lon: 47,
    asn: "AS1142",
    region: "Africa",
    country: "Madagascar",
  },
  {
    id: "MALMA",
    name: "Malé",
    lat: 3.25,
    lon: 73,
    asn: "AS1143",
    region: "Asia",
    country: "Maldives",
  },
  {
    id: "MEXME",
    name: "Mexico City",
    lat: 23,
    lon: -102,
    asn: "AS1144",
    region: "Americas",
    country: "Mexico",
  },
  {
    id: "MAJMA",
    name: "Majuro",
    lat: 9,
    lon: 168,
    asn: "AS1145",
    region: "Oceania",
    country: "Marshall Islands",
  },
  {
    id: "SKONO",
    name: "Skopje",
    lat: 41.83333333,
    lon: 22,
    asn: "AS1146",
    region: "Europe",
    country: "North Macedonia",
  },
  {
    id: "BAMMA",
    name: "Bamako",
    lat: 17,
    lon: -4,
    asn: "AS1147",
    region: "Africa",
    country: "Mali",
  },
  {
    id: "VALMA",
    name: "Valletta",
    lat: 35.83333333,
    lon: 14.58333333,
    asn: "AS1148",
    region: "Europe",
    country: "Malta",
  },
  {
    id: "NAYMY",
    name: "Naypyidaw",
    lat: 22,
    lon: 98,
    asn: "AS1149",
    region: "Asia",
    country: "Myanmar",
  },
  {
    id: "PODMO",
    name: "Podgorica",
    lat: 42.5,
    lon: 19.3,
    asn: "AS1150",
    region: "Europe",
    country: "Montenegro",
  },
  {
    id: "ULAMO",
    name: "Ulan Bator",
    lat: 46,
    lon: 105,
    asn: "AS1151",
    region: "Asia",
    country: "Mongolia",
  },
  {
    id: "SAINO",
    name: "Saipan",
    lat: 15.2,
    lon: 145.75,
    asn: "AS1152",
    region: "Oceania",
    country: "Northern Mariana Islands",
  },
  {
    id: "MAPMO",
    name: "Maputo",
    lat: -18.25,
    lon: 35,
    asn: "AS1153",
    region: "Africa",
    country: "Mozambique",
  },
  {
    id: "NOUMA",
    name: "Nouakchott",
    lat: 20,
    lon: -12,
    asn: "AS1154",
    region: "Africa",
    country: "Mauritania",
  },
  {
    id: "PLYMO",
    name: "Plymouth",
    lat: 16.75,
    lon: -62.2,
    asn: "AS1155",
    region: "Americas",
    country: "Montserrat",
  },
  {
    id: "FORMA",
    name: "Fort-de-France",
    lat: 14.666667,
    lon: -61,
    asn: "AS1156",
    region: "Americas",
    country: "Martinique",
  },
  {
    id: "PORMA",
    name: "Port Louis",
    lat: -20.28333333,
    lon: 57.55,
    asn: "AS1157",
    region: "Africa",
    country: "Mauritius",
  },
  {
    id: "LILMA",
    name: "Lilongwe",
    lat: -13.5,
    lon: 34,
    asn: "AS1158",
    region: "Africa",
    country: "Malawi",
  },
  {
    id: "KUAMA",
    name: "Kuala Lumpur",
    lat: 2.5,
    lon: 112.5,
    asn: "AS1159",
    region: "Asia",
    country: "Malaysia",
  },
  {
    id: "MAMMA",
    name: "Mamoudzou",
    lat: -12.83333333,
    lon: 45.16666666,
    asn: "AS1160",
    region: "Africa",
    country: "Mayotte",
  },
  {
    id: "WINNA",
    name: "Windhoek",
    lat: -22,
    lon: 17,
    asn: "AS1161",
    region: "Africa",
    country: "Namibia",
  },
  {
    id: "NOUNE",
    name: "Nouméa",
    lat: -21.5,
    lon: 165.5,
    asn: "AS1162",
    region: "Oceania",
    country: "New Caledonia",
  },
  {
    id: "NIANI",
    name: "Niamey",
    lat: 16,
    lon: 8,
    asn: "AS1163",
    region: "Africa",
    country: "Niger",
  },
  {
    id: "KINNO",
    name: "Kingston",
    lat: -29.03333333,
    lon: 167.95,
    asn: "AS1164",
    region: "Oceania",
    country: "Norfolk Island",
  },
  {
    id: "ABUNI",
    name: "Abuja",
    lat: 10,
    lon: 8,
    asn: "AS1165",
    region: "Africa",
    country: "Nigeria",
  },
  {
    id: "MANNI",
    name: "Managua",
    lat: 13,
    lon: -85,
    asn: "AS1166",
    region: "Americas",
    country: "Nicaragua",
  },
  {
    id: "ALONI",
    name: "Alofi",
    lat: -19.03333333,
    lon: -169.86666666,
    asn: "AS1167",
    region: "Oceania",
    country: "Niue",
  },
  {
    id: "AMSNE",
    name: "Amsterdam",
    lat: 52.5,
    lon: 5.75,
    asn: "AS1168",
    region: "Europe",
    country: "Netherlands",
  },
  {
    id: "OSLNO",
    name: "Oslo",
    lat: 62,
    lon: 10,
    asn: "AS1169",
    region: "Europe",
    country: "Norway",
  },
  {
    id: "KATNE",
    name: "Kathmandu",
    lat: 28,
    lon: 84,
    asn: "AS1170",
    region: "Asia",
    country: "Nepal",
  },
  {
    id: "YARNA",
    name: "Yaren",
    lat: -0.53333333,
    lon: 166.91666666,
    asn: "AS1171",
    region: "Oceania",
    country: "Nauru",
  },
  {
    id: "WELNE",
    name: "Wellington",
    lat: -41,
    lon: 174,
    asn: "AS1172",
    region: "Oceania",
    country: "New Zealand",
  },
  {
    id: "MUSOM",
    name: "Muscat",
    lat: 21,
    lon: 57,
    asn: "AS1173",
    region: "Asia",
    country: "Oman",
  },
  {
    id: "ISLPA",
    name: "Islamabad",
    lat: 30,
    lon: 70,
    asn: "AS1174",
    region: "Asia",
    country: "Pakistan",
  },
  {
    id: "PANPA",
    name: "Panama City",
    lat: 9,
    lon: -80,
    asn: "AS1175",
    region: "Americas",
    country: "Panama",
  },
  {
    id: "ADAPI",
    name: "Adamstown",
    lat: -25.06666666,
    lon: -130.1,
    asn: "AS1176",
    region: "Oceania",
    country: "Pitcairn Islands",
  },
  {
    id: "LIMPE",
    name: "Lima",
    lat: -10,
    lon: -76,
    asn: "AS1177",
    region: "Americas",
    country: "Peru",
  },
  {
    id: "MANPH",
    name: "Manila",
    lat: 13,
    lon: 122,
    asn: "AS1178",
    region: "Asia",
    country: "Philippines",
  },
  {
    id: "NGEPA",
    name: "Ngerulmud",
    lat: 7.5,
    lon: 134.5,
    asn: "AS1179",
    region: "Oceania",
    country: "Palau",
  },
  {
    id: "PORPA",
    name: "Port Moresby",
    lat: -6,
    lon: 147,
    asn: "AS1180",
    region: "Oceania",
    country: "Papua New Guinea",
  },
  {
    id: "WARPO",
    name: "Warsaw",
    lat: 52,
    lon: 20,
    asn: "AS1181",
    region: "Europe",
    country: "Poland",
  },
  {
    id: "SANPU",
    name: "San Juan",
    lat: 18.25,
    lon: -66.5,
    asn: "AS1182",
    region: "Americas",
    country: "Puerto Rico",
  },
  {
    id: "PYONO",
    name: "Pyongyang",
    lat: 40,
    lon: 127,
    asn: "AS1183",
    region: "Asia",
    country: "North Korea",
  },
  {
    id: "LISPO",
    name: "Lisbon",
    lat: 39.5,
    lon: -8,
    asn: "AS1184",
    region: "Europe",
    country: "Portugal",
  },
  {
    id: "ASUPA",
    name: "Asunción",
    lat: -23,
    lon: -58,
    asn: "AS1185",
    region: "Americas",
    country: "Paraguay",
  },
  {
    id: "RAMPA",
    name: "Ramallah",
    lat: 31.9,
    lon: 35.2,
    asn: "AS1186",
    region: "Asia",
    country: "Palestine",
  },
  {
    id: "PAPFR",
    name: "Papeetē",
    lat: -15,
    lon: -140,
    asn: "AS1187",
    region: "Oceania",
    country: "French Polynesia",
  },
  {
    id: "DOHQA",
    name: "Doha",
    lat: 25.5,
    lon: 51.25,
    asn: "AS1188",
    region: "Asia",
    country: "Qatar",
  },
  {
    id: "SAIRÉ",
    name: "Saint-Denis",
    lat: -21.15,
    lon: 55.5,
    asn: "AS1189",
    region: "Africa",
    country: "Réunion",
  },
  {
    id: "BUCRO",
    name: "Bucharest",
    lat: 46,
    lon: 25,
    asn: "AS1190",
    region: "Europe",
    country: "Romania",
  },
  {
    id: "MOSRU",
    name: "Moscow",
    lat: 60,
    lon: 100,
    asn: "AS1191",
    region: "Europe",
    country: "Russia",
  },
  {
    id: "KIGRW",
    name: "Kigali",
    lat: -2,
    lon: 30,
    asn: "AS1192",
    region: "Africa",
    country: "Rwanda",
  },
  {
    id: "RIYSA",
    name: "Riyadh",
    lat: 25,
    lon: 45,
    asn: "AS1193",
    region: "Asia",
    country: "Saudi Arabia",
  },
  {
    id: "KHASU",
    name: "Khartoum",
    lat: 15,
    lon: 30,
    asn: "AS1194",
    region: "Africa",
    country: "Sudan",
  },
  {
    id: "DAKSE",
    name: "Dakar",
    lat: 14,
    lon: -14,
    asn: "AS1195",
    region: "Africa",
    country: "Senegal",
  },
  {
    id: "SINSI",
    name: "Singapore",
    lat: 1.36666666,
    lon: 103.8,
    asn: "AS1196",
    region: "Asia",
    country: "Singapore",
  },
  {
    id: "KINSO",
    name: "King Edward Point",
    lat: -54.5,
    lon: -37,
    asn: "AS1197",
    region: "Antarctic",
    country: "South Georgia",
  },
  {
    id: "LONSV",
    name: "Longyearbyen",
    lat: 78,
    lon: 20,
    asn: "AS1198",
    region: "Europe",
    country: "Svalbard and Jan Mayen",
  },
  {
    id: "HONSO",
    name: "Honiara",
    lat: -8,
    lon: 159,
    asn: "AS1199",
    region: "Oceania",
    country: "Solomon Islands",
  },
  {
    id: "FRESI",
    name: "Freetown",
    lat: 8.5,
    lon: -11.5,
    asn: "AS1200",
    region: "Africa",
    country: "Sierra Leone",
  },
  {
    id: "SANEL",
    name: "San Salvador",
    lat: 13.83333333,
    lon: -88.91666666,
    asn: "AS1201",
    region: "Americas",
    country: "El Salvador",
  },
  {
    id: "CITSA",
    name: "City of San Marino",
    lat: 43.76666666,
    lon: 12.41666666,
    asn: "AS1202",
    region: "Europe",
    country: "San Marino",
  },
  {
    id: "MOGSO",
    name: "Mogadishu",
    lat: 10,
    lon: 49,
    asn: "AS1203",
    region: "Africa",
    country: "Somalia",
  },
  {
    id: "SAISA",
    name: "Saint-Pierre",
    lat: 46.83333333,
    lon: -56.33333333,
    asn: "AS1204",
    region: "Americas",
    country: "Saint Pierre and Miquelon",
  },
  {
    id: "BELSE",
    name: "Belgrade",
    lat: 44,
    lon: 21,
    asn: "AS1205",
    region: "Europe",
    country: "Serbia",
  },
  {
    id: "JUBSO",
    name: "Juba",
    lat: 7,
    lon: 30,
    asn: "AS1206",
    region: "Africa",
    country: "South Sudan",
  },
  {
    id: "SÃOSÃ",
    name: "São Tomé",
    lat: 1,
    lon: 7,
    asn: "AS1207",
    region: "Africa",
    country: "São Tomé and Príncipe",
  },
  {
    id: "PARSU",
    name: "Paramaribo",
    lat: 4,
    lon: -56,
    asn: "AS1208",
    region: "Americas",
    country: "Suriname",
  },
  {
    id: "BRASL",
    name: "Bratislava",
    lat: 48.66666666,
    lon: 19.5,
    asn: "AS1209",
    region: "Europe",
    country: "Slovakia",
  },
  {
    id: "LJUSL",
    name: "Ljubljana",
    lat: 46.11666666,
    lon: 14.81666666,
    asn: "AS1210",
    region: "Europe",
    country: "Slovenia",
  },
  {
    id: "STOSW",
    name: "Stockholm",
    lat: 62,
    lon: 15,
    asn: "AS1211",
    region: "Europe",
    country: "Sweden",
  },
  {
    id: "LOBES",
    name: "Lobamba",
    lat: -26.5,
    lon: 31.5,
    asn: "AS1212",
    region: "Africa",
    country: "Eswatini",
  },
  {
    id: "PHISI",
    name: "Philipsburg",
    lat: 18.033333,
    lon: -63.05,
    asn: "AS1213",
    region: "Americas",
    country: "Sint Maarten",
  },
  {
    id: "VICSE",
    name: "Victoria",
    lat: -4.58333333,
    lon: 55.66666666,
    asn: "AS1214",
    region: "Africa",
    country: "Seychelles",
  },
  {
    id: "DAMSY",
    name: "Damascus",
    lat: 35,
    lon: 38,
    asn: "AS1215",
    region: "Asia",
    country: "Syria",
  },
  {
    id: "COCTU",
    name: "Cockburn Town",
    lat: 21.75,
    lon: -71.58333333,
    asn: "AS1216",
    region: "Americas",
    country: "Turks and Caicos Islands",
  },
  {
    id: "N'DCH",
    name: "N'Djamena",
    lat: 15,
    lon: 19,
    asn: "AS1217",
    region: "Africa",
    country: "Chad",
  },
  {
    id: "LOMTO",
    name: "Lomé",
    lat: 8,
    lon: 1.16666666,
    asn: "AS1218",
    region: "Africa",
    country: "Togo",
  },
  {
    id: "BANTH",
    name: "Bangkok",
    lat: 15,
    lon: 100,
    asn: "AS1219",
    region: "Asia",
    country: "Thailand",
  },
  {
    id: "DUSTA",
    name: "Dushanbe",
    lat: 39,
    lon: 71,
    asn: "AS1220",
    region: "Asia",
    country: "Tajikistan",
  },
  {
    id: "FAKTO",
    name: "Fakaofo",
    lat: -9,
    lon: -172,
    asn: "AS1221",
    region: "Oceania",
    country: "Tokelau",
  },
  {
    id: "ASHTU",
    name: "Ashgabat",
    lat: 40,
    lon: 60,
    asn: "AS1222",
    region: "Asia",
    country: "Turkmenistan",
  },
  {
    id: "DILTI",
    name: "Dili",
    lat: -8.83333333,
    lon: 125.91666666,
    asn: "AS1223",
    region: "Asia",
    country: "Timor-Leste",
  },
  {
    id: "NUKTO",
    name: "Nuku'alofa",
    lat: -20,
    lon: -175,
    asn: "AS1224",
    region: "Oceania",
    country: "Tonga",
  },
  {
    id: "PORTR",
    name: "Port of Spain",
    lat: 11,
    lon: -61,
    asn: "AS1225",
    region: "Americas",
    country: "Trinidad and Tobago",
  },
  {
    id: "TUNTU",
    name: "Tunis",
    lat: 34,
    lon: 9,
    asn: "AS1226",
    region: "Africa",
    country: "Tunisia",
  },
  {
    id: "ANKTÜ",
    name: "Ankara",
    lat: 39,
    lon: 35,
    asn: "AS1227",
    region: "Asia",
    country: "Türkiye",
  },
  {
    id: "FUNTU",
    name: "Funafuti",
    lat: -8,
    lon: 178,
    asn: "AS1228",
    region: "Oceania",
    country: "Tuvalu",
  },
  {
    id: "TAITA",
    name: "Taipei",
    lat: 23.5,
    lon: 121,
    asn: "AS1229",
    region: "Asia",
    country: "Taiwan",
  },
  {
    id: "DODTA",
    name: "Dodoma",
    lat: -6,
    lon: 35,
    asn: "AS1230",
    region: "Africa",
    country: "Tanzania",
  },
  {
    id: "KAMUG",
    name: "Kampala",
    lat: 1,
    lon: 32,
    asn: "AS1231",
    region: "Africa",
    country: "Uganda",
  },
  {
    id: "KYIUK",
    name: "Kyiv",
    lat: 49,
    lon: 32,
    asn: "AS1232",
    region: "Europe",
    country: "Ukraine",
  },
  {
    id: "UNKUN",
    name: "Unknown",
    lat: 19.3,
    lon: 166.633333,
    asn: "AS1233",
    region: "Americas",
    country: "United States Minor Outlying Islands",
  },
  {
    id: "MONUR",
    name: "Montevideo",
    lat: -33,
    lon: -56,
    asn: "AS1234",
    region: "Americas",
    country: "Uruguay",
  },
  {
    id: "WASUN",
    name: "Washington D.C.",
    lat: 38,
    lon: -97,
    asn: "AS1235",
    region: "Americas",
    country: "United States",
  },
  {
    id: "TASUZ",
    name: "Tashkent",
    lat: 41,
    lon: 64,
    asn: "AS1236",
    region: "Asia",
    country: "Uzbekistan",
  },
  {
    id: "VATVA",
    name: "Vatican City",
    lat: 41.9,
    lon: 12.45,
    asn: "AS1237",
    region: "Europe",
    country: "Vatican City",
  },
  {
    id: "KINSA",
    name: "Kingstown",
    lat: 13.25,
    lon: -61.2,
    asn: "AS1238",
    region: "Americas",
    country: "Saint Vincent and the Grenadines",
  },
  {
    id: "CARVE",
    name: "Caracas",
    lat: 8,
    lon: -66,
    asn: "AS1239",
    region: "Americas",
    country: "Venezuela",
  },
  {
    id: "ROABR",
    name: "Road Town",
    lat: 18.431383,
    lon: -64.62305,
    asn: "AS1240",
    region: "Americas",
    country: "British Virgin Islands",
  },
  {
    id: "CHAUN",
    name: "Charlotte Amalie",
    lat: 18.35,
    lon: -64.933333,
    asn: "AS1241",
    region: "Americas",
    country: "United States Virgin Islands",
  },
  {
    id: "HANVI",
    name: "Hanoi",
    lat: 16.16666666,
    lon: 107.83333333,
    asn: "AS1242",
    region: "Asia",
    country: "Vietnam",
  },
  {
    id: "PORVA",
    name: "Port Vila",
    lat: -16,
    lon: 167,
    asn: "AS1243",
    region: "Oceania",
    country: "Vanuatu",
  },
  {
    id: "MATWA",
    name: "Mata-Utu",
    lat: -13.3,
    lon: -176.2,
    asn: "AS1244",
    region: "Oceania",
    country: "Wallis and Futuna",
  },
  {
    id: "APISA",
    name: "Apia",
    lat: -13.58333333,
    lon: -172.33333333,
    asn: "AS1245",
    region: "Oceania",
    country: "Samoa",
  },
  {
    id: "SANYE",
    name: "Sana'a",
    lat: 15,
    lon: 48,
    asn: "AS1246",
    region: "Asia",
    country: "Yemen",
  },
  {
    id: "PRESO",
    name: "Pretoria",
    lat: -29,
    lon: 24,
    asn: "AS1247",
    region: "Africa",
    country: "South Africa",
  },
  {
    id: "LUSZA",
    name: "Lusaka",
    lat: -15,
    lon: 30,
    asn: "AS1248",
    region: "Africa",
    country: "Zambia",
  },
  {
    id: "HARZI",
    name: "Harare",
    lat: -20,
    lon: 30,
    asn: "AS1249",
    region: "Africa",
    country: "Zimbabwe",
  },
];

const NODES = [
  ...ALL_NODES,
  {
    id: "NYC",
    name: "New York",
    lat: 40.71,
    lon: -74.0,
    asn: "AS6939",
    region: "NA",
    country: "United States",
  },
  {
    id: "LAX",
    name: "Los Angeles",
    lat: 34.05,
    lon: -118.24,
    asn: "AS1257",
    region: "NA",
    country: "United States",
  },
  {
    id: "SEA",
    name: "Seattle",
    lat: 47.61,
    lon: -122.33,
    asn: "AS3561",
    region: "NA",
    country: "United States",
  },
  {
    id: "CHI",
    name: "Chicago",
    lat: 41.88,
    lon: -87.63,
    asn: "AS209",
    region: "NA",
    country: "United States",
  },
  {
    id: "MIA",
    name: "Miami",
    lat: 25.77,
    lon: -80.19,
    asn: "AS3549",
    region: "NA",
    country: "United States",
  },
  {
    id: "LON",
    name: "London",
    lat: 51.51,
    lon: -0.12,
    asn: "AS5459",
    region: "EU",
    country: "United Kingdom",
  },
  {
    id: "AMS",
    name: "Amsterdam",
    lat: 52.37,
    lon: 4.9,
    asn: "AS1200",
    region: "EU",
    country: "Netherlands",
  },
  {
    id: "FRA",
    name: "Frankfurt",
    lat: 50.11,
    lon: 8.68,
    asn: "AS3356",
    region: "EU",
    country: "Germany",
  },
  {
    id: "PAR",
    name: "Paris",
    lat: 48.86,
    lon: 2.35,
    asn: "AS3215",
    region: "EU",
    country: "France",
  },
  {
    id: "MOS",
    name: "Moscow",
    lat: 55.75,
    lon: 37.62,
    asn: "AS8359",
    region: "EU",
    country: "Russia",
  },
  {
    id: "DXB",
    name: "Dubai",
    lat: 25.2,
    lon: 55.27,
    asn: "AS5384",
    region: "ME",
    country: "UAE",
  },
  {
    id: "MUM",
    name: "Mumbai",
    lat: 19.08,
    lon: 72.88,
    asn: "AS9498",
    region: "AS",
    country: "India",
  },
  {
    id: "SIN",
    name: "Singapore",
    lat: 1.35,
    lon: 103.82,
    asn: "AS7473",
    region: "AS",
    country: "Singapore",
  },
  {
    id: "HKG",
    name: "Hong Kong",
    lat: 22.32,
    lon: 114.17,
    asn: "AS4637",
    region: "AS",
    country: "China",
  },
  {
    id: "BEI",
    name: "Beijing",
    lat: 39.9,
    lon: 116.4,
    asn: "AS4538",
    region: "AS",
    country: "China",
  },
  {
    id: "SEO",
    name: "Seoul",
    lat: 37.57,
    lon: 126.98,
    asn: "AS4766",
    region: "AS",
    country: "South Korea",
  },
  {
    id: "TKY",
    name: "Tokyo",
    lat: 35.69,
    lon: 139.69,
    asn: "AS2497",
    region: "AS",
    country: "Japan",
  },
  {
    id: "SYD",
    name: "Sydney",
    lat: -33.87,
    lon: 151.21,
    asn: "AS1221",
    region: "OC",
    country: "Australia",
  },
  {
    id: "SAO",
    name: "São Paulo",
    lat: -23.55,
    lon: -46.63,
    asn: "AS28573",
    region: "SA",
    country: "Brazil",
  },
  {
    id: "JNB",
    name: "Johannesburg",
    lat: -26.2,
    lon: 28.04,
    asn: "AS37100",
    region: "AF",
    country: "South Africa",
  },
  {
    id: "YTO",
    name: "Toronto",
    lat: 43.65,
    lon: -79.38,
    asn: "AS812",
    region: "NA",
    country: "Canada",
  },
  {
    id: "MEX",
    name: "Mexico City",
    lat: 19.43,
    lon: -99.13,
    asn: "AS8151",
    region: "NA",
    country: "Mexico",
  },
  {
    id: "BUE",
    name: "Buenos Aires",
    lat: -34.6,
    lon: -58.38,
    asn: "AS10318",
    region: "SA",
    country: "Argentina",
  },
  {
    id: "SCL",
    name: "Santiago",
    lat: -33.44,
    lon: -70.66,
    asn: "AS27651",
    region: "SA",
    country: "Chile",
  },
  {
    id: "CAI",
    name: "Cairo",
    lat: 30.04,
    lon: 31.23,
    asn: "AS8452",
    region: "AF",
    country: "Egypt",
  },
  {
    id: "LOS",
    name: "Lagos",
    lat: 6.52,
    lon: 3.37,
    asn: "AS29465",
    region: "AF",
    country: "Nigeria",
  },
  {
    id: "NBO",
    name: "Nairobi",
    lat: -1.29,
    lon: 36.82,
    asn: "AS33771",
    region: "AF",
    country: "Kenya",
  },
  {
    id: "IST",
    name: "Istanbul",
    lat: 41.0,
    lon: 28.97,
    asn: "AS9121",
    region: "EU",
    country: "Turkey",
  },
  {
    id: "MAD",
    name: "Madrid",
    lat: 40.41,
    lon: -3.7,
    asn: "AS3352",
    region: "EU",
    country: "Spain",
  },
  {
    id: "MIL",
    name: "Milan",
    lat: 45.46,
    lon: 9.19,
    asn: "AS12874",
    region: "EU",
    country: "Italy",
  },
  {
    id: "WAW",
    name: "Warsaw",
    lat: 52.22,
    lon: 21.01,
    asn: "AS5617",
    region: "EU",
    country: "Poland",
  },
  {
    id: "STO",
    name: "Stockholm",
    lat: 59.32,
    lon: 18.06,
    asn: "AS12552",
    region: "EU",
    country: "Sweden",
  },
  {
    id: "RUH",
    name: "Riyadh",
    lat: 24.71,
    lon: 46.67,
    asn: "AS39891",
    region: "ME",
    country: "Saudi Arabia",
  },
  {
    id: "BKK",
    name: "Bangkok",
    lat: 13.75,
    lon: 100.5,
    asn: "AS4651",
    region: "AS",
    country: "Thailand",
  },
  {
    id: "CGK",
    name: "Jakarta",
    lat: -6.2,
    lon: 106.81,
    asn: "AS4761",
    region: "AS",
    country: "Indonesia",
  },
  {
    id: "MNL",
    name: "Manila",
    lat: 14.59,
    lon: 120.98,
    asn: "AS9299",
    region: "AS",
    country: "Philippines",
  },
  {
    id: "AKL",
    name: "Auckland",
    lat: -36.84,
    lon: 174.76,
    asn: "AS4768",
    region: "OC",
    country: "New Zealand",
  },
];
const NODE_MAP = Object.fromEntries(NODES.map((n) => [n.id, n]));

const ROUTES = [
  {
    id: "ORAAR-WILCU",
    from: "ORAAR",
    to: "WILCU",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "ORAAR-KRACA",
    from: "ORAAR",
    to: "KRACA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ORAAR-NYC", from: "ORAAR", to: "NYC", base: 42, cable: "Global Mesh" },
  {
    id: "KABAF-ISLPA",
    from: "KABAF",
    to: "ISLPA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "KABAF-TASUZ",
    from: "KABAF",
    to: "TASUZ",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "KABAF-DXB", from: "KABAF", to: "DXB", base: 18, cable: "Global Mesh" },
  {
    id: "LUAAN-WINNA",
    from: "LUAAN",
    to: "WINNA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "LUAAN-GABBO",
    from: "LUAAN",
    to: "GABBO",
    base: 16,
    cable: "Global Mesh",
  },
  { id: "LUAAN-JNB", from: "LUAAN", to: "JNB", base: 25, cable: "Global Mesh" },
  {
    id: "THEAN-PHISI",
    from: "THEAN",
    to: "PHISI",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "THEAN-GUSSA",
    from: "THEAN",
    to: "GUSSA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "THEAN-NYC", from: "THEAN", to: "NYC", base: 37, cable: "Global Mesh" },
  { id: "MARÅL-STO", from: "MARÅL", to: "STO", base: 15, cable: "Global Mesh" },
  {
    id: "MARÅL-STOSW",
    from: "MARÅL",
    to: "STOSW",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "MARÅL-FRA", from: "MARÅL", to: "FRA", base: 22, cable: "Global Mesh" },
  {
    id: "TIRAL-PODMO",
    from: "TIRAL",
    to: "PODMO",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "TIRAL-PRIKO",
    from: "TIRAL",
    to: "PRIKO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "TIRAL-FRA", from: "TIRAL", to: "FRA", base: 21, cable: "Global Mesh" },
  {
    id: "ANDAN-PARFR",
    from: "ANDAN",
    to: "PARFR",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ANDAN-MAD", from: "ANDAN", to: "MAD", base: 15, cable: "Global Mesh" },
  { id: "ANDAN-LON", from: "ANDAN", to: "LON", base: 15, cable: "Global Mesh" },
  { id: "ABUUN-DXB", from: "ABUUN", to: "DXB", base: 15, cable: "Global Mesh" },
  {
    id: "ABUUN-DOHQA",
    from: "ABUUN",
    to: "DOHQA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BUEAR-BUE", from: "BUEAR", to: "BUE", base: 15, cable: "Global Mesh" },
  { id: "BUEAR-SCL", from: "BUEAR", to: "SCL", base: 15, cable: "Global Mesh" },
  { id: "BUEAR-SAO", from: "BUEAR", to: "SAO", base: 30, cable: "Global Mesh" },
  {
    id: "YERAR-TBIGE",
    from: "YERAR",
    to: "TBIGE",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "YERAR-BAKAZ",
    from: "YERAR",
    to: "BAKAZ",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "YERAR-DXB", from: "YERAR", to: "DXB", base: 27, cable: "Global Mesh" },
  {
    id: "PAGAM-APISA",
    from: "PAGAM",
    to: "APISA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "PAGAM-ALONI",
    from: "PAGAM",
    to: "ALONI",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "PAGAM-NYC",
    from: "PAGAM",
    to: "NYC",
    base: 165,
    cable: "Global Mesh",
  },
  {
    id: "UNKAN-UNKBO",
    from: "UNKAN",
    to: "UNKBO",
    base: 53,
    cable: "Global Mesh",
  },
  {
    id: "UNKAN-KINSO",
    from: "UNKAN",
    to: "KINSO",
    base: 76,
    cable: "Global Mesh",
  },
  {
    id: "UNKAN-JNB",
    from: "UNKAN",
    to: "JNB",
    base: 104,
    cable: "Global Mesh",
  },
  {
    id: "PORFR-UNKHE",
    from: "PORFR",
    to: "UNKHE",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "PORFR-PORMA",
    from: "PORFR",
    to: "PORMA",
    base: 46,
    cable: "Global Mesh",
  },
  { id: "PORFR-JNB", from: "PORFR", to: "JNB", base: 70, cable: "Global Mesh" },
  {
    id: "SAIAN-PLYMO",
    from: "SAIAN",
    to: "PLYMO",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "SAIAN-BASGU",
    from: "SAIAN",
    to: "BASGU",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "SAIAN-NYC", from: "SAIAN", to: "NYC", base: 39, cable: "Global Mesh" },
  { id: "CANAU-SYD", from: "CANAU", to: "SYD", base: 29, cable: "Global Mesh" },
  {
    id: "CANAU-DILTI",
    from: "CANAU",
    to: "DILTI",
    base: 29,
    cable: "Global Mesh",
  },
  {
    id: "VIEAU-LJUSL",
    from: "VIEAU",
    to: "LJUSL",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "VIEAU-ZAGCR",
    from: "VIEAU",
    to: "ZAGCR",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "VIEAU-FRA", from: "VIEAU", to: "FRA", base: 15, cable: "Global Mesh" },
  {
    id: "BAKAZ-TBIGE",
    from: "BAKAZ",
    to: "TBIGE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BAKAZ-DXB", from: "BAKAZ", to: "DXB", base: 25, cable: "Global Mesh" },
  {
    id: "GITBU-KIGRW",
    from: "GITBU",
    to: "KIGRW",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "GITBU-KAMUG",
    from: "GITBU",
    to: "KAMUG",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "GITBU-JNB", from: "GITBU", to: "JNB", base: 34, cable: "Global Mesh" },
  { id: "BRUBE-AMS", from: "BRUBE", to: "AMS", base: 15, cable: "Global Mesh" },
  {
    id: "BRUBE-AMSNE",
    from: "BRUBE",
    to: "AMSNE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BRUBE-LON", from: "BRUBE", to: "LON", base: 15, cable: "Global Mesh" },
  {
    id: "PORBE-LOMTO",
    from: "PORBE",
    to: "LOMTO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "PORBE-LOS", from: "PORBE", to: "LOS", base: 15, cable: "Global Mesh" },
  { id: "PORBE-FRA", from: "PORBE", to: "FRA", base: 61, cable: "Global Mesh" },
  {
    id: "OUABU-BAMMA",
    from: "OUABU",
    to: "BAMMA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "OUABU-ACCGH",
    from: "OUABU",
    to: "ACCGH",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "OUABU-LON", from: "OUABU", to: "LON", base: 57, cable: "Global Mesh" },
  {
    id: "DHABA-THIBH",
    from: "DHABA",
    to: "THIBH",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "DHABA-KATNE",
    from: "DHABA",
    to: "KATNE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "DHABA-SIN", from: "DHABA", to: "SIN", base: 39, cable: "Global Mesh" },
  {
    id: "SOFBU-BUCRO",
    from: "SOFBU",
    to: "BUCRO",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "SOFBU-SKONO",
    from: "SOFBU",
    to: "SKONO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "SOFBU-FRA", from: "SOFBU", to: "FRA", base: 26, cable: "Global Mesh" },
  {
    id: "MANBA-DOHQA",
    from: "MANBA",
    to: "DOHQA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "MANBA-ABUUN",
    from: "MANBA",
    to: "ABUUN",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "MANBA-DXB", from: "MANBA", to: "DXB", base: 15, cable: "Global Mesh" },
  { id: "NASBA-MIA", from: "NASBA", to: "MIA", base: 15, cable: "Global Mesh" },
  {
    id: "NASBA-HAVCU",
    from: "NASBA",
    to: "HAVCU",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "NASBA-NYC", from: "NASBA", to: "NYC", base: 24, cable: "Global Mesh" },
  {
    id: "SARBO-PODMO",
    from: "SARBO",
    to: "PODMO",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "SARBO-ZAGCR",
    from: "SARBO",
    to: "ZAGCR",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "SARBO-FRA", from: "SARBO", to: "FRA", base: 16, cable: "Global Mesh" },
  {
    id: "GUSSA-PHISI",
    from: "GUSSA",
    to: "PHISI",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "GUSSA-NYC", from: "GUSSA", to: "NYC", base: 36, cable: "Global Mesh" },
  {
    id: "JAMSA-SÃOSÃ",
    from: "JAMSA",
    to: "SÃOSÃ",
    base: 31,
    cable: "Global Mesh",
  },
  {
    id: "JAMSA-MONLI",
    from: "JAMSA",
    to: "MONLI",
    base: 34,
    cable: "Global Mesh",
  },
  { id: "JAMSA-JNB", from: "JAMSA", to: "JNB", base: 52, cable: "Global Mesh" },
  {
    id: "MINBE-VILLI",
    from: "MINBE",
    to: "VILLI",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "MINBE-RIGLA",
    from: "MINBE",
    to: "RIGLA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "MINBE-FRA", from: "MINBE", to: "FRA", base: 29, cable: "Global Mesh" },
  {
    id: "BELBE-GUAGU",
    from: "BELBE",
    to: "GUAGU",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "BELBE-TEGHO",
    from: "BELBE",
    to: "TEGHO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BELBE-NYC", from: "BELBE", to: "NYC", base: 41, cable: "Global Mesh" },
  { id: "HAMBE-NYC", from: "HAMBE", to: "NYC", base: 18, cable: "Global Mesh" },
  {
    id: "HAMBE-COCTU",
    from: "HAMBE",
    to: "COCTU",
    base: 18,
    cable: "Global Mesh",
  },
  {
    id: "SUCBO-ASUPA",
    from: "SUCBO",
    to: "ASUPA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "SUCBO-BRABR",
    from: "SUCBO",
    to: "BRABR",
    base: 18,
    cable: "Global Mesh",
  },
  { id: "SUCBO-SAO", from: "SUCBO", to: "SAO", base: 29, cable: "Global Mesh" },
  {
    id: "KRACA-WILCU",
    from: "KRACA",
    to: "WILCU",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "KRACA-NYC", from: "KRACA", to: "NYC", base: 43, cable: "Global Mesh" },
  {
    id: "BRABR-ASUPA",
    from: "BRABR",
    to: "ASUPA",
    base: 20,
    cable: "Global Mesh",
  },
  { id: "BRABR-SAO", from: "BRABR", to: "SAO", base: 23, cable: "Global Mesh" },
  {
    id: "BRIBA-CASSA",
    from: "BRIBA",
    to: "CASSA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "BRIBA-KINSA",
    from: "BRIBA",
    to: "KINSA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BRIBA-NYC", from: "BRIBA", to: "NYC", base: 46, cable: "Global Mesh" },
  {
    id: "BANBR-KUAMA",
    from: "BANBR",
    to: "KUAMA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "BANBR-JAKIN",
    from: "BANBR",
    to: "JAKIN",
    base: 16,
    cable: "Global Mesh",
  },
  { id: "BANBR-SIN", from: "BANBR", to: "SIN", base: 16, cable: "Global Mesh" },
  {
    id: "THIBH-KATNE",
    from: "THIBH",
    to: "KATNE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "THIBH-SIN", from: "THIBH", to: "SIN", base: 44, cable: "Global Mesh" },
  {
    id: "UNKBO-PRESO",
    from: "UNKBO",
    to: "PRESO",
    base: 49,
    cable: "Global Mesh",
  },
  {
    id: "UNKBO-WINNA",
    from: "UNKBO",
    to: "WINNA",
    base: 52,
    cable: "Global Mesh",
  },
  { id: "UNKBO-JNB", from: "UNKBO", to: "JNB", base: 56, cable: "Global Mesh" },
  { id: "GABBO-JNB", from: "GABBO", to: "JNB", base: 15, cable: "Global Mesh" },
  {
    id: "GABBO-HARZI",
    from: "GABBO",
    to: "HARZI",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "BANCE-KINDR",
    from: "BANCE",
    to: "KINDR",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "BANCE-N'DCH",
    from: "BANCE",
    to: "N'DCH",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BANCE-JNB", from: "BANCE", to: "JNB", base: 50, cable: "Global Mesh" },
  { id: "OTTCA-CHI", from: "OTTCA", to: "CHI", base: 29, cable: "Global Mesh" },
  {
    id: "OTTCA-WASUN",
    from: "OTTCA",
    to: "WASUN",
    base: 33,
    cable: "Global Mesh",
  },
  { id: "OTTCA-NYC", from: "OTTCA", to: "NYC", base: 42, cable: "Global Mesh" },
  {
    id: "WESCO-FLYCH",
    from: "WESCO",
    to: "FLYCH",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "WESCO-CGK", from: "WESCO", to: "CGK", base: 17, cable: "Global Mesh" },
  { id: "WESCO-SIN", from: "WESCO", to: "SIN", base: 23, cable: "Global Mesh" },
  {
    id: "BERSW-VADLI",
    from: "BERSW",
    to: "VADLI",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BERSW-MIL", from: "BERSW", to: "MIL", base: 15, cable: "Global Mesh" },
  { id: "BERSW-FRA", from: "BERSW", to: "FRA", base: 15, cable: "Global Mesh" },
  { id: "SANCH-SCL", from: "SANCH", to: "SCL", base: 15, cable: "Global Mesh" },
  {
    id: "SANCH-BUEAR",
    from: "SANCH",
    to: "BUEAR",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "SANCH-SAO", from: "SANCH", to: "SAO", base: 37, cable: "Global Mesh" },
  {
    id: "BEICH-ULAMO",
    from: "BEICH",
    to: "ULAMO",
    base: 16,
    cable: "Global Mesh",
  },
  { id: "BEICH-BEI", from: "BEICH", to: "BEI", base: 18, cable: "Global Mesh" },
  { id: "BEICH-SIN", from: "BEICH", to: "SIN", base: 50, cable: "Global Mesh" },
  {
    id: "YAMIV-ACCGH",
    from: "YAMIV",
    to: "ACCGH",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "YAMIV-MONLI",
    from: "YAMIV",
    to: "MONLI",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "YAMIV-LON", from: "YAMIV", to: "LON", base: 65, cable: "Global Mesh" },
  {
    id: "YAOCA-MALEQ",
    from: "YAOCA",
    to: "MALEQ",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "YAOCA-ABUNI",
    from: "YAOCA",
    to: "ABUNI",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "YAOCA-JNB", from: "YAOCA", to: "JNB", base: 53, cable: "Global Mesh" },
  {
    id: "KINDR-KIGRW",
    from: "KINDR",
    to: "KIGRW",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "KINDR-GITBU",
    from: "KINDR",
    to: "GITBU",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "KINDR-JNB", from: "KINDR", to: "JNB", base: 39, cable: "Global Mesh" },
  {
    id: "BRACO-LIBGA",
    from: "BRACO",
    to: "LIBGA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "BRACO-MALEQ",
    from: "BRACO",
    to: "MALEQ",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BRACO-JNB", from: "BRACO", to: "JNB", base: 42, cable: "Global Mesh" },
  {
    id: "AVACO-ALONI",
    from: "AVACO",
    to: "ALONI",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "AVACO-PAGAM",
    from: "AVACO",
    to: "PAGAM",
    base: 18,
    cable: "Global Mesh",
  },
  {
    id: "AVACO-NYC",
    from: "AVACO",
    to: "NYC",
    base: 158,
    cable: "Global Mesh",
  },
  {
    id: "BOGCO-CARVE",
    from: "BOGCO",
    to: "CARVE",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "BOGCO-QUIEC",
    from: "BOGCO",
    to: "QUIEC",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BOGCO-NYC", from: "BOGCO", to: "NYC", base: 55, cable: "Global Mesh" },
  {
    id: "MORCO-MAMMA",
    from: "MORCO",
    to: "MAMMA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "MORCO-ANTMA",
    from: "MORCO",
    to: "ANTMA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "MORCO-JNB", from: "MORCO", to: "JNB", base: 32, cable: "Global Mesh" },
  {
    id: "PRACA-BANGA",
    from: "PRACA",
    to: "BANGA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "PRACA-BISGU",
    from: "PRACA",
    to: "BISGU",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "PRACA-LON", from: "PRACA", to: "LON", base: 64, cable: "Global Mesh" },
  {
    id: "SANCO-MANNI",
    from: "SANCO",
    to: "MANNI",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "SANCO-PANPA",
    from: "SANCO",
    to: "PANPA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "SANCO-NYC", from: "SANCO", to: "NYC", base: 48, cable: "Global Mesh" },
  {
    id: "HAVCU-GEOCA",
    from: "HAVCU",
    to: "GEOCA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "HAVCU-KINJA",
    from: "HAVCU",
    to: "KINJA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "HAVCU-NYC", from: "HAVCU", to: "NYC", base: 30, cable: "Global Mesh" },
  { id: "WILCU-NYC", from: "WILCU", to: "NYC", base: 43, cable: "Global Mesh" },
  { id: "FLYCH-CGK", from: "FLYCH", to: "CGK", base: 15, cable: "Global Mesh" },
  { id: "FLYCH-SIN", from: "FLYCH", to: "SIN", base: 17, cable: "Global Mesh" },
  {
    id: "GEOCA-KINJA",
    from: "GEOCA",
    to: "KINJA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "GEOCA-NYC", from: "GEOCA", to: "NYC", base: 33, cable: "Global Mesh" },
  {
    id: "NICCY-BEILE",
    from: "NICCY",
    to: "BEILE",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "NICCY-RAMPA",
    from: "NICCY",
    to: "RAMPA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "NICCY-DXB", from: "NICCY", to: "DXB", base: 36, cable: "Global Mesh" },
  {
    id: "PRACZ-VIEAU",
    from: "PRACZ",
    to: "VIEAU",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "PRACZ-LJUSL",
    from: "PRACZ",
    to: "LJUSL",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "PRACZ-FRA", from: "PRACZ", to: "FRA", base: 15, cable: "Global Mesh" },
  { id: "BERGE-FRA", from: "BERGE", to: "FRA", base: 15, cable: "Global Mesh" },
  {
    id: "BERGE-LUXLU",
    from: "BERGE",
    to: "LUXLU",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "DJIDJ-ASMER",
    from: "DJIDJ",
    to: "ASMER",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "DJIDJ-ADDET",
    from: "DJIDJ",
    to: "ADDET",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "DJIDJ-DXB", from: "DJIDJ", to: "DXB", base: 27, cable: "Global Mesh" },
  {
    id: "ROSDO-FORMA",
    from: "ROSDO",
    to: "FORMA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "ROSDO-BASGU",
    from: "ROSDO",
    to: "BASGU",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ROSDO-NYC", from: "ROSDO", to: "NYC", base: 42, cable: "Global Mesh" },
  {
    id: "COPDE-BERGE",
    from: "COPDE",
    to: "BERGE",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "COPDE-AMSNE",
    from: "COPDE",
    to: "AMSNE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "COPDE-FRA", from: "COPDE", to: "FRA", base: 15, cable: "Global Mesh" },
  {
    id: "SANDO-PORHA",
    from: "SANDO",
    to: "PORHA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "SANDO-COCTU",
    from: "SANDO",
    to: "COCTU",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "SANDO-NYC", from: "SANDO", to: "NYC", base: 32, cable: "Global Mesh" },
  {
    id: "ALGAL-TUNTU",
    from: "ALGAL",
    to: "TUNTU",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "ALGAL-RABMO",
    from: "ALGAL",
    to: "RABMO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ALGAL-FRA", from: "ALGAL", to: "FRA", base: 34, cable: "Global Mesh" },
  {
    id: "QUIEC-LIMPE",
    from: "QUIEC",
    to: "LIMPE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "QUIEC-SAO", from: "QUIEC", to: "SAO", base: 56, cable: "Global Mesh" },
  { id: "CAIEG-CAI", from: "CAIEG", to: "CAI", base: 15, cable: "Global Mesh" },
  {
    id: "CAIEG-JERIS",
    from: "CAIEG",
    to: "JERIS",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "CAIEG-DXB", from: "CAIEG", to: "DXB", base: 38, cable: "Global Mesh" },
  {
    id: "ASMER-ADDET",
    from: "ASMER",
    to: "ADDET",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ASMER-DXB", from: "ASMER", to: "DXB", base: 28, cable: "Global Mesh" },
  {
    id: "ELWE-NOUMA",
    from: "ELWE",
    to: "NOUMA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "ELWE-DAKSE",
    from: "ELWE",
    to: "DAKSE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ELWE-LON", from: "ELWE", to: "LON", base: 44, cable: "Global Mesh" },
  { id: "MADSP-MAD", from: "MADSP", to: "MAD", base: 15, cable: "Global Mesh" },
  {
    id: "MADSP-LISPO",
    from: "MADSP",
    to: "LISPO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "MADSP-LON", from: "MADSP", to: "LON", base: 18, cable: "Global Mesh" },
  {
    id: "TALES-RIGLA",
    from: "TALES",
    to: "RIGLA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "TALES-VILLI",
    from: "TALES",
    to: "VILLI",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "TALES-FRA", from: "TALES", to: "FRA", base: 29, cable: "Global Mesh" },
  {
    id: "ADDET-NAIKE",
    from: "ADDET",
    to: "NAIKE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ADDET-DXB", from: "ADDET", to: "DXB", base: 36, cable: "Global Mesh" },
  {
    id: "HELFI-TALES",
    from: "HELFI",
    to: "TALES",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "HELFI-RIGLA",
    from: "HELFI",
    to: "RIGLA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "HELFI-FRA", from: "HELFI", to: "FRA", base: 33, cable: "Global Mesh" },
  {
    id: "SUVFI-PORVA",
    from: "SUVFI",
    to: "PORVA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "SUVFI-NOUNE",
    from: "SUVFI",
    to: "NOUNE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "SUVFI-SYD", from: "SUVFI", to: "SYD", base: 42, cable: "Global Mesh" },
  { id: "STAFA-BUE", from: "STAFA", to: "BUE", base: 25, cable: "Global Mesh" },
  {
    id: "STAFA-BUEAR",
    from: "STAFA",
    to: "BUEAR",
    base: 27,
    cable: "Global Mesh",
  },
  { id: "STAFA-SAO", from: "STAFA", to: "SAO", base: 46, cable: "Global Mesh" },
  { id: "PARFR-PAR", from: "PARFR", to: "PAR", base: 15, cable: "Global Mesh" },
  { id: "PARFR-LON", from: "PARFR", to: "LON", base: 15, cable: "Global Mesh" },
  {
    id: "TÓRFA-DOUIS",
    from: "TÓRFA",
    to: "DOUIS",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "TÓRFA-DUBIR",
    from: "TÓRFA",
    to: "DUBIR",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "TÓRFA-LON", from: "TÓRFA", to: "LON", base: 18, cable: "Global Mesh" },
  {
    id: "PALMI-MAJMA",
    from: "PALMI",
    to: "MAJMA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "PALMI-YARNA",
    from: "PALMI",
    to: "YARNA",
    base: 17,
    cable: "Global Mesh",
  },
  { id: "PALMI-TKY", from: "PALMI", to: "TKY", base: 51, cable: "Global Mesh" },
  {
    id: "LIBGA-MALEQ",
    from: "LIBGA",
    to: "MALEQ",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "LIBGA-JNB", from: "LIBGA", to: "JNB", base: 45, cable: "Global Mesh" },
  {
    id: "LONUN-DOUIS",
    from: "LONUN",
    to: "DOUIS",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "LONUN-LON", from: "LONUN", to: "LON", base: 15, cable: "Global Mesh" },
  { id: "TBIGE-DXB", from: "TBIGE", to: "DXB", base: 30, cable: "Global Mesh" },
  {
    id: "ST.GU-SAIJE",
    from: "ST.GU",
    to: "SAIJE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ST.GU-LON", from: "ST.GU", to: "LON", base: 15, cable: "Global Mesh" },
  {
    id: "ACCGH-LOMTO",
    from: "ACCGH",
    to: "LOMTO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ACCGH-FRA", from: "ACCGH", to: "FRA", base: 65, cable: "Global Mesh" },
  {
    id: "GIBGI-MADSP",
    from: "GIBGI",
    to: "MADSP",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "GIBGI-RABMO",
    from: "GIBGI",
    to: "RABMO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "GIBGI-LON", from: "GIBGI", to: "LON", base: 24, cable: "Global Mesh" },
  {
    id: "CONGU-FRESI",
    from: "CONGU",
    to: "FRESI",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "CONGU-MONLI",
    from: "CONGU",
    to: "MONLI",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "CONGU-LON", from: "CONGU", to: "LON", base: 62, cable: "Global Mesh" },
  {
    id: "BASGU-PLYMO",
    from: "BASGU",
    to: "PLYMO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BASGU-NYC", from: "BASGU", to: "NYC", base: 41, cable: "Global Mesh" },
  {
    id: "BANGA-BISGU",
    from: "BANGA",
    to: "BISGU",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "BANGA-DAKSE",
    from: "BANGA",
    to: "DAKSE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BANGA-LON", from: "BANGA", to: "LON", base: 62, cable: "Global Mesh" },
  {
    id: "BISGU-DAKSE",
    from: "BISGU",
    to: "DAKSE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BISGU-LON", from: "BISGU", to: "LON", base: 63, cable: "Global Mesh" },
  {
    id: "MALEQ-SÃOSÃ",
    from: "MALEQ",
    to: "SÃOSÃ",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "MALEQ-JNB", from: "MALEQ", to: "JNB", base: 50, cable: "Global Mesh" },
  {
    id: "ATHGR-TIRAL",
    from: "ATHGR",
    to: "TIRAL",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "ATHGR-SKONO",
    from: "ATHGR",
    to: "SKONO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ATHGR-FRA", from: "ATHGR", to: "FRA", base: 26, cable: "Global Mesh" },
  {
    id: "ST.GR-KINSA",
    from: "ST.GR",
    to: "KINSA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "ST.GR-PORTR",
    from: "ST.GR",
    to: "PORTR",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ST.GR-NYC", from: "ST.GR", to: "NYC", base: 46, cable: "Global Mesh" },
  {
    id: "NUUGR-REYIC",
    from: "NUUGR",
    to: "REYIC",
    base: 34,
    cable: "Global Mesh",
  },
  {
    id: "NUUGR-SAISA",
    from: "NUUGR",
    to: "SAISA",
    base: 45,
    cable: "Global Mesh",
  },
  { id: "NUUGR-LON", from: "NUUGR", to: "LON", base: 67, cable: "Global Mesh" },
  {
    id: "GUAGU-SANEL",
    from: "GUAGU",
    to: "SANEL",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "GUAGU-NYC", from: "GUAGU", to: "NYC", base: 44, cable: "Global Mesh" },
  {
    id: "CAYFR-PARSU",
    from: "CAYFR",
    to: "PARSU",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "CAYFR-GEOGU",
    from: "CAYFR",
    to: "GEOGU",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "CAYFR-SAO", from: "CAYFR", to: "SAO", base: 42, cable: "Global Mesh" },
  {
    id: "HAGGU-SAINO",
    from: "HAGGU",
    to: "SAINO",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "HAGGU-NGEPA",
    from: "HAGGU",
    to: "NGEPA",
    base: 17,
    cable: "Global Mesh",
  },
  { id: "HAGGU-TKY", from: "HAGGU", to: "TKY", base: 34, cable: "Global Mesh" },
  {
    id: "GEOGU-PARSU",
    from: "GEOGU",
    to: "PARSU",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "GEOGU-SAO", from: "GEOGU", to: "SAO", base: 46, cable: "Global Mesh" },
  { id: "CITHO-HKG", from: "CITHO", to: "HKG", base: 15, cable: "Global Mesh" },
  {
    id: "CITHO-UNKMA",
    from: "CITHO",
    to: "UNKMA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "CITHO-SIN", from: "CITHO", to: "SIN", base: 35, cable: "Global Mesh" },
  {
    id: "UNKHE-PORMA",
    from: "UNKHE",
    to: "PORMA",
    base: 54,
    cable: "Global Mesh",
  },
  { id: "UNKHE-JNB", from: "UNKHE", to: "JNB", base: 77, cable: "Global Mesh" },
  {
    id: "TEGHO-MANNI",
    from: "TEGHO",
    to: "MANNI",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "TEGHO-SANEL",
    from: "TEGHO",
    to: "SANEL",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "TEGHO-NYC", from: "TEGHO", to: "NYC", base: 42, cable: "Global Mesh" },
  {
    id: "ZAGCR-LJUSL",
    from: "ZAGCR",
    to: "LJUSL",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ZAGCR-FRA", from: "ZAGCR", to: "FRA", base: 15, cable: "Global Mesh" },
  {
    id: "PORHA-COCTU",
    from: "PORHA",
    to: "COCTU",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "PORHA-NYC", from: "PORHA", to: "NYC", base: 32, cable: "Global Mesh" },
  {
    id: "BUDHU-BRASL",
    from: "BUDHU",
    to: "BRASL",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "BUDHU-BELSE",
    from: "BUDHU",
    to: "BELSE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BUDHU-FRA", from: "BUDHU", to: "FRA", base: 17, cable: "Global Mesh" },
  {
    id: "JAKIN-DILTI",
    from: "JAKIN",
    to: "DILTI",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "JAKIN-KUAMA",
    from: "JAKIN",
    to: "KUAMA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "JAKIN-SIN", from: "JAKIN", to: "SIN", base: 26, cable: "Global Mesh" },
  {
    id: "DOUIS-DUBIR",
    from: "DOUIS",
    to: "DUBIR",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "DOUIS-LON", from: "DOUIS", to: "LON", base: 15, cable: "Global Mesh" },
  { id: "NEWIN-MUM", from: "NEWIN", to: "MUM", base: 15, cable: "Global Mesh" },
  {
    id: "NEWIN-KATNE",
    from: "NEWIN",
    to: "KATNE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "NEWIN-DXB", from: "NEWIN", to: "DXB", base: 33, cable: "Global Mesh" },
  {
    id: "DIEBR-MALMA",
    from: "DIEBR",
    to: "MALMA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "DIEBR-VICSE",
    from: "DIEBR",
    to: "VICSE",
    base: 23,
    cable: "Global Mesh",
  },
  { id: "DIEBR-SIN", from: "DIEBR", to: "SIN", base: 49, cable: "Global Mesh" },
  {
    id: "DUBIR-LONUN",
    from: "DUBIR",
    to: "LONUN",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "DUBIR-LON", from: "DUBIR", to: "LON", base: 15, cable: "Global Mesh" },
  {
    id: "TEHIR-MANBA",
    from: "TEHIR",
    to: "MANBA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "TEHIR-DOHQA",
    from: "TEHIR",
    to: "DOHQA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "TEHIR-DXB", from: "TEHIR", to: "DXB", base: 15, cable: "Global Mesh" },
  {
    id: "BAGIR-KUWKU",
    from: "BAGIR",
    to: "KUWKU",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "BAGIR-DAMSY",
    from: "BAGIR",
    to: "DAMSY",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BAGIR-DXB", from: "BAGIR", to: "DXB", base: 20, cable: "Global Mesh" },
  {
    id: "REYIC-TÓRFA",
    from: "REYIC",
    to: "TÓRFA",
    base: 17,
    cable: "Global Mesh",
  },
  {
    id: "REYIC-DUBIR",
    from: "REYIC",
    to: "DUBIR",
    base: 23,
    cable: "Global Mesh",
  },
  { id: "REYIC-LON", from: "REYIC", to: "LON", base: 33, cable: "Global Mesh" },
  {
    id: "JERIS-RAMPA",
    from: "JERIS",
    to: "RAMPA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "JERIS-AMMJO",
    from: "JERIS",
    to: "AMMJO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "JERIS-DXB", from: "JERIS", to: "DXB", base: 31, cable: "Global Mesh" },
  {
    id: "ROMIT-VATVA",
    from: "ROMIT",
    to: "VATVA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "ROMIT-CITSA",
    from: "ROMIT",
    to: "CITSA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ROMIT-FRA", from: "ROMIT", to: "FRA", base: 15, cable: "Global Mesh" },
  { id: "KINJA-NYC", from: "KINJA", to: "NYC", base: 34, cable: "Global Mesh" },
  { id: "SAIJE-LON", from: "SAIJE", to: "LON", base: 15, cable: "Global Mesh" },
  {
    id: "AMMJO-RAMPA",
    from: "AMMJO",
    to: "RAMPA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "AMMJO-DXB", from: "AMMJO", to: "DXB", base: 30, cable: "Global Mesh" },
  { id: "TOKJA-TKY", from: "TOKJA", to: "TKY", base: 15, cable: "Global Mesh" },
  {
    id: "TOKJA-SEOSO",
    from: "TOKJA",
    to: "SEOSO",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "ASTKA-TASUZ",
    from: "ASTKA",
    to: "TASUZ",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "ASTKA-DUSTA",
    from: "ASTKA",
    to: "DUSTA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ASTKA-DXB", from: "ASTKA", to: "DXB", base: 39, cable: "Global Mesh" },
  { id: "NAIKE-NBO", from: "NAIKE", to: "NBO", base: 15, cable: "Global Mesh" },
  {
    id: "NAIKE-KAMUG",
    from: "NAIKE",
    to: "KAMUG",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "NAIKE-JNB", from: "NAIKE", to: "JNB", base: 43, cable: "Global Mesh" },
  {
    id: "BISKY-DUSTA",
    from: "BISKY",
    to: "DUSTA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "BISKY-ASTKA",
    from: "BISKY",
    to: "ASTKA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BISKY-DXB", from: "BISKY", to: "DXB", base: 37, cable: "Global Mesh" },
  {
    id: "PHNCA-HANVI",
    from: "PHNCA",
    to: "HANVI",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "PHNCA-BKK", from: "PHNCA", to: "BKK", base: 15, cable: "Global Mesh" },
  { id: "PHNCA-SIN", from: "PHNCA", to: "SIN", base: 17, cable: "Global Mesh" },
  {
    id: "SOUKI-YARNA",
    from: "SOUKI",
    to: "YARNA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "SOUKI-MAJMA",
    from: "SOUKI",
    to: "MAJMA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "SOUKI-SYD", from: "SOUKI", to: "SYD", base: 62, cable: "Global Mesh" },
  {
    id: "BASSA-PHISI",
    from: "BASSA",
    to: "PHISI",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "BASSA-PLYMO",
    from: "BASSA",
    to: "PLYMO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BASSA-NYC", from: "BASSA", to: "NYC", base: 38, cable: "Global Mesh" },
  { id: "SEOSO-SEO", from: "SEOSO", to: "SEO", base: 15, cable: "Global Mesh" },
  {
    id: "SEOSO-PYONO",
    from: "SEOSO",
    to: "PYONO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "SEOSO-TKY", from: "SEOSO", to: "TKY", base: 18, cable: "Global Mesh" },
  {
    id: "PRIKO-SKONO",
    from: "PRIKO",
    to: "SKONO",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "PRIKO-BELSE",
    from: "PRIKO",
    to: "BELSE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "PRIKO-FRA", from: "PRIKO", to: "FRA", base: 21, cable: "Global Mesh" },
  {
    id: "KUWKU-RIYSA",
    from: "KUWKU",
    to: "RIYSA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "KUWKU-DXB", from: "KUWKU", to: "DXB", base: 15, cable: "Global Mesh" },
  {
    id: "VIELA-HANVI",
    from: "VIELA",
    to: "HANVI",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "VIELA-PHNCA",
    from: "VIELA",
    to: "PHNCA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "VIELA-SIN", from: "VIELA", to: "SIN", base: 25, cable: "Global Mesh" },
  {
    id: "BEILE-RAMPA",
    from: "BEILE",
    to: "RAMPA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "BEILE-DAMSY",
    from: "BEILE",
    to: "DAMSY",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BEILE-DXB", from: "BEILE", to: "DXB", base: 31, cable: "Global Mesh" },
  {
    id: "MONLI-FRESI",
    from: "MONLI",
    to: "FRESI",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "MONLI-LON", from: "MONLI", to: "LON", base: 68, cable: "Global Mesh" },
  {
    id: "TRILI-N'DCH",
    from: "TRILI",
    to: "N'DCH",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "TRILI-VALMA",
    from: "TRILI",
    to: "VALMA",
    base: 16,
    cable: "Global Mesh",
  },
  { id: "TRILI-FRA", from: "TRILI", to: "FRA", base: 39, cable: "Global Mesh" },
  {
    id: "CASSA-KINSA",
    from: "CASSA",
    to: "KINSA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "CASSA-FORMA",
    from: "CASSA",
    to: "FORMA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "CASSA-NYC", from: "CASSA", to: "NYC", base: 44, cable: "Global Mesh" },
  { id: "VADLI-MIL", from: "VADLI", to: "MIL", base: 15, cable: "Global Mesh" },
  { id: "VADLI-FRA", from: "VADLI", to: "FRA", base: 15, cable: "Global Mesh" },
  {
    id: "COLSR-MALMA",
    from: "COLSR",
    to: "MALMA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "COLSR-NEWIN",
    from: "COLSR",
    to: "NEWIN",
    base: 20,
    cable: "Global Mesh",
  },
  { id: "COLSR-SIN", from: "COLSR", to: "SIN", base: 35, cable: "Global Mesh" },
  { id: "MASLE-JNB", from: "MASLE", to: "JNB", base: 15, cable: "Global Mesh" },
  {
    id: "MASLE-LOBES",
    from: "MASLE",
    to: "LOBES",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "VILLI-RIGLA",
    from: "VILLI",
    to: "RIGLA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "VILLI-FRA", from: "VILLI", to: "FRA", base: 24, cable: "Global Mesh" },
  {
    id: "LUXLU-BRUBE",
    from: "LUXLU",
    to: "BRUBE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "LUXLU-FRA", from: "LUXLU", to: "FRA", base: 15, cable: "Global Mesh" },
  { id: "RIGLA-FRA", from: "RIGLA", to: "FRA", base: 26, cable: "Global Mesh" },
  { id: "UNKMA-HKG", from: "UNKMA", to: "HKG", base: 15, cable: "Global Mesh" },
  { id: "UNKMA-SIN", from: "UNKMA", to: "SIN", base: 34, cable: "Global Mesh" },
  {
    id: "MARSA-GUSSA",
    from: "MARSA",
    to: "GUSSA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "MARSA-ROABR",
    from: "MARSA",
    to: "ROABR",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "MARSA-NYC", from: "MARSA", to: "NYC", base: 37, cable: "Global Mesh" },
  {
    id: "RABMO-MADSP",
    from: "RABMO",
    to: "MADSP",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "RABMO-LON", from: "RABMO", to: "LON", base: 30, cable: "Global Mesh" },
  { id: "MONMO-MIL", from: "MONMO", to: "MIL", base: 15, cable: "Global Mesh" },
  {
    id: "MONMO-BERSW",
    from: "MONMO",
    to: "BERSW",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "MONMO-FRA", from: "MONMO", to: "FRA", base: 15, cable: "Global Mesh" },
  {
    id: "CHIMO-KYIUK",
    from: "CHIMO",
    to: "KYIUK",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "CHIMO-BUCRO",
    from: "CHIMO",
    to: "BUCRO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "CHIMO-FRA", from: "CHIMO", to: "FRA", base: 30, cable: "Global Mesh" },
  {
    id: "ANTMA-MAMMA",
    from: "ANTMA",
    to: "MAMMA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ANTMA-JNB", from: "ANTMA", to: "JNB", base: 29, cable: "Global Mesh" },
  { id: "MALMA-DXB", from: "MALMA", to: "DXB", base: 42, cable: "Global Mesh" },
  { id: "MEXME-MEX", from: "MEXME", to: "MEX", base: 15, cable: "Global Mesh" },
  {
    id: "MEXME-GUAGU",
    from: "MEXME",
    to: "GUAGU",
    base: 20,
    cable: "Global Mesh",
  },
  { id: "MEXME-NYC", from: "MEXME", to: "NYC", base: 49, cable: "Global Mesh" },
  {
    id: "MAJMA-YARNA",
    from: "MAJMA",
    to: "YARNA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "MAJMA-TKY", from: "MAJMA", to: "TKY", base: 58, cable: "Global Mesh" },
  {
    id: "SKONO-TIRAL",
    from: "SKONO",
    to: "TIRAL",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "SKONO-FRA", from: "SKONO", to: "FRA", base: 23, cable: "Global Mesh" },
  {
    id: "BAMMA-CONGU",
    from: "BAMMA",
    to: "CONGU",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BAMMA-LON", from: "BAMMA", to: "LON", base: 52, cable: "Global Mesh" },
  {
    id: "VALMA-TUNTU",
    from: "VALMA",
    to: "TUNTU",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "VALMA-VATVA",
    from: "VALMA",
    to: "VATVA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "VALMA-FRA", from: "VALMA", to: "FRA", base: 23, cable: "Global Mesh" },
  {
    id: "NAYMY-BANTH",
    from: "NAYMY",
    to: "BANTH",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "NAYMY-VIELA",
    from: "NAYMY",
    to: "VIELA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "NAYMY-SIN", from: "NAYMY", to: "SIN", base: 32, cable: "Global Mesh" },
  {
    id: "PODMO-PRIKO",
    from: "PODMO",
    to: "PRIKO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "PODMO-FRA", from: "PODMO", to: "FRA", base: 19, cable: "Global Mesh" },
  { id: "ULAMO-BEI", from: "ULAMO", to: "BEI", base: 19, cable: "Global Mesh" },
  { id: "ULAMO-TKY", from: "ULAMO", to: "TKY", base: 54, cable: "Global Mesh" },
  {
    id: "SAINO-NGEPA",
    from: "SAINO",
    to: "NGEPA",
    base: 20,
    cable: "Global Mesh",
  },
  { id: "SAINO-TKY", from: "SAINO", to: "TKY", base: 32, cable: "Global Mesh" },
  {
    id: "MAPMO-LILMA",
    from: "MAPMO",
    to: "LILMA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "MAPMO-HARZI",
    from: "MAPMO",
    to: "HARZI",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "MAPMO-JNB", from: "MAPMO", to: "JNB", base: 15, cable: "Global Mesh" },
  {
    id: "NOUMA-DAKSE",
    from: "NOUMA",
    to: "DAKSE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "NOUMA-LON", from: "NOUMA", to: "LON", base: 50, cable: "Global Mesh" },
  { id: "PLYMO-NYC", from: "PLYMO", to: "NYC", base: 40, cable: "Global Mesh" },
  { id: "FORMA-NYC", from: "FORMA", to: "NYC", base: 43, cable: "Global Mesh" },
  {
    id: "PORMA-SAIRÉ",
    from: "PORMA",
    to: "SAIRÉ",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "PORMA-ANTMA",
    from: "PORMA",
    to: "ANTMA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "PORMA-JNB", from: "PORMA", to: "JNB", base: 45, cable: "Global Mesh" },
  {
    id: "LILMA-LUSZA",
    from: "LILMA",
    to: "LUSZA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "LILMA-JNB", from: "LILMA", to: "JNB", base: 21, cable: "Global Mesh" },
  { id: "KUAMA-SIN", from: "KUAMA", to: "SIN", base: 15, cable: "Global Mesh" },
  { id: "MAMMA-JNB", from: "MAMMA", to: "JNB", base: 32, cable: "Global Mesh" },
  {
    id: "WINNA-GABBO",
    from: "WINNA",
    to: "GABBO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "WINNA-JNB", from: "WINNA", to: "JNB", base: 17, cable: "Global Mesh" },
  {
    id: "NOUNE-PORVA",
    from: "NOUNE",
    to: "PORVA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "NOUNE-KINNO",
    from: "NOUNE",
    to: "KINNO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "NOUNE-SYD", from: "NOUNE", to: "SYD", base: 28, cable: "Global Mesh" },
  {
    id: "NIANI-ABUNI",
    from: "NIANI",
    to: "ABUNI",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "NIANI-PORBE",
    from: "NIANI",
    to: "PORBE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "NIANI-FRA", from: "NIANI", to: "FRA", base: 51, cable: "Global Mesh" },
  { id: "KINNO-AKL", from: "KINNO", to: "AKL", base: 15, cable: "Global Mesh" },
  { id: "KINNO-SYD", from: "KINNO", to: "SYD", base: 26, cable: "Global Mesh" },
  {
    id: "ABUNI-PORBE",
    from: "ABUNI",
    to: "PORBE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ABUNI-FRA", from: "ABUNI", to: "FRA", base: 60, cable: "Global Mesh" },
  { id: "MANNI-NYC", from: "MANNI", to: "NYC", base: 44, cable: "Global Mesh" },
  {
    id: "ALONI-NUKTO",
    from: "ALONI",
    to: "NUKTO",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "ALONI-NYC",
    from: "ALONI",
    to: "NYC",
    base: 169,
    cable: "Global Mesh",
  },
  { id: "AMSNE-AMS", from: "AMSNE", to: "AMS", base: 15, cable: "Global Mesh" },
  { id: "AMSNE-FRA", from: "AMSNE", to: "FRA", base: 15, cable: "Global Mesh" },
  {
    id: "OSLNO-STOSW",
    from: "OSLNO",
    to: "STOSW",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "OSLNO-COPDE",
    from: "OSLNO",
    to: "COPDE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "OSLNO-FRA", from: "OSLNO", to: "FRA", base: 17, cable: "Global Mesh" },
  { id: "KATNE-DXB", from: "KATNE", to: "DXB", base: 43, cable: "Global Mesh" },
  { id: "YARNA-SYD", from: "YARNA", to: "SYD", base: 55, cable: "Global Mesh" },
  { id: "WELNE-AKL", from: "WELNE", to: "AKL", base: 15, cable: "Global Mesh" },
  {
    id: "WELNE-KINNO",
    from: "WELNE",
    to: "KINNO",
    base: 20,
    cable: "Global Mesh",
  },
  { id: "WELNE-SYD", from: "WELNE", to: "SYD", base: 35, cable: "Global Mesh" },
  {
    id: "MUSOM-ABUUN",
    from: "MUSOM",
    to: "ABUUN",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "MUSOM-DXB", from: "MUSOM", to: "DXB", base: 15, cable: "Global Mesh" },
  {
    id: "ISLPA-DUSTA",
    from: "ISLPA",
    to: "DUSTA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ISLPA-DXB", from: "ISLPA", to: "DXB", base: 23, cable: "Global Mesh" },
  {
    id: "PANPA-MANNI",
    from: "PANPA",
    to: "MANNI",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "PANPA-NYC", from: "PANPA", to: "NYC", base: 48, cable: "Global Mesh" },
  {
    id: "ADAPI-PAPFR",
    from: "ADAPI",
    to: "PAPFR",
    base: 21,
    cable: "Global Mesh",
  },
  {
    id: "ADAPI-AVACO",
    from: "ADAPI",
    to: "AVACO",
    base: 44,
    cable: "Global Mesh",
  },
  {
    id: "ADAPI-SAO",
    from: "ADAPI",
    to: "SAO",
    base: 125,
    cable: "Global Mesh",
  },
  {
    id: "LIMPE-SUCBO",
    from: "LIMPE",
    to: "SUCBO",
    base: 19,
    cable: "Global Mesh",
  },
  { id: "LIMPE-SAO", from: "LIMPE", to: "SAO", base: 48, cable: "Global Mesh" },
  { id: "MANPH-MNL", from: "MANPH", to: "MNL", base: 15, cable: "Global Mesh" },
  {
    id: "MANPH-TAITA",
    from: "MANPH",
    to: "TAITA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "MANPH-SIN", from: "MANPH", to: "SIN", base: 32, cable: "Global Mesh" },
  { id: "NGEPA-TKY", from: "NGEPA", to: "TKY", base: 42, cable: "Global Mesh" },
  {
    id: "PORPA-HONSO",
    from: "PORPA",
    to: "HONSO",
    base: 18,
    cable: "Global Mesh",
  },
  {
    id: "PORPA-PALMI",
    from: "PORPA",
    to: "PALMI",
    base: 25,
    cable: "Global Mesh",
  },
  { id: "PORPA-SYD", from: "PORPA", to: "SYD", base: 42, cable: "Global Mesh" },
  { id: "WARPO-WAW", from: "WARPO", to: "WAW", base: 15, cable: "Global Mesh" },
  {
    id: "WARPO-BRASL",
    from: "WARPO",
    to: "BRASL",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "WARPO-FRA", from: "WARPO", to: "FRA", base: 17, cable: "Global Mesh" },
  {
    id: "SANPU-CHAUN",
    from: "SANPU",
    to: "CHAUN",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "SANPU-ROABR",
    from: "SANPU",
    to: "ROABR",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "SANPU-NYC", from: "SANPU", to: "NYC", base: 35, cable: "Global Mesh" },
  { id: "PYONO-SEO", from: "PYONO", to: "SEO", base: 15, cable: "Global Mesh" },
  { id: "PYONO-TKY", from: "PYONO", to: "TKY", base: 20, cable: "Global Mesh" },
  {
    id: "LISPO-GIBGI",
    from: "LISPO",
    to: "GIBGI",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "LISPO-LON", from: "LISPO", to: "LON", base: 21, cable: "Global Mesh" },
  {
    id: "ASUPA-MONUR",
    from: "ASUPA",
    to: "MONUR",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ASUPA-SAO", from: "ASUPA", to: "SAO", base: 17, cable: "Global Mesh" },
  { id: "RAMPA-DXB", from: "RAMPA", to: "DXB", base: 31, cable: "Global Mesh" },
  {
    id: "PAPFR-AVACO",
    from: "PAPFR",
    to: "AVACO",
    base: 31,
    cable: "Global Mesh",
  },
  {
    id: "PAPFR-NYC",
    from: "PAPFR",
    to: "NYC",
    base: 129,
    cable: "Global Mesh",
  },
  { id: "DOHQA-DXB", from: "DOHQA", to: "DXB", base: 15, cable: "Global Mesh" },
  {
    id: "SAIRÉ-ANTMA",
    from: "SAIRÉ",
    to: "ANTMA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "SAIRÉ-JNB", from: "SAIRÉ", to: "JNB", base: 41, cable: "Global Mesh" },
  { id: "BUCRO-FRA", from: "BUCRO", to: "FRA", base: 25, cable: "Global Mesh" },
  {
    id: "MOSRU-ULAMO",
    from: "MOSRU",
    to: "ULAMO",
    base: 22,
    cable: "Global Mesh",
  },
  {
    id: "MOSRU-BEICH",
    from: "MOSRU",
    to: "BEICH",
    base: 38,
    cable: "Global Mesh",
  },
  { id: "MOSRU-TKY", from: "MOSRU", to: "TKY", base: 69, cable: "Global Mesh" },
  {
    id: "KIGRW-KAMUG",
    from: "KIGRW",
    to: "KAMUG",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "KIGRW-JNB", from: "KIGRW", to: "JNB", base: 36, cable: "Global Mesh" },
  { id: "RIYSA-RUH", from: "RIYSA", to: "RUH", base: 15, cable: "Global Mesh" },
  { id: "RIYSA-DXB", from: "RIYSA", to: "DXB", base: 15, cable: "Global Mesh" },
  {
    id: "KHASU-JUBSO",
    from: "KHASU",
    to: "JUBSO",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "KHASU-ASMER",
    from: "KHASU",
    to: "ASMER",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "KHASU-DXB", from: "KHASU", to: "DXB", base: 40, cable: "Global Mesh" },
  { id: "DAKSE-LON", from: "DAKSE", to: "LON", base: 59, cable: "Global Mesh" },
  { id: "SINSI-SIN", from: "SINSI", to: "SIN", base: 15, cable: "Global Mesh" },
  { id: "SINSI-CGK", from: "SINSI", to: "CGK", base: 15, cable: "Global Mesh" },
  {
    id: "KINSO-STAFA",
    from: "KINSO",
    to: "STAFA",
    base: 33,
    cable: "Global Mesh",
  },
  {
    id: "KINSO-MONUR",
    from: "KINSO",
    to: "MONUR",
    base: 43,
    cable: "Global Mesh",
  },
  { id: "KINSO-SAO", from: "KINSO", to: "SAO", base: 48, cable: "Global Mesh" },
  {
    id: "LONSV-HELFI",
    from: "LONSV",
    to: "HELFI",
    base: 22,
    cable: "Global Mesh",
  },
  {
    id: "LONSV-STOSW",
    from: "LONSV",
    to: "STOSW",
    base: 25,
    cable: "Global Mesh",
  },
  { id: "LONSV-FRA", from: "LONSV", to: "FRA", base: 45, cable: "Global Mesh" },
  {
    id: "HONSO-YARNA",
    from: "HONSO",
    to: "YARNA",
    base: 16,
    cable: "Global Mesh",
  },
  {
    id: "HONSO-PORVA",
    from: "HONSO",
    to: "PORVA",
    base: 16,
    cable: "Global Mesh",
  },
  { id: "HONSO-SYD", from: "HONSO", to: "SYD", base: 40, cable: "Global Mesh" },
  { id: "FRESI-LON", from: "FRESI", to: "LON", base: 66, cable: "Global Mesh" },
  { id: "SANEL-NYC", from: "SANEL", to: "NYC", base: 46, cable: "Global Mesh" },
  {
    id: "CITSA-VATVA",
    from: "CITSA",
    to: "VATVA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "CITSA-FRA", from: "CITSA", to: "FRA", base: 15, cable: "Global Mesh" },
  {
    id: "MOGSO-SANYE",
    from: "MOGSO",
    to: "SANYE",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "MOGSO-DJIDJ",
    from: "MOGSO",
    to: "DJIDJ",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "MOGSO-DXB", from: "MOGSO", to: "DXB", base: 24, cable: "Global Mesh" },
  {
    id: "SAISA-HAMBE",
    from: "SAISA",
    to: "HAMBE",
    base: 25,
    cable: "Global Mesh",
  },
  { id: "SAISA-NYC", from: "SAISA", to: "NYC", base: 28, cable: "Global Mesh" },
  {
    id: "BELSE-PODMO",
    from: "BELSE",
    to: "PODMO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BELSE-FRA", from: "BELSE", to: "FRA", base: 20, cable: "Global Mesh" },
  {
    id: "JUBSO-KAMUG",
    from: "JUBSO",
    to: "KAMUG",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "JUBSO-DXB", from: "JUBSO", to: "DXB", base: 46, cable: "Global Mesh" },
  {
    id: "SÃOSÃ-LIBGA",
    from: "SÃOSÃ",
    to: "LIBGA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "SÃOSÃ-JNB", from: "SÃOSÃ", to: "JNB", base: 51, cable: "Global Mesh" },
  { id: "PARSU-SAO", from: "PARSU", to: "SAO", base: 43, cable: "Global Mesh" },
  { id: "BRASL-FRA", from: "BRASL", to: "FRA", base: 16, cable: "Global Mesh" },
  { id: "LJUSL-FRA", from: "LJUSL", to: "FRA", base: 15, cable: "Global Mesh" },
  { id: "STOSW-STO", from: "STOSW", to: "STO", base: 15, cable: "Global Mesh" },
  { id: "STOSW-FRA", from: "STOSW", to: "FRA", base: 20, cable: "Global Mesh" },
  { id: "LOBES-JNB", from: "LOBES", to: "JNB", base: 15, cable: "Global Mesh" },
  { id: "PHISI-NYC", from: "PHISI", to: "NYC", base: 37, cable: "Global Mesh" },
  {
    id: "VICSE-MAMMA",
    from: "VICSE",
    to: "MAMMA",
    base: 20,
    cable: "Global Mesh",
  },
  {
    id: "VICSE-MORCO",
    from: "VICSE",
    to: "MORCO",
    base: 20,
    cable: "Global Mesh",
  },
  { id: "VICSE-DXB", from: "VICSE", to: "DXB", base: 44, cable: "Global Mesh" },
  {
    id: "DAMSY-RAMPA",
    from: "DAMSY",
    to: "RAMPA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "DAMSY-DXB", from: "DAMSY", to: "DXB", base: 29, cable: "Global Mesh" },
  { id: "COCTU-NYC", from: "COCTU", to: "NYC", base: 28, cable: "Global Mesh" },
  { id: "N'DCH-FRA", from: "N'DCH", to: "FRA", base: 54, cable: "Global Mesh" },
  { id: "LOMTO-LOS", from: "LOMTO", to: "LOS", base: 15, cable: "Global Mesh" },
  { id: "LOMTO-FRA", from: "LOMTO", to: "FRA", base: 64, cable: "Global Mesh" },
  { id: "BANTH-BKK", from: "BANTH", to: "BKK", base: 15, cable: "Global Mesh" },
  {
    id: "BANTH-PHNCA",
    from: "BANTH",
    to: "PHNCA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "BANTH-SIN", from: "BANTH", to: "SIN", base: 21, cable: "Global Mesh" },
  {
    id: "DUSTA-TASUZ",
    from: "DUSTA",
    to: "TASUZ",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "DUSTA-DXB", from: "DUSTA", to: "DXB", base: 31, cable: "Global Mesh" },
  {
    id: "FAKTO-APISA",
    from: "FAKTO",
    to: "APISA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "FAKTO-PAGAM",
    from: "FAKTO",
    to: "PAGAM",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "FAKTO-NYC",
    from: "FAKTO",
    to: "NYC",
    base: 164,
    cable: "Global Mesh",
  },
  {
    id: "ASHTU-TASUZ",
    from: "ASHTU",
    to: "TASUZ",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "ASHTU-KABAF",
    from: "ASHTU",
    to: "KABAF",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ASHTU-DXB", from: "ASHTU", to: "DXB", base: 23, cable: "Global Mesh" },
  {
    id: "DILTI-BANBR",
    from: "DILTI",
    to: "BANBR",
    base: 26,
    cable: "Global Mesh",
  },
  { id: "DILTI-SIN", from: "DILTI", to: "SIN", base: 36, cable: "Global Mesh" },
  {
    id: "NUKTO-MATWA",
    from: "NUKTO",
    to: "MATWA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "NUKTO-NYC",
    from: "NUKTO",
    to: "NYC",
    base: 176,
    cable: "Global Mesh",
  },
  {
    id: "PORTR-KINSA",
    from: "PORTR",
    to: "KINSA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "PORTR-NYC", from: "PORTR", to: "NYC", base: 48, cable: "Global Mesh" },
  { id: "TUNTU-FRA", from: "TUNTU", to: "FRA", base: 24, cable: "Global Mesh" },
  {
    id: "ANKTÜ-NICCY",
    from: "ANKTÜ",
    to: "NICCY",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "ANKTÜ-DAMSY",
    from: "ANKTÜ",
    to: "DAMSY",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ANKTÜ-DXB", from: "ANKTÜ", to: "DXB", base: 36, cable: "Global Mesh" },
  {
    id: "FUNTU-SUVFI",
    from: "FUNTU",
    to: "SUVFI",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "FUNTU-SOUKI",
    from: "FUNTU",
    to: "SOUKI",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "FUNTU-SYD", from: "FUNTU", to: "SYD", base: 55, cable: "Global Mesh" },
  {
    id: "TAITA-CITHO",
    from: "TAITA",
    to: "CITHO",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "TAITA-HKG", from: "TAITA", to: "HKG", base: 15, cable: "Global Mesh" },
  { id: "TAITA-TKY", from: "TAITA", to: "TKY", base: 33, cable: "Global Mesh" },
  { id: "DODTA-NBO", from: "DODTA", to: "NBO", base: 15, cable: "Global Mesh" },
  {
    id: "DODTA-GITBU",
    from: "DODTA",
    to: "GITBU",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "DODTA-JNB", from: "DODTA", to: "JNB", base: 32, cable: "Global Mesh" },
  { id: "KAMUG-JNB", from: "KAMUG", to: "JNB", base: 41, cable: "Global Mesh" },
  {
    id: "KYIUK-MINBE",
    from: "KYIUK",
    to: "MINBE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "KYIUK-FRA", from: "KYIUK", to: "FRA", base: 35, cable: "Global Mesh" },
  {
    id: "UNKUN-MAJMA",
    from: "UNKUN",
    to: "MAJMA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "UNKUN-PALMI",
    from: "UNKUN",
    to: "PALMI",
    base: 22,
    cable: "Global Mesh",
  },
  { id: "UNKUN-TKY", from: "UNKUN", to: "TKY", base: 47, cable: "Global Mesh" },
  { id: "MONUR-BUE", from: "MONUR", to: "BUE", base: 15, cable: "Global Mesh" },
  {
    id: "MONUR-BUEAR",
    from: "MONUR",
    to: "BUEAR",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "MONUR-SAO", from: "MONUR", to: "SAO", base: 19, cable: "Global Mesh" },
  { id: "WASUN-CHI", from: "WASUN", to: "CHI", base: 15, cable: "Global Mesh" },
  {
    id: "WASUN-MEXME",
    from: "WASUN",
    to: "MEXME",
    base: 23,
    cable: "Global Mesh",
  },
  { id: "WASUN-NYC", from: "WASUN", to: "NYC", base: 34, cable: "Global Mesh" },
  { id: "TASUZ-DXB", from: "TASUZ", to: "DXB", base: 27, cable: "Global Mesh" },
  { id: "VATVA-FRA", from: "VATVA", to: "FRA", base: 15, cable: "Global Mesh" },
  { id: "KINSA-NYC", from: "KINSA", to: "NYC", base: 45, cable: "Global Mesh" },
  {
    id: "CARVE-KRACA",
    from: "CARVE",
    to: "KRACA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "CARVE-WILCU",
    from: "CARVE",
    to: "WILCU",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "CARVE-NYC", from: "CARVE", to: "NYC", base: 50, cable: "Global Mesh" },
  {
    id: "ROABR-CHAUN",
    from: "ROABR",
    to: "CHAUN",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "ROABR-NYC", from: "ROABR", to: "NYC", base: 36, cable: "Global Mesh" },
  {
    id: "CHAUN-MARSA",
    from: "CHAUN",
    to: "MARSA",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "CHAUN-NYC", from: "CHAUN", to: "NYC", base: 36, cable: "Global Mesh" },
  { id: "HANVI-SIN", from: "HANVI", to: "SIN", base: 23, cable: "Global Mesh" },
  { id: "PORVA-SYD", from: "PORVA", to: "SYD", base: 35, cable: "Global Mesh" },
  {
    id: "MATWA-APISA",
    from: "MATWA",
    to: "APISA",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "MATWA-FAKTO",
    from: "MATWA",
    to: "FAKTO",
    base: 15,
    cable: "Global Mesh",
  },
  {
    id: "MATWA-NYC",
    from: "MATWA",
    to: "NYC",
    base: 173,
    cable: "Global Mesh",
  },
  {
    id: "APISA-NYC",
    from: "APISA",
    to: "NYC",
    base: 168,
    cable: "Global Mesh",
  },
  {
    id: "SANYE-DJIDJ",
    from: "SANYE",
    to: "DJIDJ",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "SANYE-DXB", from: "SANYE", to: "DXB", base: 18, cable: "Global Mesh" },
  {
    id: "PRESO-MASLE",
    from: "PRESO",
    to: "MASLE",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "PRESO-JNB", from: "PRESO", to: "JNB", base: 15, cable: "Global Mesh" },
  {
    id: "LUSZA-HARZI",
    from: "LUSZA",
    to: "HARZI",
    base: 15,
    cable: "Global Mesh",
  },
  { id: "LUSZA-JNB", from: "LUSZA", to: "JNB", base: 17, cable: "Global Mesh" },
  { id: "HARZI-JNB", from: "HARZI", to: "JNB", base: 15, cable: "Global Mesh" },
  { id: "LAX-MEXME", from: "LAX", to: "MEXME", base: 29, cable: "Global Mesh" },
  { id: "SEA-WASUN", from: "SEA", to: "WASUN", base: 40, cable: "Global Mesh" },
  { id: "SEA-NYC", from: "SEA", to: "NYC", base: 73, cable: "Global Mesh" },
  { id: "CHI-YTO", from: "CHI", to: "YTO", base: 15, cable: "Global Mesh" },
  { id: "MIA-HAVCU", from: "MIA", to: "HAVCU", base: 15, cable: "Global Mesh" },
  { id: "AMS-FRA", from: "AMS", to: "FRA", base: 15, cable: "Global Mesh" },
  { id: "PAR-BRUBE", from: "PAR", to: "BRUBE", base: 15, cable: "Global Mesh" },
  { id: "MOS-KYIUK", from: "MOS", to: "KYIUK", base: 15, cable: "Global Mesh" },
  { id: "MOS-MINBE", from: "MOS", to: "MINBE", base: 15, cable: "Global Mesh" },
  { id: "MUM-ISLPA", from: "MUM", to: "ISLPA", base: 16, cable: "Global Mesh" },
  { id: "BEI-PYONO", from: "BEI", to: "PYONO", base: 15, cable: "Global Mesh" },
  { id: "BEI-SEO", from: "BEI", to: "SEO", base: 16, cable: "Global Mesh" },
  { id: "BEI-TKY", from: "BEI", to: "TKY", base: 35, cable: "Global Mesh" },
  { id: "MEX-GUAGU", from: "MEX", to: "GUAGU", base: 15, cable: "Global Mesh" },
  { id: "MEX-NYC", from: "MEX", to: "NYC", base: 49, cable: "Global Mesh" },
  { id: "SCL-SAO", from: "SCL", to: "SAO", base: 38, cable: "Global Mesh" },
  { id: "CAI-JERIS", from: "CAI", to: "JERIS", base: 15, cable: "Global Mesh" },
  { id: "CAI-DXB", from: "CAI", to: "DXB", base: 36, cable: "Global Mesh" },
  { id: "LOS-JNB", from: "LOS", to: "JNB", base: 61, cable: "Global Mesh" },
  { id: "IST-SOFBU", from: "IST", to: "SOFBU", base: 15, cable: "Global Mesh" },
  { id: "IST-CHIMO", from: "IST", to: "CHIMO", base: 15, cable: "Global Mesh" },
  { id: "MAD-LISPO", from: "MAD", to: "LISPO", base: 15, cable: "Global Mesh" },
  { id: "MAD-LON", from: "MAD", to: "LON", base: 17, cable: "Global Mesh" },
  { id: "WAW-BRASL", from: "WAW", to: "BRASL", base: 15, cable: "Global Mesh" },
  { id: "STO-FRA", from: "STO", to: "FRA", base: 19, cable: "Global Mesh" },
  { id: "RUH-MANBA", from: "RUH", to: "MANBA", base: 15, cable: "Global Mesh" },
  { id: "MNL-TAITA", from: "MNL", to: "TAITA", base: 15, cable: "Global Mesh" },
  { id: "MNL-SIN", from: "MNL", to: "SIN", base: 32, cable: "Global Mesh" },
  { id: "NYC-LON", from: "NYC", to: "LON", base: 72, cable: "TAT-14" },
  { id: "NYC-AMS", from: "NYC", to: "AMS", base: 78, cable: "AEConnect-1" },
  { id: "NYC-FRA", from: "NYC", to: "FRA", base: 85, cable: "Hibernia" },
  { id: "NYC-LAX", from: "NYC", to: "LAX", base: 65, cable: "Terrestrial" },
  { id: "NYC-CHI", from: "NYC", to: "CHI", base: 18, cable: "Terrestrial" },
  { id: "NYC-MIA", from: "NYC", to: "MIA", base: 28, cable: "Terrestrial" },
  { id: "LAX-SEA", from: "LAX", to: "SEA", base: 12, cable: "Terrestrial" },
  { id: "LAX-CHI", from: "LAX", to: "CHI", base: 45, cable: "Terrestrial" },
  { id: "LAX-TKY", from: "LAX", to: "TKY", base: 108, cable: "FASTER" },
  { id: "LAX-SIN", from: "LAX", to: "SIN", base: 155, cable: "SEA-ME-WE-4" },
  { id: "SEA-TKY", from: "SEA", to: "TKY", base: 100, cable: "Northern-Cross" },
  { id: "NYC-SAO", from: "NYC", to: "SAO", base: 110, cable: "MONET" },
  { id: "LON-AMS", from: "LON", to: "AMS", base: 8, cable: "Zeeland" },
  { id: "LON-FRA", from: "LON", to: "FRA", base: 12, cable: "Terrestrial" },
  { id: "LON-PAR", from: "LON", to: "PAR", base: 10, cable: "Terrestrial" },
  { id: "LON-MOS", from: "LON", to: "MOS", base: 55, cable: "Terrestrial" },
  { id: "LON-JNB", from: "LON", to: "JNB", base: 98, cable: "SAT-3" },
  { id: "FRA-MOS", from: "FRA", to: "MOS", base: 38, cable: "Terrestrial" },
  { id: "AMS-PAR", from: "AMS", to: "PAR", base: 9, cable: "Terrestrial" },
  { id: "FRA-DXB", from: "FRA", to: "DXB", base: 65, cable: "FLAG" },
  { id: "DXB-MUM", from: "DXB", to: "MUM", base: 25, cable: "SMW-4" },
  { id: "DXB-JNB", from: "DXB", to: "JNB", base: 48, cable: "EIG" },
  { id: "MOS-DXB", from: "MOS", to: "DXB", base: 55, cable: "Terrestrial" },
  { id: "MUM-SIN", from: "MUM", to: "SIN", base: 65, cable: "SEA-ME-WE-5" },
  { id: "SIN-HKG", from: "SIN", to: "HKG", base: 30, cable: "AAG" },
  { id: "SIN-SYD", from: "SIN", to: "SYD", base: 95, cable: "Indigo-West" },
  { id: "HKG-TKY", from: "HKG", to: "TKY", base: 40, cable: "APCN-2" },
  { id: "HKG-BEI", from: "HKG", to: "BEI", base: 28, cable: "Terrestrial" },
  { id: "HKG-SEO", from: "HKG", to: "SEO", base: 35, cable: "RJCN" },
  { id: "TKY-SEO", from: "TKY", to: "SEO", base: 30, cable: "KJCN" },
  { id: "YTO-NYC", from: "YTO", to: "NYC", base: 12, cable: "Terrestrial" },
  { id: "MEX-LAX", from: "MEX", to: "LAX", base: 25, cable: "Terrestrial" },
  { id: "BUE-SAO", from: "BUE", to: "SAO", base: 35, cable: "Terrestrial" },
  { id: "SCL-BUE", from: "SCL", to: "BUE", base: 20, cable: "Terrestrial" },
  { id: "CAI-FRA", from: "CAI", to: "FRA", base: 55, cable: "SeaMeWe" },
  { id: "LOS-LON", from: "LOS", to: "LON", base: 90, cable: "MainOne" },
  { id: "NBO-JNB", from: "NBO", to: "JNB", base: 45, cable: "Terrestrial" },
  { id: "IST-FRA", from: "IST", to: "FRA", base: 35, cable: "Terrestrial" },
  { id: "MAD-PAR", from: "MAD", to: "PAR", base: 15, cable: "Terrestrial" },
  { id: "MIL-FRA", from: "MIL", to: "FRA", base: 12, cable: "Terrestrial" },
  { id: "WAW-FRA", from: "WAW", to: "FRA", base: 18, cable: "Terrestrial" },
  { id: "STO-AMS", from: "STO", to: "AMS", base: 20, cable: "Terrestrial" },
  { id: "RUH-DXB", from: "RUH", to: "DXB", base: 15, cable: "Terrestrial" },
  { id: "BKK-SIN", from: "BKK", to: "SIN", base: 25, cable: "Terrestrial" },
  { id: "CGK-SIN", from: "CGK", to: "SIN", base: 15, cable: "Terrestrial" },
  { id: "MNL-HKG", from: "MNL", to: "HKG", base: 22, cable: "EAC" },
  { id: "AKL-SYD", from: "AKL", to: "SYD", base: 35, cable: "Tasman" },
];
const ROUTE_MAP = Object.fromEntries(ROUTES.map((r) => [r.id, r]));

// Real-world AS path data for major routes
const AS_PATHS = {
  "NYC-LON": ["AS6939", "AS1273", "AS5459", "LINX"],
  "NYC-AMS": ["AS6939", "AS3356", "AS1200", "AMS-IX"],
  "NYC-FRA": ["AS6939", "AS3356", "AS3356", "DE-CIX"],
  "LAX-TKY": ["AS1257", "AS2914", "AS2497", "JPIX"],
  "LAX-SIN": ["AS1257", "AS3491", "AS7473", "SGIX"],
  "SIN-HKG": ["AS7473", "AS4637", "AS4637", "HKIX"],
  "HKG-TKY": ["AS4637", "AS2914", "AS2497", "JPIX"],
  "NYC-SAO": ["AS6939", "AS28573", "AS28573", "PTT-Metro"],
  "MUM-SIN": ["AS9498", "AS4755", "AS7473", "SGIX"],
  "FRA-DXB": ["AS3356", "AS5384", "AS5384", "UAE-IX"],
  "LON-MOS": ["AS5459", "AS1273", "AS8359", "MSK-IX"],
};

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

function ll2v3(lat, lon, r) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

function buildArcPoints(n1, n2, segs = 80) {
  const v1 = ll2v3(n1.lat, n1.lon, R);
  const v2 = ll2v3(n2.lat, n2.lon, R);
  const pts = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const v = new THREE.Vector3().lerpVectors(v1, v2, t).normalize();
    const h = Math.sin(Math.PI * t) * ARC_H;
    pts.push(v.multiplyScalar(R + h));
  }
  return pts;
}

// EWMA-based anomaly detection (α = 0.3)
const ALPHA = 0.3;
const ANOMALY_Z_THRESHOLD = 2.0;
const ENABLE_SIM_FALLBACK = false;
function ewmaUpdate(prev, cur) {
  return ALPHA * cur + (1 - ALPHA) * prev;
}
function stdDev(arr) {
  const m = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
}

function latHex(ms) {
  if (ms < 50) return 0x00e5cc;
  if (ms < 100) return 0x84cc16;
  if (ms < 150) return 0xf59e0b;
  return 0xef4444;
}
function latStr(ms) {
  if (ms < 50) return "#00e5cc";
  if (ms < 100) return "#84cc16";
  if (ms < 150) return "#f59e0b";
  return "#ef4444";
}
function latLabel(ms) {
  if (ms < 50) return "EXCELLENT";
  if (ms < 100) return "GOOD";
  if (ms < 150) return "DEGRADED";
  return "HIGH";
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function AppNormal() {
  const mountRef = useRef(null);
  const rendRef = useRef(null);
  const sceneRef = useRef(null);
  const camRef = useRef(null);
  const globeRef = useRef(null); // rotating group
  const arcMeshes = useRef({}); // routeId → THREE.Line
  const arcPts = useRef({}); // routeId → Vector3[]
  const packetPool = useRef([]); // live packet objects
  const animRef = useRef(null);
  const latRef = useRef(Object.fromEntries(ROUTES.map((r) => [r.id, r.base])));
  const ewmaRef = useRef(Object.fromEntries(ROUTES.map((r) => [r.id, r.base])));
  const histRef = useRef(
    Object.fromEntries(ROUTES.map((r) => [r.id, [r.base, r.base, r.base]])),
  );
  const totalRef = useRef(0);
  const anomCntRef = useRef(0);
  const dragging = useRef(false);
  const prevMX = useRef({ x: 0, y: 0 });
  const autoRot = useRef(false);
  const globalAutoRot = useRef(false);
  const targetCamZ = useRef(null);
  const targetRot = useRef(null);
  const topoScript = useRef(null);



  const [lats, setLats] = useState(
    Object.fromEntries(ROUTES.map((r) => [r.id, r.base])),
  );
  const [bgpFeed, setBgpFeed] = useState([]);
  const [anomSet, setAnomSet] = useState(new Set());
  const [routeAsPaths, setRouteAsPaths] = useState({});
  const [stats, setStats] = useState({ total: 0, anom: 0, avg: 75, active: 0 });
  const [selRoute, setSelRoute] = useState(null);
  const [selNode, setSelNode] = useState(null);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [clock, setClock] = useState("");
  const [wsState, setWsState] = useState("CONNECTING");
  const [dataMode, setDataMode] = useState("DISCONNECTED");
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const tooltipRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef(null);
  const searchTermRef = useRef("");
  const ignoreSearchChangeRef = useRef(false);
  useEffect(() => {
    searchTermRef.current = searchTerm;
  }, [searchTerm]);
  const [searchResults, setSearchResults] = useState([]);
  const [mobileViewMode, setMobileViewMode] = useState("hidden");

  // ── THREE.JS SETUP ───────────────────────────────────────────────────
  useEffect(() => {
    const el = mountRef.current;
    const W = el.clientWidth,
      H = el.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x010b10);
    el.appendChild(renderer.domElement);
    rendRef.current = renderer;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 500);
    camera.position.z = W < H ? 26 : 14;
    camRef.current = camera;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.12));
    const sun = new THREE.DirectionalLight(0xffffff, 2.0);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x00e5cc, 0.35);
    rim.position.set(-18, 0, -8);
    scene.add(rim);

    const updateSunPosition = () => {
      const now = new Date();
      const start = new Date(now.getUTCFullYear(), 0, 0);
      const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));

      // Solar declination (approximate)
      const declination =
        -23.44 * Math.cos((360 / 365) * (dayOfYear + 10) * (Math.PI / 180));

      // Sun longitude based on UTC time
      const utcHours =
        now.getUTCHours() +
        now.getUTCMinutes() / 60 +
        now.getUTCSeconds() / 3600;
      const sunLon = (12 - utcHours) * 15;

      const sunPos = ll2v3(declination, sunLon, 30);
      sun.position.copy(sunPos);
    };



    // ── Globe group ──
    const globe = new THREE.Group();
    scene.add(globe);
    globeRef.current = globe;

    const textureLoader = new THREE.TextureLoader();
    const earthMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
    const bumpMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png');
    const specularMap = textureLoader.load('https://unpkg.com/three-globe/example/img/earth-water.png');
    const starsGroup = new THREE.Group();
    const starSizes = [1.2, 2.0, 3.0]; 
    const starCounts = [10000, 3000, 1000]; 

    starSizes.forEach((size, index) => {
      const geometry = new THREE.BufferGeometry();
      const count = starCounts[index];
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const color = new THREE.Color();
      for (let i = 0; i < count; i++) {
        const r = 150 + Math.random() * 50; 
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        const temp = Math.random();
        if (temp < 0.2) color.setHSL(0.6, 0.8, 0.8); // pale blue
        else if (temp < 0.4) color.setHSL(0.1, 0.8, 0.8); // pale orange
        else color.setHSL(0, 0, 1); // white

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const material = new THREE.PointsMaterial({
        size: size,
        transparent: true,
        opacity: Math.random() * 0.3 + 0.7,
        sizeAttenuation: false,
        vertexColors: true
      });
      starsGroup.add(new THREE.Points(geometry, material));
    });
    globe.add(starsGroup);

    // Earth core
    globe.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(R, 64, 64),
        new THREE.MeshPhongMaterial({
          map: earthMap,
          bumpMap: bumpMap,
          bumpScale: 0.15,
          specularMap: specularMap,
          specular: new THREE.Color('grey'),
          shininess: 35,
        })
      )
    );

    // Atmosphere
    globe.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(ATMO, 32, 32),
        new THREE.MeshPhongMaterial({
          color: 0x004060,
          emissive: 0x001525,
          transparent: true,
          opacity: 0.15,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.FrontSide,
        }),
      ),
    );

    // Subtle glow shell
    globe.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(R + 0.04, 32, 32),
        new THREE.MeshBasicMaterial({
          color: 0x00e5cc,
          transparent: true,
          opacity: 0.03,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      ),
    );

    // ── Pre-build arc point cache & arc meshes ──
    const arcGroup = new THREE.Group();
    globe.add(arcGroup);
    ROUTES.forEach((route) => {
      const n1 = NODE_MAP[route.from],
        n2 = NODE_MAP[route.to];
      const pts = buildArcPoints(n1, n2);
      arcPts.current[route.id] = pts;

      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: latHex(route.base),
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geo, mat);
      arcGroup.add(line);
      arcMeshes.current[route.id] = line;
    });

    // ── Packet group ──
    const pktGroup = new THREE.Group();
    globe.add(pktGroup);

    // ── Node markers ──
    const nodeGroup = new THREE.Group();
    globe.add(nodeGroup);
    NODES.forEach((n) => {
      const pos = ll2v3(n.lat, n.lon, R);
      // Pulse halo
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 8, 8),
        new THREE.MeshBasicMaterial({
          color: 0x00e5cc,
          transparent: true,
          opacity: 0.25,
          blending: THREE.AdditiveBlending,
        }),
      );
      halo.position.copy(pos);
      halo.userData.phase = Math.random() * Math.PI * 2;
      halo.userData.isHalo = true;
      halo.userData.nodeId = n.id;
      nodeGroup.add(halo);
      // Core
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xe0fffc }),
      );
      core.position.copy(pos);
      core.userData.nodeId = n.id;
      nodeGroup.add(core);
    });

    // ── Load topojson country borders ──
    const loadBorders = (world) => {
      if (!world || !window.topojson) return;
      try {
        const borders = window.topojson.mesh(
          world,
          world.objects.countries,
          (a, b) => a !== b,
        );
        const positions = [];
        borders.coordinates.forEach((ring) => {
          for (let i = 0; i < ring.length - 1; i++) {
            const [lo1, la1] = ring[i],
              [lo2, la2] = ring[i + 1];
            const v1 = ll2v3(la1, lo1, R + 0.015),
              v2 = ll2v3(la2, lo2, R + 0.015);
            positions.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
          }
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3),
        );
        globe.add(
          new THREE.LineSegments(
            geo,
            new THREE.LineBasicMaterial({
              color: 0x388299,
              transparent: true,
              opacity: 0.85,
            }),
          ),
        );
      } catch (e) {}
    };
    const ts = document.createElement("script");
    ts.src =
      "https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js";
    ts.onload = () =>
      fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
        .then((r) => r.json())
        .then(loadBorders)
        .catch(() => {});
    document.head.appendChild(ts);
    topoScript.current = ts;

    // ── Mouse interaction ──
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let currentHover = null;
    let pointerDownOnCanvas = false;

    const onDown = (e) => {
      if (!e.isPrimary) return;
      pointerDownOnCanvas = true;
      dragging.current = true;
      autoRot.current = false;
      targetRot.current = null;
      prevMX.current = { x: e.clientX, y: e.clientY };
      if (currentHover) {
        currentHover = null;
        setHoveredNodeId(null);
      }
    };
    const onMove = (e) => {
      if (dragging.current && e.isPrimary) {
        const dx = e.clientX - prevMX.current.x,
          dy = e.clientY - prevMX.current.y;
        globe.rotation.y += dx * 0.005;
        globe.rotation.x = Math.max(
          -1.1,
          Math.min(1.1, globe.rotation.x + dy * 0.003),
        );
        prevMX.current = { x: e.clientX, y: e.clientY };
        return;
      }

      if (!el.contains(e.target)) {
        if (currentHover) {
          currentHover = null;
          setHoveredNodeId(null);
        }
        return;
      }

      mousePosRef.current = { x: e.clientX, y: e.clientY };
      const rect = el.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeGroup.children);

      let foundNode = null;
      for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.userData.nodeId) {
          foundNode = intersects[i].object.userData.nodeId;
          break;
        }
      }

      if (foundNode !== currentHover) {
        currentHover = foundNode;
        setHoveredNodeId(foundNode);
      }

      if (tooltipRef.current && foundNode) {
        tooltipRef.current.style.left = e.clientX + 15 + "px";
        tooltipRef.current.style.top = e.clientY + 15 + "px";
      }
    };
    const onUp = (e) => {
      dragging.current = false;
      setTimeout(() => {
        if (globalAutoRot.current) autoRot.current = true;
      }, 2500);
      if (!pointerDownOnCanvas) return;
      pointerDownOnCanvas = false;
      if (e && e.isPrimary) {
        const dx = e.clientX - prevMX.current.x;
        const dy = e.clientY - prevMX.current.y;
        if (Math.hypot(dx, dy) < 5) {
          const rect = el.getBoundingClientRect();
          mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(nodeGroup.children);
          let found = false;
          for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.userData.nodeId) {
              window.dispatchEvent(new CustomEvent("globe-node-click", { detail: intersects[i].object.userData.nodeId }));
              found = true;
              break;
            }
          }
          if (!found) {
            window.dispatchEvent(new CustomEvent("globe-bg-click"));
          }
        }
      }
    };
    const onWheel = (e) => {
      targetCamZ.current = null;
      camera.position.z = Math.max(
        8,
        Math.min(35, camera.position.z + e.deltaY * 0.018),
      );
    };
    const onResize = () => {
      const W = el.clientWidth,
        H = el.clientHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", onResize);

    let initialPinchDist = null;
    let initialCamZ = null;
    const onTouchStart = (e) => {
      targetCamZ.current = null;
      targetRot.current = null;
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDist = Math.hypot(dx, dy);
        initialCamZ = camera.position.z;
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 2 && initialPinchDist) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const scale = initialPinchDist / dist;
        camera.position.z = Math.max(8, Math.min(35, initialCamZ * scale));
      }
    };
    const onTouchEnd = (e) => {
      if (e.touches.length < 2) initialPinchDist = null;
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    // ── Animation loop ──
    let last = 0;
    const animate = (ts) => {
      animRef.current = requestAnimationFrame(animate);
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;

      if (targetCamZ.current !== null) {
        camera.position.z += (targetCamZ.current - camera.position.z) * Math.min(1, dt * 5);
        if (Math.abs(camera.position.z - targetCamZ.current) < 0.05) {
          camera.position.z = targetCamZ.current;
          targetCamZ.current = null;
        }
      }

      if (targetRot.current !== null) {
        let dy = targetRot.current.y - globe.rotation.y;
        while (dy > Math.PI) dy -= Math.PI * 2;
        while (dy < -Math.PI) dy += Math.PI * 2;
        
        globe.rotation.y += dy * Math.min(1, dt * 5);
        globe.rotation.x += (targetRot.current.x - globe.rotation.x) * Math.min(1, dt * 5);
        
        if (Math.abs(dy) < 0.01 && Math.abs(targetRot.current.x - globe.rotation.x) < 0.01) {
          globe.rotation.y = targetRot.current.y;
          globe.rotation.x = targetRot.current.x;
          targetRot.current = null;
        }
      } else if (autoRot.current) {
        globe.rotation.y += 0.0012;
      }

      updateSunPosition();

      // Pulse node halos & Handle Search Highlight
      const q = searchTermRef.current
        ? searchTermRef.current.toLowerCase()
        : "";
      nodeGroup.children.forEach((m) => {
        const n = NODE_MAP[m.userData.nodeId];
        const isMatch =
          q &&
          n &&
          (n.name.toLowerCase().includes(q) ||
            (n.country && n.country.toLowerCase().includes(q)) ||
            n.id.toLowerCase().includes(q));

        if (m.userData.isHalo) {
          m.userData.phase += dt * 2.2;
          let baseOpacity = 0.1 + Math.sin(m.userData.phase) * 0.12;
          let s = 1 + Math.sin(m.userData.phase * 0.7) * 0.55;

          if (isMatch) {
            s *= 2.5; // Massive halo for searched node
            m.material.color.setHex(0xff00ff);
            m.material.opacity = baseOpacity * 2;
          } else {
            m.material.color.setHex(0x00e5cc);
            m.material.opacity = q ? baseOpacity * 0.2 : baseOpacity; // Dim if searching but not match
          }
          m.scale.setScalar(s);
        } else if (m.userData.nodeId) {
          if (isMatch) {
            m.scale.setScalar(4.0 + Math.sin(ts / 100) * 1.0); // Pulse big
            m.material.color.setHex(0xffffff); // Core turns bright white
          } else {
            m.scale.setScalar(1.0);
            m.material.color.setHex(0xe0fffc); // Original color
            if (q) {
              m.material.color.setHex(0x0a2f42); // Dim non-matches
            }
          }
        }
      });

      // Spawn packets
      if (Math.random() < dt * 14) {
        const route = ROUTES[Math.floor(Math.random() * ROUTES.length)];
        const pts = arcPts.current[route.id];
        const lat = latRef.current[route.id] || route.base;
        const geo = new THREE.SphereGeometry(0.05, 5, 5);
        const mat = new THREE.MeshBasicMaterial({
          color: latHex(lat),
          transparent: true,
          opacity: 0.92,
          blending: THREE.AdditiveBlending,
        });
        const mesh = new THREE.Mesh(geo, mat);
        pktGroup.add(mesh);
        totalRef.current++;
        packetPool.current.push({
          routeId: route.id,
          progress: 0,
          speed: 0.09 + Math.random() * 0.17,
          mesh,
          pts,
        });
      }

      // Move packets
      packetPool.current = packetPool.current.filter((p) => {
        p.progress += p.speed * dt;
        if (p.progress >= 1) {
          pktGroup.remove(p.mesh);
          p.mesh.geometry.dispose();
          p.mesh.material.dispose();
          return false;
        }
        const rawIdx = p.progress * (p.pts.length - 1);
        const i = Math.min(Math.floor(rawIdx), p.pts.length - 2);
        const t = rawIdx - i;
        p.mesh.position.lerpVectors(p.pts[i], p.pts[i + 1], t);
        return true;
      });

      renderer.render(scene, camera);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      if (ts.parentNode) document.head.removeChild(ts);
    };
  }, []);

  // ── DATA LAYER: Backend WebSocket (/ws) + fallback simulation ─────────
  useEffect(() => {
    let backendWs = null;
    let wsRetryTimer = null;
    let driftTimer = null;
    let isUnmounted = false;

    const startFallbackSimulation = () => {
      if (driftTimer) return;
      setDataMode("SIMULATED");
      driftTimer = setInterval(() => {
        const newLat = {};
        let total = 0;
        ROUTES.forEach((r) => {
          const cur = latRef.current[r.id] || r.base;
          const ewma = ewmaUpdate(ewmaRef.current[r.id] || r.base, cur);
          ewmaRef.current[r.id] = ewma;
          const noised = Math.max(
            5,
            Math.round(ewma * (0.88 + Math.random() * 0.24)),
          );
          newLat[r.id] = noised;
          total += noised;

          const mesh = arcMeshes.current[r.id];
          if (mesh && mesh.material.color.getHex() !== 0xff2244) {
            mesh.material.color.setHex(latHex(noised));
          }
          packetPool.current.forEach((p) => {
            if (p.routeId === r.id)
              p.mesh.material.color.setHex(latHex(noised));
          });
          histRef.current[r.id] = [...histRef.current[r.id].slice(-19), noised];
        });
        latRef.current = { ...latRef.current, ...newLat };
        setLats((prev) => ({ ...prev, ...newLat }));
        setStats({
          total: totalRef.current,
          anom: anomCntRef.current,
          avg: Math.round(total / ROUTES.length),
          active: packetPool.current.length,
        });
      }, 2000);
    };

    const stopFallbackSimulation = () => {
      if (!driftTimer) return;
      clearInterval(driftTimer);
      driftTimer = null;
    };

    const handleBackendMessage = (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.data);
      } catch (_) {
        return;
      }

      if (msg.type === "init") {
        const seed = {};
        (msg.routes || []).forEach((route) => {
          seed[route.id] = route.current ?? route.base;
          latRef.current[route.id] = seed[route.id];
          ewmaRef.current[route.id] = route.ewma ?? route.base;
          histRef.current[route.id] = [
            ...(histRef.current[route.id] || []),
            seed[route.id],
          ].slice(-20);
        });
        if (Object.keys(seed).length) setLats((prev) => ({ ...prev, ...seed }));
        return;
      }

      if (msg.type === "latency_update") {
        const payload = msg.latencies || {};
        const newLat = {};
        let total = 0;
        Object.entries(payload).forEach(([routeId, rec]) => {
          const latency = rec.latency ?? ROUTE_MAP[routeId]?.base;
          const ewma = rec.ewma ?? latency;
          if (typeof latency !== "number") return;
          newLat[routeId] = latency;
          total += latency;
          latRef.current[routeId] = latency;
          ewmaRef.current[routeId] = ewma;
          histRef.current[routeId] = [
            ...(histRef.current[routeId] || []),
            latency,
          ].slice(-20);

          const mesh = arcMeshes.current[routeId];
          if (mesh && !msg.anomalies?.includes(routeId)) {
            mesh.material.color.setHex(latHex(latency));
            mesh.material.opacity = 0.32;
          }
        });

        if (Object.keys(newLat).length) {
          setLats((prev) => ({ ...prev, ...newLat }));
          setStats({
            total: totalRef.current,
            anom: anomCntRef.current,
            avg: Math.round(total / Object.keys(newLat).length),
            active: packetPool.current.length,
          });
        }
        setAnomSet(new Set(msg.anomalies || []));
        if (msg.source === "ripe_atlas") {
          setDataMode("BACKEND_RIPE_ATLAS");
        } else if (msg.source === "stale_hold") {
          setDataMode("BACKEND_STALE_HOLD");
        } else {
          setDataMode("BACKEND_SIMULATED");
        }
        return;
      }

      if (msg.type === "latency_source_status") {
        if (msg.status === "unavailable") {
          setDataMode("BACKEND_UNAVAILABLE");
        }
        return;
      }

      if (msg.type === "bgp_event" && msg.event) {
        console.log("GOT BGP EVENT FRONTEND:", msg.event);
        const event = msg.event;
        setBgpFeed((prev) =>
          [
            {
              id: Date.now() + Math.random(),
              ts: event.ts
                ? event.ts.slice(11, 19)
                : new Date().toISOString().slice(11, 19),
              peer: event.peer || "?",
              peerAsn: event.peer_asn || "AS?",
              asPath: event.as_path || "",
              prefixes: event.prefixes || "",
              type: event.type || "UPDATE",
            },
            ...prev,
          ].slice(0, 18),
        );
        return;
      }

      if (msg.type === "traceroute_path" && msg.path && msg.route_id) {
        let curvePts = [];
        if (msg.path.length >= 2) {
          for (let i = 0; i < msg.path.length - 1; i++) {
            const segPts = buildArcPoints(
              { lat: msg.path[i].lat, lon: msg.path[i].lon },
              { lat: msg.path[i + 1].lat, lon: msg.path[i + 1].lon },
              30,
            );
            curvePts.push(...segPts);
          }
        }

        if (curvePts.length > 0) {
          const geo = new THREE.SphereGeometry(0.08, 6, 6);
          const mat = new THREE.MeshBasicMaterial({
            color: 0xffaaff,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
          });
          const mesh = new THREE.Mesh(geo, mat);
          pktGroup.add(mesh);
          packetPool.current.push({
            routeId: msg.route_id,
            progress: 0,
            speed: 0.08,
            mesh,
            pts: curvePts,
          });
        }
        return;
      }

      if (msg.type === "route_change" && msg.route_id) {
        triggerAnomaly(msg.route_id, msg.latency, true);
        const asPath = msg.bgp_event?.as_path;
        if (asPath) {
          setRouteAsPaths((prev) => ({ ...prev, [msg.route_id]: asPath }));
        }
      }
    };

    const connectWithUrl = (url, onExhausted) => {
      try {
        backendWs = new WebSocket(url);
      } catch (_) {
        onExhausted();
        return;
      }

      backendWs.onopen = () => {
        setWsState("LIVE");
        stopFallbackSimulation();
        setDataMode("BACKEND_CONNECTED");
      };
      backendWs.onmessage = handleBackendMessage;
      backendWs.onerror = () => setWsState("ERROR");
      backendWs.onclose = () => {
        if (isUnmounted) return;
        onExhausted();
      };
    };

    const connectBackend = () => {
      const scheme = window.location.protocol === "https:" ? "wss" : "ws";
      const candidates = [];
      if (import.meta.env.VITE_BACKEND_WS_URL) {
        candidates.push(import.meta.env.VITE_BACKEND_WS_URL);
      } else {
        candidates.push(`${scheme}://${window.location.host}/ws`);
        candidates.push(`${scheme}://localhost:8001/ws`);
      }
      setWsState("CONNECTING");

      let idx = 0;
      const tryNext = () => {
        if (idx < candidates.length) {
          const url = candidates[idx++];
          connectWithUrl(url, tryNext);
          return;
        }
        setWsState("RECONNECTING");
        if (ENABLE_SIM_FALLBACK) startFallbackSimulation();
        else setDataMode("DISCONNECTED");
        wsRetryTimer = setTimeout(connectBackend, 5000);
      };
      tryNext();
    };
    connectBackend();
    if (ENABLE_SIM_FALLBACK) startFallbackSimulation();

    return () => {
      isUnmounted = true;
      stopFallbackSimulation();
      clearTimeout(wsRetryTimer);
      if (backendWs) backendWs.close();
    };
  }, []);

  // Anomaly trigger (EWMA-based: spike > 2σ from history baseline)
  const triggerAnomaly = (routeId, forcedLatency = null, force = false) => {
    const hist = histRef.current[routeId] || [];
    const sd = stdDev(hist);
    const spike =
      forcedLatency ??
      Math.round(
        (latRef.current[routeId] || ROUTE_MAP[routeId].base) *
          (2.5 + Math.random() * 2),
      );
    latRef.current[routeId] = spike;
    setLats((prev) => ({ ...prev, [routeId]: spike }));

    // Only flag if statistically significant (z-score > 2)
    const base = hist.reduce((a, b) => a + b, 0) / (hist.length || 1);
    const z = (spike - base) / (sd || 10);
    if (!force && z < ANOMALY_Z_THRESHOLD) return;

    anomCntRef.current++;
    const mesh = arcMeshes.current[routeId];
    if (mesh) {
      mesh.material.color.setHex(0xff2244);
      mesh.material.opacity = 0.85;
    }

    setAnomSet((p) => new Set([...p, routeId]));

    const recovery = 7000 + Math.random() * 10000;
    setTimeout(() => {
      latRef.current[routeId] =
        ROUTE_MAP[routeId].base * (0.92 + Math.random() * 0.16);
      setAnomSet((p) => {
        const n = new Set(p);
        n.delete(routeId);
        return n;
      });
      if (mesh) {
        mesh.material.color.setHex(latHex(latRef.current[routeId]));
        mesh.material.opacity = 0.32;
      }
    }, recovery);
  };


  useEffect(() => {
    const t = setInterval(
      () => setClock(new Date().toUTCString().slice(0, -4)),
      1000,
    );
    return () => clearInterval(t);
  }, []);

  const sortedRoutes = Object.entries(lats).sort((a, b) => b[1] - a[1]);
  const avgLat = Math.round(
    Object.values(lats).reduce((a, b) => a + b, 0) /
      Object.values(lats).length || 0,
  );
  const selRouteData = selRoute ? ROUTE_MAP[selRoute] : null;

  useEffect(() => {
    searchTermRef.current = searchTerm;
    if (ignoreSearchChangeRef.current) {
      ignoreSearchChangeRef.current = false;
      return;
    }
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    const q = searchTerm.toLowerCase();
    setSearchResults(
      NODES.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          (n.country && n.country.toLowerCase().includes(q)) ||
          n.id.toLowerCase().includes(q),
      ).slice(0, 8),
    );
  }, [searchTerm]);

  useEffect(() => {
    const handleNodeClick = (e) => {
      const nodeId = e.detail;
      const node = NODE_MAP[nodeId];
      if (!node) return;
      
      if (globeRef.current) {
        targetRot.current = {
          x: node.lat * (Math.PI / 180),
          y: -(node.lon + 90) * (Math.PI / 180)
        };
      }
      
      const W = window.innerWidth, H = window.innerHeight;
      targetCamZ.current = W < H ? 18 : 12;
      
      const route = ROUTES.find(r => r.src === nodeId || r.dst === nodeId);
      if (route) {
        setSelRoute(route.id);
        setSelNode(null);
      } else {
        setSelRoute(null);
        setSelNode(nodeId);
      }
    };
    const handleBgClick = () => {
      setSelRoute(null);
      setSelNode(null);
    };
    
    window.addEventListener("globe-node-click", handleNodeClick);
    window.addEventListener("globe-bg-click", handleBgClick);
    return () => {
      window.removeEventListener("globe-node-click", handleNodeClick);
      window.removeEventListener("globe-bg-click", handleBgClick);
    };
  }, []);

  const handleSearchSelect = (nodeId) => {
    const node = NODE_MAP[nodeId];
    if (node && globeRef.current) {
      globeRef.current.rotation.y = -(node.lon + 90) * (Math.PI / 180);
      globeRef.current.rotation.x = node.lat * (Math.PI / 180);
      setSelRoute(null);
      ignoreSearchChangeRef.current = true;
      setSearchTerm(node.name);
      setSearchResults([]);

      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        setSearchTerm("");
      }, 5000);
    } else {
      setSearchTerm("");
      setSearchResults([]);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        background: "#030b14",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
        color: "#e2f1f8",
        position: "relative",
        userSelect: "none",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar {width:4px;}
        ::-webkit-scrollbar-track {background: transparent;}
        ::-webkit-scrollbar-thumb {background: rgba(0, 229, 204, 0.2); border-radius: 4px;}
        ::-webkit-scrollbar-thumb:hover {background: rgba(0, 229, 204, 0.5);}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0.3;}}
        @keyframes floatIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
        @keyframes anomPulse{0%,100%{background:transparent;}50%{background:rgba(255,34,68,0.15);}}
        .feed-row{animation:floatIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);}
        .anom-row{animation:anomPulse 1s ease infinite;}
        .glass-panel {
          background: rgba(10, 15, 25, 0.4);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(0, 229, 204, 0.15);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }
        .data-font { font-family: 'JetBrains Mono', monospace; }
        .gradient-text {
          background: linear-gradient(90deg, #00e5cc, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .modern-btn {
          background: rgba(10, 15, 25, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          padding: 8px 16px 8px 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          outline: none;
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .modern-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .modern-btn.active {
          color: rgba(255,255,255,0.5);
          box-shadow: none;
        }
        .modern-btn:not(.active) {
          color: #00e5cc;
          box-shadow: 0 0 20px rgba(0, 229, 204, 0.15);
          border-color: rgba(0, 229, 204, 0.3);
        }

        /* Layout Classes */
        .top-panel {
          position: absolute; top: 12px; left: 50%; transform: translateX(-50%);
          z-index: 20; padding: 8px 24px; display: flex; align-items: center;
          justify-content: space-between; gap: 40px; width: 94%;
          max-width: 1300px; border-radius: 24px;
        }
        .stats-container { display: flex; gap: 32px; align-items: center; }
        .search-wrapper { position: relative; flex: 1; max-width: 360px; }
        .left-panel {
          position: absolute; top: 76px; left: 12px; bottom: 12px; width: 270px;
          z-index: 10; display: flex; flex-direction: column; padding: 0; overflow: hidden;
        }
        .right-panel {
          position: absolute; top: 76px; right: 12px; bottom: 12px; width: 270px;
          z-index: 10; display: flex; flex-direction: column; padding: 0; overflow: hidden;
        }
        .bottom-panel {
          position: absolute; bottom: 104px; left: 50%; transform: translateX(-50%);
          padding: 28px; z-index: 30; min-width: 560px; max-width: 640px;
        }
        .bottom-panel-content {
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        .bottom-panel-stats { text-align: right; margin-left: 36px; flex-shrink: 0; }
        .main-title { display: flex; align-items: center; gap: 16px; }

        /* Responsive */
        @media (max-width: 1200px) {
          .top-panel { gap: 20px; }
          .stats-container { gap: 16px; }
        }
        @media (max-width: 900px) {
          .top-panel { flex-wrap: wrap; justify-content: center; top: 8px; }
          .search-wrapper { order: 3; max-width: 100%; min-width: 100%; margin-top: 8px; }
          .stats-container { width: 100%; justify-content: center; gap: 12px; }
          .left-panel, .right-panel { top: 120px; width: 240px; }
          .bottom-panel { bottom: 12px; min-width: 90%; padding: 16px; max-width: 96%; }
        }
        .mobile-menu-btn {
          display: none;
          background: transparent; border: none; color: #fff; cursor: pointer; outline: none;
          padding: 8px; border-radius: 50%; transition: all 0.2s ease; margin-left: 8px;
        }
        .mobile-menu-btn:active { background: rgba(255,255,255,0.1); }
        .mobile-back-btn { display: none !important; }
        .side-panels-wrapper { display: contents; }
        .mobile-only-rotate { display: none; }

        @media (max-width: 640px) {
          .mobile-only-rotate { display: flex !important; align-items: center; justify-content: center; }
          .top-panel { width: calc(100% - 24px); flex-wrap: nowrap; padding: 10px 12px; border-radius: 16px; top: 12px; gap: 8px; justify-content: space-between; box-sizing: border-box; }
          .top-panel.mobile-hidden { display: none !important; }
          .main-title { width: auto; gap: 8px; justify-content: flex-start; flex: none; }
          .main-title > div:last-child > div:last-child { display: none; }
          .main-title .gradient-text { font-size: 14px !important; letter-spacing: 1px !important; }
          .stats-container { display: none; }
          .search-wrapper { max-width: none; min-width: 50px; margin-top: 0; flex: 1; order: 2; margin-left: 8px; }
          .search-wrapper input { padding: 8px 12px !important; font-size: 12px !important; width: 100%; box-sizing: border-box; }
          .search-wrapper > div:last-child { min-width: 200px; right: 0; left: auto !important; }
          
          .mobile-back-btn { display: inline-flex !important; }
          .mobile-menu-btn { display: flex; align-items: center; justify-content: center; order: 3; margin-left: 0; flex: none; }
          .side-panels-wrapper { display: none; }
          .side-panels-wrapper.mobile-open ~ .bottom-panel { display: none !important; }
          .side-panels-wrapper.mobile-open {
            display: flex;
            flex-direction: column;
            gap: 16px;
            position: fixed;
            inset: 0;
            top: 0;
            bottom: 0;
            z-index: 50;
            background: rgba(3, 11, 20, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 24px 16px 16px 16px;
            overflow-y: auto;
            animation: floatIn 0.3s ease;
          }
          .side-panels-wrapper.mobile-open .left-panel,
          .side-panels-wrapper.mobile-open .right-panel {
            display: none;
            position: relative;
            top: auto; left: auto; right: auto; bottom: auto;
            width: 100%;
            height: auto;
            max-height: none;
            overflow: visible;
          }
          .side-panels-wrapper.mobile-open.mode-bgp .left-panel { display: flex; }
          .side-panels-wrapper.mobile-open.mode-latency .right-panel { display: flex; }

          .bottom-panel { bottom: 12px; top: auto; transform: translateX(-50%); padding: 16px; width: 95%; min-width: 0; max-height: 40vh; overflow-y: auto; }
          .bottom-panel-content { flex-direction: column; }
          .bottom-panel-stats { margin-left: 0; margin-top: 16px; text-align: left; display: flex; flex-direction: row; gap: 16px; align-items: baseline; }
        }
      `}</style>

      <div
        ref={mountRef}
        style={{ position: "absolute", inset: 0, cursor: "grab", touchAction: "none" }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 4,
          background:
            "radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.1) 100%)",
        }}
      />

      <div className={`glass-panel top-panel ${mobileViewMode !== "hidden" ? "mobile-hidden" : ""}`}>
        <div className="main-title">
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#00e5cc",
                  boxShadow: "0 0 10px #00e5cc",
                  animation: `blink ${1 + i * 0.35}s ${i * 0.22}s infinite`,
                }}
              />
            ))}
          </div>
          <div>
            <div
              style={{ fontSize: 15, fontWeight: 700, letterSpacing: 3 }}
              className="gradient-text"
            >
              NETWATCH
            </div>
            <div
              style={{
                fontSize: 9,
                opacity: 0.5,
                letterSpacing: 2,
                marginTop: 2,
                fontWeight: 500,
              }}
            >
              GLOBAL BGP MONITOR
            </div>
          </div>
        </div>

        <div className="search-wrapper">
          <input
            type="text"
            placeholder={window.innerWidth <= 640 ? "Search country" : "Search country or node..."}
            value={searchTerm}
            onChange={(e) => {
              if (searchTimeoutRef.current)
                clearTimeout(searchTimeoutRef.current);
              ignoreSearchChangeRef.current = false;
              setSearchTerm(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchResults.length > 0) {
                handleSearchSelect(searchResults[0].id);
                e.target.blur();
              }
            }}
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              color: "#e2f1f8",
              padding: "10px 20px",
              fontSize: 13,
              outline: "none",
              borderRadius: 30,
              width: "100%",
              transition: "all 0.3s ease",
              fontWeight: 500,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(0, 229, 204, 0.5)";
              e.target.style.background = "rgba(0, 229, 204, 0.05)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(0, 0, 0, 0.1)";
              e.target.style.background = "rgba(255, 255, 255, 0.04)";
            }}
          />
          {searchResults.length > 0 && (
            <div
              className="glass-panel"
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                left: 0,
                width: "100%",
                maxHeight: 300,
                overflowY: "auto",
                zIndex: 100,
                padding: 8,
                borderRadius: 16,
              }}
            >
              {searchResults.map((res) => (
                <div
                  key={res.id}
                  onClick={() => handleSearchSelect(res.id)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0, 229, 204, 0.1)";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div
                    style={{
                      color: "#00e5cc",
                      fontWeight: 600,
                      fontSize: 13,
                      marginBottom: 4,
                    }}
                  >
                    {res.country}
                  </div>
                  <div style={{ opacity: 0.6, fontSize: 11, fontWeight: 500 }}>
                    {res.name}{" "}
                    <span className="data-font" style={{ opacity: 0.8 }}>
                      ({res.id})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="stats-container">
          {[
            ["NODES", NODES.length, "#00e5cc"],
            ["ROUTES", ROUTES.length, "#3b82f6"],
            ["PACKETS", totalRef.current.toLocaleString(), "#e2f1f8"],
            ["AVG RTT", `${avgLat}ms`, latStr(avgLat)],
          ].map(([l, v, c]) => (
            <div key={l} style={{ textAlign: "right" }}>
              <div
                style={{
                  opacity: 0.5,
                  fontSize: 9,
                  letterSpacing: 1.5,
                  marginBottom: 4,
                  fontWeight: 600,
                }}
              >
                {l}
              </div>
              <div
                className="data-font"
                style={{ color: c, fontSize: 16, fontWeight: 700 }}
              >
                {v}
              </div>
            </div>
          ))}

          <button
            onClick={() => {
              const next = !isAutoRotate;
              setIsAutoRotate(next);
              globalAutoRot.current = next;
              autoRot.current = next;
            }}
            className={`modern-btn ${isAutoRotate ? 'active' : ''}`}
            style={{ padding: "6px 12px", height: "min-content", fontSize: 11 }}
            title={isAutoRotate ? "Pause Rotation" : "Resume Rotation"}
          >
            {isAutoRotate ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}>
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>ROTATE</span>
              </>
            )}
          </button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              borderLeft: "1px solid rgba(0,0,0,0.1)",
              paddingLeft: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: wsState === "LIVE" ? "#10b981" : "#f43f5e",
                  boxShadow: `0 0 10px ${wsState === "LIVE" ? "#10b981" : "#f43f5e"}`,
                }}
              />
              <div
                style={{
                  color: wsState === "LIVE" ? "#10b981" : "#f43f5e",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                {wsState}
              </div>
            </div>
            <div
              className="data-font"
              style={{ opacity: 0.4, fontSize: 11, fontWeight: 500 }}
            >
              {clock}
            </div>
          </div>
        </div>

        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileViewMode(mobileViewMode === "hidden" ? "menu" : "hidden")}
        >
          {mobileViewMode !== "hidden" ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
               <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          ) : (
             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
             </svg>
          )}
        </button>
      </div>

      {mobileViewMode === "hidden" && (
        <button
          onClick={() => {
            const next = !isAutoRotate;
            setIsAutoRotate(next);
            globalAutoRot.current = next;
            autoRot.current = next;
          }}
          className={`modern-btn mobile-only-rotate ${isAutoRotate ? 'active' : ''}`}
          style={{
            position: "absolute",
            top: 76,
            right: 16,
            zIndex: 40,
            padding: "10px",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
          }}
          title={isAutoRotate ? "Pause Rotation" : "Resume Rotation"}
        >
          {isAutoRotate ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}>
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      )}

      <div 
        className={`side-panels-wrapper ${mobileViewMode !== "hidden" ? "mobile-open mode-" + mobileViewMode : ""}`}
        onPointerDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {(mobileViewMode === "bgp" || mobileViewMode === "latency") && (
          <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(3, 11, 20, 0.95)', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 8 }}>
            <button className="modern-btn mobile-back-btn" style={{ padding: '10px 20px', background: 'rgba(0,0,0,0.5)', width: 'max-content' }} onClick={() => setMobileViewMode("menu")}>
               ← BACK TO MENU
            </button>
          </div>
        )}
        {mobileViewMode === "menu" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 40, alignItems: 'center', width: '100%' }}>
            <button className="modern-btn" style={{ padding: "16px 24px", fontSize: 13, width: '100%', justifyContent: 'center' }} onClick={() => setMobileViewMode("bgp")}>
              SEE LIVE BGP EVENTS
            </button>
            <button className="modern-btn" style={{ padding: "16px 24px", fontSize: 13, width: '100%', justifyContent: 'center' }} onClick={() => setMobileViewMode("latency")}>
              GLOBAL LATENCY MAP
            </button>
            <button className="modern-btn" style={{ padding: "16px 24px", fontSize: 13, width: '100%', justifyContent: 'center', background: 'rgba(255, 100, 100, 0.1)', color: '#ff6666', border: '1px solid rgba(255, 100, 100, 0.2)' }} onClick={() => setMobileViewMode("hidden")}>
              CLOSE MENU
            </button>
          </div>
        )}
      <div className="glass-panel left-panel">
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              opacity: 0.9,
            }}
          >
            LIVE BGP STREAM
          </div>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 12,
          }}
        >
          {bgpFeed.length === 0 && (
            <div
              style={{
                textAlign: "center",
                opacity: 0.3,
                fontSize: 11,
                marginTop: 40,
                letterSpacing: 1,
                fontWeight: 500,
              }}
            >
              AWAITING BGP EVENTS...
            </div>
          )}
          {bgpFeed.map((e) => (
            <div
              key={e.id}
              className="feed-row"
              style={{
                padding: "10px 12px",
                marginBottom: 6,
                background: "rgba(255,255,255,0.03)",
                borderRadius: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: e.type === "ANNOUNCE" ? "#10b981" : "#f59e0b",
                    background:
                      e.type === "ANNOUNCE"
                        ? "rgba(16, 185, 129, 0.15)"
                        : "rgba(245, 158, 11, 0.15)",
                    padding: "4px 10px",
                    borderRadius: 12,
                    letterSpacing: 1,
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  {e.type}
                </span>
                <span
                  className="data-font"
                  style={{ opacity: 0.4, fontSize: 10 }}
                >
                  {e.ts}
                </span>
              </div>
              <div
                style={{
                  opacity: 0.9,
                  fontSize: 12,
                  marginBottom: 4,
                  fontWeight: 600,
                }}
              >
                Peer {e.peer} <span style={{ opacity: 0.3 }}>·</span>{" "}
                <span className="data-font" style={{ color: "#00e5cc" }}>
                  {e.peerAsn}
                </span>
              </div>
              {e.asPath && (
                <div
                  className="data-font"
                  style={{
                    color: "#3b82f6",
                    opacity: 0.9,
                    fontSize: 11,
                    marginBottom: 4,
                    wordBreak: "break-all",
                    lineHeight: 1.5,
                  }}
                >
                  {e.asPath}
                </div>
              )}
              <div
                className="data-font"
                style={{
                  opacity: 0.6,
                  fontSize: 10,
                  wordBreak: "break-all",
                  lineHeight: 1.4,
                }}
              >
                {e.prefixes}
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="glass-panel right-panel">
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              opacity: 0.9,
            }}
          >
            GLOBAL LATENCY MAP
          </div>
        </div>
        <div
          className="glass-panel"
          style={{
            margin: "12px 12px 0 12px",
            padding: "16px 20px",
            border: "none",
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              opacity: 0.5,
              letterSpacing: 1.5,
              marginBottom: 14,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            LATENCY LEGEND
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {[
              ["< 50ms", "#00e5cc"],
              ["50–100ms", "#10b981"],
              ["100–150ms", "#f59e0b"],
              ["> 150ms", "#f43f5e"],
            ].map(([l, c]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "calc(50% - 6px)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: c,
                    boxShadow: `0 0 8px ${c}`,
                  }}
                />
                <span
                  className="data-font"
                  style={{ color: c, fontSize: 11, fontWeight: 600 }}
                >
                  {l}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 11,
              opacity: 0.5,
              marginTop: 6,
              fontWeight: 500,
            }}
          >
            LIVE & ESTIMATED RTT
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
          {sortedRoutes.map(([id, lat]) => {
            const route = ROUTE_MAP[id];
            const isAnom = anomSet.has(id);
            const isSel = selRoute === id;
            return (
              <div
                key={id}
                onClick={() => setSelRoute(isSel ? null : id)}
                className={isAnom ? "anom-row" : ""}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: isSel ? "rgba(0, 229, 204, 0.1)" : "transparent",
                  borderLeft: isSel
                    ? "4px solid #00e5cc"
                    : "4px solid transparent",
                }}
                onMouseEnter={(e) =>
                  !isSel &&
                  (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
                }
                onMouseLeave={(e) =>
                  !isSel && (e.currentTarget.style.background = "transparent")
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: isAnom ? "#f43f5e" : "#e2f1f8",
                      letterSpacing: 0.5,
                    }}
                  >
                    {id.replace("-", " › ")}
                    {isAnom ? " ⚡" : ""}
                  </span>
                  <span
                    className="data-font"
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: isAnom ? "#f43f5e" : latStr(lat),
                    }}
                  >
                    {lat} ms
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    opacity: 0.4,
                    marginTop: 6,
                    fontWeight: 500,
                  }}
                >
                  {route?.cable || "Global Mesh"}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            padding: "8px 12px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            fontSize: 10,
            opacity: 0.5,
            letterSpacing: 1,
            fontWeight: 600,
            background: "rgba(0,0,0,0.2)",
          }}
        >
          {dataMode === "BACKEND_RIPE_ATLAS"
            ? "● BACKEND · RIPE ATLAS"
            : dataMode === "BACKEND_UNAVAILABLE"
              ? "● BACKEND · UNAVAILABLE"
              : dataMode === "BACKEND_STALE_HOLD"
                ? "● BACKEND · STALE HOLD"
                : dataMode === "BACKEND_SIMULATED"
                  ? "● SIMULATED FALLBACK"
                  : "● DISCONNECTED"}
        </div>
      </div>
      </div>

      {/* ── SELECTED ROUTE: AS PATH PANEL ── */}
      {selRoute && selRouteData ? (
        <div className="glass-panel bottom-panel">
          <div className="bottom-panel-content">
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 18,
                  color: "#fff",
                  fontWeight: 700,
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                {selRouteData.from} → {selRouteData.to}
              </div>
              <div
                style={{
                  fontSize: 12,
                  opacity: 0.6,
                  marginBottom: 20,
                  letterSpacing: 0.5,
                  fontWeight: 500,
                }}
              >
                CABLE:{" "}
                <span style={{ color: "#00e5cc" }}>{selRouteData.cable}</span>{" "}
                &nbsp;·&nbsp; BASE RTT: {selRouteData.base}ms
              </div>
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.5,
                  letterSpacing: 1.5,
                  marginBottom: 6,
                  fontWeight: 700,
                }}
              >
                BGP AS PATH
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {(
                  routeAsPaths[selRoute]?.split(" → ").filter(Boolean) ||
                  AS_PATHS[selRoute] || [
                    NODE_MAP[selRouteData.from]?.asn,
                    "AS3356",
                    NODE_MAP[selRouteData.to]?.asn,
                  ]
                ).map((as, i, arr) => (
                  <span
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      className="data-font"
                      style={{
                        padding: "6px 12px",
                        borderRadius: 10,
                        fontSize: 12,
                        color: "#00e5cc",
                        background: "rgba(0,229,204,0.1)",
                        border: "1px solid rgba(0,229,204,0.2)",
                        fontWeight: 600,
                      }}
                    >
                      {as}
                    </span>
                    {i < arr.length - 1 && (
                      <span style={{ opacity: 0.3, fontSize: 14 }}>→</span>
                    )}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 24 }}>
                <LatencyChart routeId={selRoute} />
              </div>
            </div>
            <div className="bottom-panel-stats">
              <div
                className="data-font"
                style={{
                  color: latStr(lats[selRoute] || selRouteData.base),
                  fontSize: 42,
                  fontWeight: "bold",
                  lineHeight: 1,
                }}
              >
                {lats[selRoute] || selRouteData.base}
                <span style={{ fontSize: 20 }}>ms</span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  opacity: 0.5,
                  marginTop: 8,
                  letterSpacing: 0.5,
                  fontWeight: 600,
                }}
              >
                {latLabel(lats[selRoute] || selRouteData.base)}
              </div>
              {anomSet.has(selRoute) && (
                <div
                  style={{
                    color: "#f43f5e",
                    fontSize: 12,
                    marginTop: 14,
                    fontWeight: 700,
                    letterSpacing: 1,
                    animation: "blink 0.7s infinite",
                  }}
                >
                  ⚡ ANOMALY DETECTED
                </div>
              )}
            </div>
          </div>
          <div
            onClick={() => setSelRoute(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 12,
              cursor: "pointer",
              opacity: 0.4,
              fontSize: 20,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = 1)}
            onMouseLeave={(e) => (e.target.style.opacity = 0.4)}
          >
            ✕
          </div>
        </div>
      ) : selNode ? (
        <div className="glass-panel bottom-panel">
          <div className="bottom-panel-content">
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 18,
                  color: "#fff",
                  fontWeight: 700,
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                {NODE_MAP[selNode]?.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  opacity: 0.6,
                  marginBottom: 10,
                  letterSpacing: 0.5,
                  fontWeight: 500,
                }}
              >
                COUNTRY:{" "}
                <span style={{ color: "#00e5cc" }}>{NODE_MAP[selNode]?.country}</span>{" "}
              </div>
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.5,
                  letterSpacing: 1.5,
                  fontFamily: "monospace",
                  background: "rgba(255,255,255,0.05)",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                ASN: {NODE_MAP[selNode]?.asn || "N/A"}
              </div>
            </div>
          </div>
          <div
            onClick={() => setSelNode(null)}
            style={{
              position: "absolute",
              top: 20,
              right: 12,
              cursor: "pointer",
              opacity: 0.4,
              fontSize: 20,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = 1)}
            onMouseLeave={(e) => (e.target.style.opacity = 0.4)}
          >
            ✕
          </div>
        </div>
      ) : null}

      {/* ── NODE TOOLTIP ── */}
      {hoveredNodeId && NODE_MAP[hoveredNodeId] && (
        <div
          className="glass-panel"
          ref={tooltipRef}
          style={{
            position: "absolute",
            left: mousePosRef.current.x + 15 + "px",
            top: mousePosRef.current.y + 15 + "px",
            zIndex: 100,
            pointerEvents: "none",
            padding: "16px 20px",
            minWidth: "220px",
            borderRadius: 16,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 6,
              color: "#fff",
            }}
          >
            {NODE_MAP[hoveredNodeId].country}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 12, opacity: 0.6, fontWeight: 500 }}>
              City
            </span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>
              {NODE_MAP[hoveredNodeId].name}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 12, opacity: 0.6, fontWeight: 500 }}>
              Region
            </span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>
              {NODE_MAP[hoveredNodeId].region}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 12, opacity: 0.6, fontWeight: 500 }}>
              ASN
            </span>
            <span
              className="data-font"
              style={{ fontSize: 12, color: "#00e5cc", fontWeight: 600 }}
            >
              {NODE_MAP[hoveredNodeId].asn}
            </span>
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 11, opacity: 0.5, fontWeight: 500 }}>
              Connected Routes
            </span>
            <span
              className="data-font"
              style={{ fontSize: 14, color: "#00e5cc", fontWeight: "bold" }}
            >
              {
                ROUTES.filter(
                  (r) => r.from === hoveredNodeId || r.to === hoveredNodeId,
                ).length
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
