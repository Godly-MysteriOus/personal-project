const express = require('express');
const locationDB  = require('./models/locationMappingDB');
const app = express();
const mongoose = require('mongoose');
const connectionProvider = require('./utils/Connection');
const location_dataset=[
    {
      "State": "Jammu & Kashmir",
      "District": "Srinagar",
      "City": "Srinagar",
      "Population": 1180570,
      "Area (in km^2)": 298,
      "Latitude": 34.08,
      "Longitude": 74.8
    },
    {
      "State": "Jammu & Kashmir",
      "District": "Anantnag",
      "City": "Anantnag",
      "Population": 150198,
      "Area (in km^2)": 189,
      "Latitude": 33.73,
      "Longitude": 75.15
    },
    {
      "State": "Jammu & Kashmir",
      "District": "Jammu",
      "City": "Jammu",
      "Population": 576198,
      "Area (in km^2)": 1070,
      "Latitude": 32.73,
      "Longitude": 74.87
    },
    {
      "State": "Himachal Pradesh",
      "District": "Shimla",
      "City": "Shimla",
      "Population": 169578,
      "Area (in km^2)": 35,
      "Latitude": 31.1,
      "Longitude": 77.17
    },
    {
      "State": "Punjab",
      "District": "Gurdaspur",
      "City": "Pathankot",
      "Population": 156306,
      "Area (in km^2)": 687,
      "Latitude": 32.27,
      "Longitude": 75.65
    },
    {
      "State": "Punjab",
      "District": "Gurdaspur",
      "City": "Batala",
      "Population": 158621,
      "Area (in km^2)": 951,
      "Latitude": 31.82,
      "Longitude": 75.21
    },
    {
      "State": "Punjab",
      "District": "Jalandhar",
      "City": "Jalandhar",
      "Population": 868181,
      "Area (in km^2)": 468,
      "Latitude": 31.33,
      "Longitude": 75.58
    },
    {
      "State": "Punjab",
      "District": "Hoshiarpur",
      "City": "Hoshiarpur",
      "Population": 168653,
      "Area (in km^2)": 1119,
      "Latitude": 31.53,
      "Longitude": 75.91
    },
    {
      "State": "Punjab",
      "District": "Ludhiana",
      "City": "Khanna",
      "Population": 128137,
      "Area (in km^2)": 212,
      "Latitude": 30.7,
      "Longitude": 76.22
    },
    {
      "State": "Punjab",
      "District": "Ludhiana",
      "City": "Ludhiana",
      "Population": 1618879,
      "Area (in km^2)": 634,
      "Latitude": 30.9,
      "Longitude": 75.86
    },
    {
      "State": "Punjab",
      "District": "Moga",
      "City": "Moga",
      "Population": 163397,
      "Area (in km^2)": 1235,
      "Latitude": 30.82,
      "Longitude": 75.17
    },
    {
      "State": "Punjab",
      "District": "Firozpur",
      "City": "Firozpur",
      "Population": 110313,
      "Area (in km^2)": 1293,
      "Latitude": 30.92,
      "Longitude": 74.61
    },
    {
      "State": "Punjab",
      "District": "Firozpur",
      "City": "Abohar",
      "Population": 145302,
      "Area (in km^2)": 1209,
      "Latitude": 30.13,
      "Longitude": 74.2
    },
    {
      "State": "Punjab",
      "District": "Muktsar",
      "City": "Muktsar",
      "Population": 116747,
      "Area (in km^2)": 885,
      "Latitude": 30.7,
      "Longitude": 76.72
    },
    {
      "State": "Punjab",
      "District": "Bathinda",
      "City": "Bathinda",
      "Population": 285788,
      "Area (in km^2)": 1512,
      "Latitude": 30.21,
      "Longitude": 74.95
    },
    {
      "State": "Punjab",
      "District": "Patiala",
      "City": "Patiala",
      "Population": 446246,
      "Area (in km^2)": 1148,
      "Latitude": 30.34,
      "Longitude": 76.38
    },
    {
      "State": "Punjab",
      "District": "Amritsar",
      "City": "Amritsar",
      "Population": 1155664,
      "Area (in km^2)": 562,
      "Latitude": 31.63,
      "Longitude": 74.87
    },
    {
      "State": "Punjab",
      "District": "Sahibzada Ajit Singh Nagar",
      "City": "S.A.S. Nagar",
      "Population": 166864,
      "Area (in km^2)": 187,
      "Latitude": 30.7,
      "Longitude": 76.72
    },
    {
      "State": "Punjab",
      "District": "Sangrur",
      "City": "Malerkotla",
      "Population": 135424,
      "Area (in km^2)": 684,
      "Latitude": 30.53,
      "Longitude": 75.89
    },
    {
      "State": "Punjab",
      "District": "Barnala",
      "City": "Barnala",
      "Population": 116449,
      "Area (in km^2)": 898,
      "Latitude": 30.37,
      "Longitude": 75.53
    },
    {
      "State": "Chandigarh",
      "District": "Chandigarh",
      "City": "Chandigarh",
      "Population": 970602,
      "Area (in km^2)": 114,
      "Latitude": 30.74,
      "Longitude": 76.77
    },
    {
      "State": "Uttarakhand",
      "District": "Dehradun",
      "City": "Dehradun",
      "Population": 574840,
      "Area (in km^2)": 300,
      "Latitude": 30.32,
      "Longitude": 78.03
    },
    {
      "State": "Uttarakhand",
      "District": "Nainital",
      "City": "Haldwani",
      "Population": 201461,
      "Area (in km^2)": 44,
      "Latitude": 29.22,
      "Longitude": 79.51
    },
    {
      "State": "Uttarakhand",
      "District": "Udham Singh Nagar",
      "City": "Kashipur",
      "Population": 121623,
      "Area (in km^2)": 200,
      "Latitude": 29.21,
      "Longitude": 78.96
    },
    {
      "State": "Uttarakhand",
      "District": "Udham Singh Nagar",
      "City": "Rudrapur",
      "Population": 154554,
      "Area (in km^2)": 27,
      "Latitude": 28.98,
      "Longitude": 79.4
    },
    {
      "State": "Uttarakhand",
      "District": "Hardwar",
      "City": "Roorkee",
      "Population": 118200,
      "Area (in km^2)": 1067,
      "Latitude": 29.85,
      "Longitude": 77.89
    },
    {
      "State": "Uttarakhand",
      "District": "Hardwar",
      "City": "Hardwar",
      "Population": 231338,
      "Area (in km^2)": 903,
      "Latitude": 29.95,
      "Longitude": 78.16
    },
    {
      "State": "Haryana",
      "District": "Panchkula",
      "City": "Panchkula",
      "Population": 211355,
      "Area (in km^2)": 641,
      "Latitude": 30.7,
      "Longitude": 76.85
    },
    {
      "State": "Haryana",
      "District": "Ambala",
      "City": "Ambala",
      "Population": 195153,
      "Area (in km^2)": 736,
      "Latitude": 30.38,
      "Longitude": 76.78
    },
    {
      "State": "Haryana",
      "District": "Ambala",
      "City": "Ambala Sadar",
      "Population": 104974,
      "Area (in km^2)": 0,
      "Latitude": 30.33,
      "Longitude": 76.84
    },
    {
      "State": "Haryana",
      "District": "Yamunanagar",
      "City": "Jagadhri",
      "Population": 124894,
      "Area (in km^2)": 840,
      "Latitude": 30.17,
      "Longitude": 77.3
    },
    {
      "State": "Haryana",
      "District": "Yamunanagar",
      "City": "Yamunanagar",
      "Population": 217071,
      "Area (in km^2)": 0,
      "Latitude": 30.12,
      "Longitude": 77.28
    },
    {
      "State": "Haryana",
      "District": "Kurukshetra",
      "City": "Thanesar",
      "Population": 155152,
      "Area (in km^2)": 801,
      "Latitude": 29.96,
      "Longitude": 76.82
    },
    {
      "State": "Haryana",
      "District": "Kaithal",
      "City": "Kaithal",
      "Population": 144915,
      "Area (in km^2)": 1280,
      "Latitude": 29.8,
      "Longitude": 76.38
    },
    {
      "State": "Haryana",
      "District": "Karnal",
      "City": "Karnal",
      "Population": 302140,
      "Area (in km^2)": 830,
      "Latitude": 29.69,
      "Longitude": 76.99
    },
    {
      "State": "Haryana",
      "District": "Panipat",
      "City": "Panipat",
      "Population": 295970,
      "Area (in km^2)": 536,
      "Latitude": 29.4,
      "Longitude": 76.98
    },
    {
      "State": "Haryana",
      "District": "Sonipat",
      "City": "Sonipat",
      "Population": 289333,
      "Area (in km^2)": 708,
      "Latitude": 28.93,
      "Longitude": 77.09
    },
    {
      "State": "Haryana",
      "District": "Jind",
      "City": "Jind",
      "Population": 167592,
      "Area (in km^2)": 817,
      "Latitude": 29.32,
      "Longitude": 76.32
    },
    {
      "State": "Haryana",
      "District": "Sirsa",
      "City": "Sirsa",
      "Population": 182534,
      "Area (in km^2)": 2069,
      "Latitude": 29.54,
      "Longitude": 75.03
    },
    {
      "State": "Haryana",
      "District": "Hisar",
      "City": "Hisar",
      "Population": 307024,
      "Area (in km^2)": 2234,
      "Latitude": 29.15,
      "Longitude": 75.7
    },
    {
      "State": "Haryana",
      "District": "Bhiwani",
      "City": "Bhiwani",
      "Population": 196057,
      "Area (in km^2)": 960,
      "Latitude": 28.8,
      "Longitude": 76.13
    },
    {
      "State": "Haryana",
      "District": "Rohtak",
      "City": "Rohtak",
      "Population": 374292,
      "Area (in km^2)": 937,
      "Latitude": 28.9,
      "Longitude": 76.61
    },
    {
      "State": "Haryana",
      "District": "Jhajjar",
      "City": "Bahadurgarh",
      "Population": 170767,
      "Area (in km^2)": 517,
      "Latitude": 28.68,
      "Longitude": 76.92
    },
    {
      "State": "Haryana",
      "District": "Rewari",
      "City": "Rewari",
      "Population": 143021,
      "Area (in km^2)": 999,
      "Latitude": 28.18,
      "Longitude": 76.62
    },
    {
      "State": "Haryana",
      "District": "Gurgaon",
      "City": "Gurgaon",
      "Population": 886519,
      "Area (in km^2)": 333,
      "Latitude": 28.46,
      "Longitude": 77.03
    },
    {
      "State": "Haryana",
      "District": "Faridabad",
      "City": "Faridabad",
      "Population": 1414050,
      "Area (in km^2)": 351,
      "Latitude": 28.42,
      "Longitude": 77.3
    },
    {
      "State": "Haryana",
      "District": "Palwal",
      "City": "Palwal",
      "Population": 131926,
      "Area (in km^2)": 619,
      "Latitude": 28.15,
      "Longitude": 77.33
    },
    {
      "State": "Delhi",
      "District": "North West",
      "City": "DMC",
      "Population": 11007835,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Delhi",
      "District": "North West",
      "City": "Kirari Suleman Nagar",
      "Population": 283211,
      "Area (in km^2)": 0,
      "Latitude": 28.69,
      "Longitude": 77.06
    },
    {
      "State": "Delhi",
      "District": "North West",
      "City": "Sultan Pur Majra",
      "Population": 181554,
      "Area (in km^2)": 0,
      "Latitude": 28.67,
      "Longitude": 77.07
    },
    {
      "State": "Delhi",
      "District": "North West",
      "City": "Bhalswa Jahangir Pur",
      "Population": 197148,
      "Area (in km^2)": 0,
      "Latitude": 28.73,
      "Longitude": 77.16
    },
    {
      "State": "Delhi",
      "District": "North",
      "City": "Burari",
      "Population": 146190,
      "Area (in km^2)": 0,
      "Latitude": 28.75,
      "Longitude": 77.18
    },
    {
      "State": "Delhi",
      "District": "North East",
      "City": "Karawal Nagar",
      "Population": 224281,
      "Area (in km^2)": 0,
      "Latitude": 28.72,
      "Longitude": 77.27
    },
    {
      "State": "Delhi",
      "District": "North East",
      "City": "Mustafabad",
      "Population": 127167,
      "Area (in km^2)": 0,
      "Latitude": 28.71,
      "Longitude": 77.27
    },
    {
      "State": "Delhi",
      "District": "North East",
      "City": "Gokal Pur",
      "Population": 121870,
      "Area (in km^2)": 0,
      "Latitude": 28.67,
      "Longitude": 77.26
    },
    {
      "State": "Delhi",
      "District": "North East",
      "City": "Mandoli",
      "Population": 120417,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Delhi",
      "District": "East",
      "City": "Dallo Pura",
      "Population": 154791,
      "Area (in km^2)": 0,
      "Latitude": 28.6,
      "Longitude": 77.32
    },
    {
      "State": "Delhi",
      "District": "West",
      "City": "Hastsal",
      "Population": 176877,
      "Area (in km^2)": 0,
      "Latitude": 28.63,
      "Longitude": 77.05
    },
    {
      "State": "Delhi",
      "District": "West",
      "City": "Nangloi Jat",
      "Population": 205596,
      "Area (in km^2)": 50,
      "Latitude": 28.66,
      "Longitude": 77.06
    },
    {
      "State": "Delhi",
      "District": "South West",
      "City": "Delhi Cantonment",
      "Population": 101704,
      "Area (in km^2)": 43,
      "Latitude": 28.6,
      "Longitude": 77.13
    },
    {
      "State": "Delhi",
      "District": "South",
      "City": "Deoli",
      "Population": 169122,
      "Area (in km^2)": 0,
      "Latitude": 28.5,
      "Longitude": 77.23
    },
    {
      "State": "Rajasthan",
      "District": "Ganganagar",
      "City": "Ganganagar",
      "Population": 237780,
      "Area (in km^2)": 225,
      "Latitude": 29.92,
      "Longitude": 73.88
    },
    {
      "State": "Rajasthan",
      "District": "Hanumangarh",
      "City": "Hanumangarh",
      "Population": 150958,
      "Area (in km^2)": 0,
      "Latitude": 29.63,
      "Longitude": 74.29
    },
    {
      "State": "Rajasthan",
      "District": "Bikaner",
      "City": "Bikaner",
      "Population": 644406,
      "Area (in km^2)": 3699,
      "Latitude": 28.03,
      "Longitude": 73.3
    },
    {
      "State": "Rajasthan",
      "District": "Churu",
      "City": "Churu",
      "Population": 120157,
      "Area (in km^2)": 1607,
      "Latitude": 28.29,
      "Longitude": 74.97
    },
    {
      "State": "Rajasthan",
      "District": "Churu",
      "City": "Sujangarh",
      "Population": 101523,
      "Area (in km^2)": 2689,
      "Latitude": 27.7,
      "Longitude": 74.45
    },
    {
      "State": "Rajasthan",
      "District": "Jhunjhunun",
      "City": "Jhunjhunun",
      "Population": 118473,
      "Area (in km^2)": 1619,
      "Latitude": 28.13,
      "Longitude": 75.4
    },
    {
      "State": "Rajasthan",
      "District": "Alwar",
      "City": "Bhiwadi",
      "Population": 104921,
      "Area (in km^2)": 0,
      "Latitude": 28.22,
      "Longitude": 76.87
    },
    {
      "State": "Rajasthan",
      "District": "Alwar",
      "City": "Alwar",
      "Population": 322568,
      "Area (in km^2)": 1202,
      "Latitude": 27.56,
      "Longitude": 76.63
    },
    {
      "State": "Rajasthan",
      "District": "Bharatpur",
      "City": "Bharatpur",
      "Population": 252838,
      "Area (in km^2)": 501,
      "Latitude": 27.22,
      "Longitude": 77.49
    },
    {
      "State": "Rajasthan",
      "District": "Dhaulpur",
      "City": "Dhaulpur",
      "Population": 133075,
      "Area (in km^2)": 524,
      "Latitude": 26.7,
      "Longitude": 77.9
    },
    {
      "State": "Rajasthan",
      "District": "Karauli",
      "City": "Hindaun",
      "Population": 105452,
      "Area (in km^2)": 701,
      "Latitude": 26.73,
      "Longitude": 77.03
    },
    {
      "State": "Rajasthan",
      "District": "Sawai Madhopur",
      "City": "Gangapur City",
      "Population": 119090,
      "Area (in km^2)": 16.21,
      "Latitude": 26.47,
      "Longitude": 76.71
    },
    {
      "State": "Rajasthan",
      "District": "Sawai Madhopur",
      "City": "Sawai Madhopur",
      "Population": 121106,
      "Area (in km^2)": 59,
      "Latitude": 25.99,
      "Longitude": 76.36
    },
    {
      "State": "Rajasthan",
      "District": "Jaipur",
      "City": "Jaipur",
      "Population": 3073350,
      "Area (in km^2)": 579,
      "Latitude": 26.92,
      "Longitude": 75.78
    },
    {
      "State": "Rajasthan",
      "District": "Sikar",
      "City": "Sikar",
      "Population": 244497,
      "Area (in km^2)": 1516,
      "Latitude": 27.62,
      "Longitude": 75.13
    },
    {
      "State": "Rajasthan",
      "District": "Nagaur",
      "City": "Nagaur",
      "Population": 105218,
      "Area (in km^2)": 3056,
      "Latitude": 27.21,
      "Longitude": 73.74
    },
    {
      "State": "Rajasthan",
      "District": "Jodhpur",
      "City": "Jodhpur",
      "Population": 1056191,
      "Area (in km^2)": 1968,
      "Latitude": 26.26,
      "Longitude": 73.01
    },
    {
      "State": "Rajasthan",
      "District": "Pali",
      "City": "Pali",
      "Population": 230075,
      "Area (in km^2)": 1657,
      "Latitude": 25.77,
      "Longitude": 73.32
    },
    {
      "State": "Rajasthan",
      "District": "Ajmer",
      "City": "Kishangarh",
      "Population": 154886,
      "Area (in km^2)": 1715,
      "Latitude": 26.59,
      "Longitude": 74.87
    },
    {
      "State": "Rajasthan",
      "District": "Ajmer",
      "City": "Ajmer",
      "Population": 542321,
      "Area (in km^2)": 897,
      "Latitude": 26.45,
      "Longitude": 74.64
    },
    {
      "State": "Rajasthan",
      "District": "Ajmer",
      "City": "Beawar",
      "Population": 151152,
      "Area (in km^2)": 687,
      "Latitude": 26.1,
      "Longitude": 74.32
    },
    {
      "State": "Rajasthan",
      "District": "Tonk",
      "City": "Tonk",
      "Population": 165294,
      "Area (in km^2)": 814,
      "Latitude": 26.17,
      "Longitude": 75.78
    },
    {
      "State": "Rajasthan",
      "District": "Bundi",
      "City": "Bundi",
      "Population": 103286,
      "Area (in km^2)": 1886,
      "Latitude": 25.43,
      "Longitude": 75.65
    },
    {
      "State": "Rajasthan",
      "District": "Bhilwara",
      "City": "Bhilwara",
      "Population": 359483,
      "Area (in km^2)": 969,
      "Latitude": 25.35,
      "Longitude": 74.64
    },
    {
      "State": "Rajasthan",
      "District": "Banswara",
      "City": "Banswara",
      "Population": 101017,
      "Area (in km^2)": 1135,
      "Latitude": 23.55,
      "Longitude": 74.43
    },
    {
      "State": "Rajasthan",
      "District": "Chittaurgarh",
      "City": "Chittaurgarh",
      "Population": 116406,
      "Area (in km^2)": 983,
      "Latitude": 24.88,
      "Longitude": 74.63
    },
    {
      "State": "Rajasthan",
      "District": "Kota",
      "City": "Kota",
      "Population": 1001694,
      "Area (in km^2)": 0,
      "Latitude": 25,
      "Longitude": 76.17
    },
    {
      "State": "Rajasthan",
      "District": "Baran",
      "City": "Baran",
      "Population": 117992,
      "Area (in km^2)": 627,
      "Latitude": 25.1,
      "Longitude": 76.51
    },
    {
      "State": "Rajasthan",
      "District": "Udaipur",
      "City": "Udaipur",
      "Population": 451100,
      "Area (in km^2)": 0,
      "Latitude": 24.57,
      "Longitude": 73.69
    },
    {
      "State": "Uttar Pradesh",
      "District": "Saharanpur",
      "City": "Saharanpur",
      "Population": 705478,
      "Area (in km^2)": 787,
      "Latitude": 29.96,
      "Longitude": 77.55
    },
    {
      "State": "Uttar Pradesh",
      "District": "Muzaffarnagar",
      "City": "Shamli",
      "Population": 107266,
      "Area (in km^2)": 610,
      "Latitude": 29.45,
      "Longitude": 77.31
    },
    {
      "State": "Uttar Pradesh",
      "District": "Muzaffarnagar",
      "City": "Muzaffarnagar",
      "Population": 392768,
      "Area (in km^2)": 1045,
      "Latitude": 29.47,
      "Longitude": 77.7
    },
    {
      "State": "Uttar Pradesh",
      "District": "Moradabad",
      "City": "Moradabad",
      "Population": 887871,
      "Area (in km^2)": 755,
      "Latitude": 28.84,
      "Longitude": 78.8
    },
    {
      "State": "Uttar Pradesh",
      "District": "Moradabad",
      "City": "Sambhal",
      "Population": 220813,
      "Area (in km^2)": 868,
      "Latitude": 28.59,
      "Longitude": 78.57
    },
    {
      "State": "Uttar Pradesh",
      "District": "Moradabad",
      "City": "Chandausi",
      "Population": 114383,
      "Area (in km^2)": 617,
      "Latitude": 28.45,
      "Longitude": 78.77
    },
    {
      "State": "Uttar Pradesh",
      "District": "Rampur",
      "City": "Rampur",
      "Population": 325313,
      "Area (in km^2)": 329,
      "Latitude": 28.8,
      "Longitude": 79
    },
    {
      "State": "Uttar Pradesh",
      "District": "Jyotiba Phule Nagar",
      "City": "Amroha",
      "Population": 198471,
      "Area (in km^2)": 634,
      "Latitude": 28.9,
      "Longitude": 78.47
    },
    {
      "State": "Uttar Pradesh",
      "District": "Meerut",
      "City": "Meerut",
      "Population": 1305429,
      "Area (in km^2)": 929,
      "Latitude": 28.98,
      "Longitude": 77.71
    },
    {
      "State": "Uttar Pradesh",
      "District": "Baghpat",
      "City": "Baraut",
      "Population": 103764,
      "Area (in km^2)": 731,
      "Latitude": 29.17,
      "Longitude": 77.43
    },
    {
      "State": "Uttar Pradesh",
      "District": "Ghaziabad",
      "City": "Modinagar",
      "Population": 130325,
      "Area (in km^2)": 263,
      "Latitude": 28.84,
      "Longitude": 77.58
    },
    {
      "State": "Uttar Pradesh",
      "District": "Ghaziabad",
      "City": "Loni",
      "Population": 516082,
      "Area (in km^2)": 35,
      "Latitude": 28.75,
      "Longitude": 77.28
    },
    {
      "State": "Uttar Pradesh",
      "District": "Ghaziabad",
      "City": "Ghaziabad",
      "Population": 1648643,
      "Area (in km^2)": 457,
      "Latitude": 28.67,
      "Longitude": 77.45
    },
    {
      "State": "Uttar Pradesh",
      "District": "Ghaziabad",
      "City": "Khora",
      "Population": 190005,
      "Area (in km^2)": 10,
      "Latitude": 28.37,
      "Longitude": 77.2
    },
    {
      "State": "Uttar Pradesh",
      "District": "Ghaziabad",
      "City": "Hapur",
      "Population": 262983,
      "Area (in km^2)": 378,
      "Latitude": 28.73,
      "Longitude": 77.78
    },
    {
      "State": "Uttar Pradesh",
      "District": "Gautam Buddha Nagar",
      "City": "Noida",
      "Population": 637272,
      "Area (in km^2)": 203,
      "Latitude": 28.57,
      "Longitude": 77.32
    },
    {
      "State": "Uttar Pradesh",
      "District": "Gautam Buddha Nagar",
      "City": "Greater Noida",
      "Population": 102054,
      "Area (in km^2)": 0,
      "Latitude": 28.47,
      "Longitude": 77.5
    },
    {
      "State": "Uttar Pradesh",
      "District": "Bulandshahr",
      "City": "Bulandshahr",
      "Population": 230024,
      "Area (in km^2)": 753,
      "Latitude": 28.41,
      "Longitude": 77.85
    },
    {
      "State": "Uttar Pradesh",
      "District": "Bulandshahr",
      "City": "Khurja",
      "Population": 121207,
      "Area (in km^2)": 684,
      "Latitude": 28.25,
      "Longitude": 77.85
    },
    {
      "State": "Uttar Pradesh",
      "District": "Aligarh",
      "City": "Aligarh",
      "Population": 874408,
      "Area (in km^2)": 0,
      "Latitude": 27.9,
      "Longitude": 78.07
    },
    {
      "State": "Uttar Pradesh",
      "District": "Mahamaya Nagar",
      "City": "Hathras",
      "Population": 143020,
      "Area (in km^2)": 492,
      "Latitude": 27.6,
      "Longitude": 78.05
    },
    {
      "State": "Uttar Pradesh",
      "District": "Mathura",
      "City": "Mathura",
      "Population": 349909,
      "Area (in km^2)": 1078,
      "Latitude": 27.49,
      "Longitude": 77.67
    },
    {
      "State": "Uttar Pradesh",
      "District": "Agra",
      "City": "Agra",
      "Population": 1585704,
      "Area (in km^2)": 543,
      "Latitude": 27.18,
      "Longitude": 78.01
    },
    {
      "State": "Uttar Pradesh",
      "District": "Firozabad",
      "City": "Firozabad",
      "Population": 604214,
      "Area (in km^2)": 451,
      "Latitude": 27.16,
      "Longitude": 78.4
    },
    {
      "State": "Uttar Pradesh",
      "District": "Firozabad",
      "City": "Shikohabad",
      "Population": 107404,
      "Area (in km^2)": 750,
      "Latitude": 27.11,
      "Longitude": 78.58
    },
    {
      "State": "Uttar Pradesh",
      "District": "Mainpuri",
      "City": "Mainpuri",
      "Population": 136557,
      "Area (in km^2)": 1015,
      "Latitude": 27.23,
      "Longitude": 79.02
    },
    {
      "State": "Uttar Pradesh",
      "District": "Budaun",
      "City": "Budaun",
      "Population": 159285,
      "Area (in km^2)": 1161,
      "Latitude": 28.03,
      "Longitude": 79.12
    },
    {
      "State": "Uttar Pradesh",
      "District": "Bareilly",
      "City": "Bareilly",
      "Population": 904797,
      "Area (in km^2)": 728,
      "Latitude": 28.35,
      "Longitude": 79.4
    },
    {
      "State": "Uttar Pradesh",
      "District": "Pilibhit",
      "City": "Pilibhit",
      "Population": 127988,
      "Area (in km^2)": 1047,
      "Latitude": 28.63,
      "Longitude": 79.8
    },
    {
      "State": "Uttar Pradesh",
      "District": "Shahjahanpur",
      "City": "Shahjahanpur",
      "Population": 329736,
      "Area (in km^2)": 1042,
      "Latitude": 27.88,
      "Longitude": 79.91
    },
    {
      "State": "Uttar Pradesh",
      "District": "Kheri",
      "City": "Lakhimpur",
      "Population": 151993,
      "Area (in km^2)": 1474,
      "Latitude": 27.95,
      "Longitude": 80.78
    },
    {
      "State": "Uttar Pradesh",
      "District": "Sitapur",
      "City": "Sitapur",
      "Population": 177234,
      "Area (in km^2)": 848,
      "Latitude": 27.58,
      "Longitude": 80.66
    },
    {
      "State": "Uttar Pradesh",
      "District": "Hardoi",
      "City": "Hardoi",
      "Population": 197029,
      "Area (in km^2)": 1585,
      "Latitude": 27.4,
      "Longitude": 80.13
    },
    {
      "State": "Uttar Pradesh",
      "District": "Unnao",
      "City": "Unnao",
      "Population": 177658,
      "Area (in km^2)": 1001,
      "Latitude": 26.54,
      "Longitude": 80.49
    },
    {
      "State": "Uttar Pradesh",
      "District": "Lucknow",
      "City": "Lucknow",
      "Population": 2817105,
      "Area (in km^2)": 938,
      "Latitude": 26.85,
      "Longitude": 80.95
    },
    {
      "State": "Uttar Pradesh",
      "District": "Rae Bareli",
      "City": "Rae Bareli",
      "Population": 191316,
      "Area (in km^2)": 50,
      "Latitude": 26.36,
      "Longitude": 81.4
    },
    {
      "State": "Uttar Pradesh",
      "District": "Farrukhabad",
      "City": "Farrukhabad",
      "Population": 276581,
      "Area (in km^2)": 886,
      "Latitude": 27.39,
      "Longitude": 79.59
    },
    {
      "State": "Uttar Pradesh",
      "District": "Etawah",
      "City": "Etawah",
      "Population": 256838,
      "Area (in km^2)": 645,
      "Latitude": 26.81,
      "Longitude": 79
    },
    {
      "State": "Uttar Pradesh",
      "District": "Kanpur Nagar",
      "City": "Kanpur",
      "Population": 2768057,
      "Area (in km^2)": 1122,
      "Latitude": 26.45,
      "Longitude": 80.33
    },
    {
      "State": "Uttar Pradesh",
      "District": "Jalaun",
      "City": "Orai",
      "Population": 190575,
      "Area (in km^2)": 927,
      "Latitude": 25.98,
      "Longitude": 79.47
    },
    {
      "State": "Uttar Pradesh",
      "District": "Jhansi",
      "City": "Jhansi",
      "Population": 505693,
      "Area (in km^2)": 1185,
      "Latitude": 25.44,
      "Longitude": 78.57
    },
    {
      "State": "Uttar Pradesh",
      "District": "Lalitpur",
      "City": "Lalitpur",
      "Population": 133305,
      "Area (in km^2)": 1834,
      "Latitude": 24.69,
      "Longitude": 78.41
    },
    {
      "State": "Uttar Pradesh",
      "District": "Banda",
      "City": "Banda",
      "Population": 160473,
      "Area (in km^2)": 443,
      "Latitude": 25.5,
      "Longitude": 80.3
    },
    {
      "State": "Uttar Pradesh",
      "District": "Fatehpur",
      "City": "Fatehpur",
      "Population": 193193,
      "Area (in km^2)": 1632,
      "Latitude": 25.92,
      "Longitude": 80.81
    },
    {
      "State": "Uttar Pradesh",
      "District": "Allahabad",
      "City": "Allahabad",
      "Population": 1168385,
      "Area (in km^2)": 305,
      "Latitude": 25.47,
      "Longitude": 81.88
    },
    {
      "State": "Uttar Pradesh",
      "District": "Faizabad",
      "City": "Faizabad",
      "Population": 165228,
      "Area (in km^2)": 425,
      "Latitude": 26.77,
      "Longitude": 82.15
    },
    {
      "State": "Uttar Pradesh",
      "District": "Ambedkar Nagar",
      "City": "Akbarpur",
      "Population": 111447,
      "Area (in km^2)": 609,
      "Latitude": 26.43,
      "Longitude": 82.53
    },
    {
      "State": "Uttar Pradesh",
      "District": "Sultanpur",
      "City": "Sultanpur",
      "Population": 107640,
      "Area (in km^2)": 767,
      "Latitude": 26.26,
      "Longitude": 82.07
    },
    {
      "State": "Uttar Pradesh",
      "District": "Bahraich",
      "City": "Bahraich",
      "Population": 186223,
      "Area (in km^2)": 870,
      "Latitude": 27.57,
      "Longitude": 81.6
    },
    {
      "State": "Uttar Pradesh",
      "District": "Gonda",
      "City": "Gonda",
      "Population": 114046,
      "Area (in km^2)": 1175,
      "Latitude": 27.13,
      "Longitude": 81.96
    },
    {
      "State": "Uttar Pradesh",
      "District": "Basti",
      "City": "Basti",
      "Population": 114657,
      "Area (in km^2)": 829,
      "Latitude": 26.82,
      "Longitude": 82.76
    },
    {
      "State": "Uttar Pradesh",
      "District": "Gorakhpur",
      "City": "Gorakhpur",
      "Population": 673446,
      "Area (in km^2)": 840,
      "Latitude": 26.77,
      "Longitude": 83.36
    },
    {
      "State": "Uttar Pradesh",
      "District": "Deoria",
      "City": "Deoria",
      "Population": 129479,
      "Area (in km^2)": 927,
      "Latitude": 26.5,
      "Longitude": 83.78
    },
    {
      "State": "Uttar Pradesh",
      "District": "Azamgarh",
      "City": "Azamgarh",
      "Population": 110983,
      "Area (in km^2)": 579,
      "Latitude": 26.07,
      "Longitude": 83.19
    },
    {
      "State": "Uttar Pradesh",
      "District": "Mau",
      "City": "Maunath Bhanjan",
      "Population": 278745,
      "Area (in km^2)": 512,
      "Latitude": 25.93,
      "Longitude": 83.33
    },
    {
      "State": "Uttar Pradesh",
      "District": "Ballia",
      "City": "Ballia",
      "Population": 104424,
      "Area (in km^2)": 804,
      "Latitude": 25.76,
      "Longitude": 84.15
    },
    {
      "State": "Uttar Pradesh",
      "District": "Jaunpur",
      "City": "Jaunpur",
      "Population": 180362,
      "Area (in km^2)": 711,
      "Latitude": 25.75,
      "Longitude": 82.7
    },
    {
      "State": "Uttar Pradesh",
      "District": "Ghazipur",
      "City": "Ghazipur",
      "Population": 121020,
      "Area (in km^2)": 678,
      "Latitude": 25.58,
      "Longitude": 83.58
    },
    {
      "State": "Uttar Pradesh",
      "District": "Chandauli",
      "City": "Mughalsarai",
      "Population": 109650,
      "Area (in km^2)": 0,
      "Latitude": 25.3,
      "Longitude": 83.12
    },
    {
      "State": "Uttar Pradesh",
      "District": "Varanasi",
      "City": "Varanasi",
      "Population": 1198491,
      "Area (in km^2)": 840,
      "Latitude": 25.32,
      "Longitude": 82.99
    },
    {
      "State": "Uttar Pradesh",
      "District": "Mirzapur",
      "City": "Mirzapur",
      "Population": 234871,
      "Area (in km^2)": 1160,
      "Latitude": 25.13,
      "Longitude": 82.56
    },
    {
      "State": "Uttar Pradesh",
      "District": "Etah",
      "City": "Etah",
      "Population": 118517,
      "Area (in km^2)": 1250,
      "Latitude": 27.56,
      "Longitude": 78.66
    },
    {
      "State": "Uttar Pradesh",
      "District": "Kanshiram Nagar",
      "City": "Kasganj",
      "Population": 101277,
      "Area (in km^2)": 591,
      "Latitude": 27.8,
      "Longitude": 78.63
    },
    {
      "State": "Bihar",
      "District": "Pashchim Champaran",
      "City": "Bagaha (Nagar Parishad)",
      "Population": 112634,
      "Area (in km^2)": 0,
      "Latitude": 27.13,
      "Longitude": 84.07
    },
    {
      "State": "Bihar",
      "District": "Pashchim Champaran",
      "City": "Bettiah (Nagar Parishad)",
      "Population": 132209,
      "Area (in km^2)": 0,
      "Latitude": 26.8,
      "Longitude": 84.5
    },
    {
      "State": "Bihar",
      "District": "Purba Champaran",
      "City": "Motihari (Nagar Parishad)",
      "Population": 126158,
      "Area (in km^2)": 122,
      "Latitude": 26.6,
      "Longitude": 84.9
    },
    {
      "State": "Bihar",
      "District": "Kishanganj",
      "City": "Kishanganj (Nagar Parishad)",
      "Population": 105782,
      "Area (in km^2)": 0,
      "Latitude": 26.06,
      "Longitude": 87.9
    },
    {
      "State": "Bihar",
      "District": "Purnia",
      "City": "Purnia",
      "Population": 282248,
      "Area (in km^2)": 92,
      "Latitude": 25.77,
      "Longitude": 87.47
    },
    {
      "State": "Bihar",
      "District": "Katihar",
      "City": "Katihar",
      "Population": 240838,
      "Area (in km^2)": 115,
      "Latitude": 25.53,
      "Longitude": 87.58
    },
    {
      "State": "Bihar",
      "District": "Saharsa",
      "City": "Saharsa (Nagar Parishad)",
      "Population": 156540,
      "Area (in km^2)": 1687,
      "Latitude": 25.88,
      "Longitude": 86.6
    },
    {
      "State": "Bihar",
      "District": "Darbhanga",
      "City": "Darbhanga",
      "Population": 296039,
      "Area (in km^2)": 196,
      "Latitude": 26.15,
      "Longitude": 85.9
    },
    {
      "State": "Bihar",
      "District": "Muzaffarpur",
      "City": "Muzaffarpur",
      "Population": 354462,
      "Area (in km^2)": 93,
      "Latitude": 26.12,
      "Longitude": 85.37
    },
    {
      "State": "Bihar",
      "District": "Siwan",
      "City": "Siwan (Nagar Parishad)",
      "Population": 135066,
      "Area (in km^2)": 69,
      "Latitude": 26.22,
      "Longitude": 84.36
    },
    {
      "State": "Bihar",
      "District": "Saran",
      "City": "Chapra (Nagar Parishad)",
      "Population": 202352,
      "Area (in km^2)": 0,
      "Latitude": 25.78,
      "Longitude": 84.71
    },
    {
      "State": "Bihar",
      "District": "Vaishali",
      "City": "Hajipur (Nagar Parishad)",
      "Population": 147688,
      "Area (in km^2)": 20,
      "Latitude": 25.68,
      "Longitude": 85.22
    },
    {
      "State": "Bihar",
      "District": "Begusarai",
      "City": "Begusarai",
      "Population": 252008,
      "Area (in km^2)": 224,
      "Latitude": 25.42,
      "Longitude": 86.13
    },
    {
      "State": "Bihar",
      "District": "Bhagalpur",
      "City": "Bhagalpur",
      "Population": 400146,
      "Area (in km^2)": 342,
      "Latitude": 25.25,
      "Longitude": 86.99
    },
    {
      "State": "Bihar",
      "District": "Munger",
      "City": "Munger",
      "Population": 213303,
      "Area (in km^2)": 259,
      "Latitude": 25.38,
      "Longitude": 86.47
    },
    {
      "State": "Bihar",
      "District": "Munger",
      "City": "Jamalpur (Nagar Parishad)",
      "Population": 105434,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Bihar",
      "District": "Nalanda",
      "City": "Biharsharif",
      "Population": 297268,
      "Area (in km^2)": 152.94,
      "Latitude": 25.18,
      "Longitude": 85.52
    },
    {
      "State": "Bihar",
      "District": "Patna",
      "City": "Dinapur Nizamat (Nagar Parishad)",
      "Population": 182429,
      "Area (in km^2)": 0,
      "Latitude": 25.63,
      "Longitude": 85.05
    },
    {
      "State": "Bihar",
      "District": "Patna",
      "City": "Patna",
      "Population": 1684297,
      "Area (in km^2)": 99,
      "Latitude": 25.61,
      "Longitude": 85.16
    },
    {
      "State": "Bihar",
      "District": "Bhojpur",
      "City": "Arrah",
      "Population": 261430,
      "Area (in km^2)": 191,
      "Latitude": 25.56,
      "Longitude": 84.66
    },
    {
      "State": "Bihar",
      "District": "Buxar",
      "City": "Buxar (Nagar Parishad)",
      "Population": 102861,
      "Area (in km^2)": 0,
      "Latitude": 25.56,
      "Longitude": 83.98
    },
    {
      "State": "Bihar",
      "District": "Rohtas",
      "City": "Sasaram (Nagar Parishad)",
      "Population": 147408,
      "Area (in km^2)": 0,
      "Latitude": 24.95,
      "Longitude": 84.03
    },
    {
      "State": "Bihar",
      "District": "Rohtas",
      "City": "Dehri (Nagar Parishad)",
      "Population": 137231,
      "Area (in km^2)": 0,
      "Latitude": 24.91,
      "Longitude": 84.18
    },
    {
      "State": "Bihar",
      "District": "Aurangabad",
      "City": "Aurangabad (Nagar Parishad)",
      "Population": 102244,
      "Area (in km^2)": 1420,
      "Latitude": 24.7,
      "Longitude": 84.35
    },
    {
      "State": "Bihar",
      "District": "Gaya",
      "City": "Gaya",
      "Population": 474093,
      "Area (in km^2)": 0,
      "Latitude": 24.78,
      "Longitude": 84.98
    },
    {
      "State": "Bihar",
      "District": "Jehanabad",
      "City": "Jehanabad (Nagar Parishad)",
      "Population": 103202,
      "Area (in km^2)": 0,
      "Latitude": 25.21,
      "Longitude": 84.98
    },
    {
      "State": "Sikkim",
      "District": "East District",
      "City": "Gangtok",
      "Population": 100286,
      "Area (in km^2)": 563,
      "Latitude": 27.34,
      "Longitude": 88.61
    },
    {
      "State": "Nagaland",
      "District": "Dimapur",
      "City": "Dimapur",
      "Population": 122834,
      "Area (in km^2)": 121,
      "Latitude": 25.91,
      "Longitude": 93.73
    },
    {
      "State": "Manipur",
      "District": "Imphal West",
      "City": "Imphal",
      "Population": 193459,
      "Area (in km^2)": 0,
      "Latitude": 24.81,
      "Longitude": 93.95
    },
    {
      "State": "Mizoram",
      "District": "Aizawl",
      "City": "Aizawl",
      "Population": 293416,
      "Area (in km^2)": 457,
      "Latitude": 23.73,
      "Longitude": 92.72
    },
    {
      "State": "Tripura",
      "District": "West Tripura",
      "City": "Agartala",
      "Population": 400004,
      "Area (in km^2)": 76.504,
      "Latitude": 23.83,
      "Longitude": 91.28
    },
    {
      "State": "Meghalaya",
      "District": "East Khasi Hills",
      "City": "Shillong",
      "Population": 143229,
      "Area (in km^2)": 64.36,
      "Latitude": 25.57,
      "Longitude": 91.88
    },
    {
      "State": "Assam",
      "District": "Nagaon",
      "City": "Nagaon",
      "Population": 121628,
      "Area (in km^2)": 362,
      "Latitude": 26.35,
      "Longitude": 92.67
    },
    {
      "State": "Assam",
      "District": "Tinsukia",
      "City": "Tinsukia",
      "Population": 116322,
      "Area (in km^2)": 853,
      "Latitude": 27.5,
      "Longitude": 95.37
    },
    {
      "State": "Assam",
      "District": "Dibrugarh",
      "City": "Dibrugarh",
      "Population": 144063,
      "Area (in km^2)": 12.65,
      "Latitude": 27.47,
      "Longitude": 94.91
    },
    {
      "State": "Assam",
      "District": "Cachar",
      "City": "Silchar",
      "Population": 178865,
      "Area (in km^2)": 871,
      "Latitude": 24.83,
      "Longitude": 92.78
    },
    {
      "State": "Assam",
      "District": "Kamrup Metropolitan",
      "City": "Guwahati",
      "Population": 963429,
      "Area (in km^2)": 100,
      "Latitude": 26.15,
      "Longitude": 91.73
    },
    {
      "State": "West Bengal",
      "District": "Darjiling",
      "City": "Darjiling",
      "Population": 118805,
      "Area (in km^2)": 10.57,
      "Latitude": 27.05,
      "Longitude": 88.27
    },
    {
      "State": "West Bengal",
      "District": "Darjiling",
      "City": "Siliguri",
      "Population": 509709,
      "Area (in km^2)": 260,
      "Latitude": 26.73,
      "Longitude": 88.41
    },
    {
      "State": "West Bengal",
      "District": "Jalpaiguri",
      "City": "Dabgram",
      "Population": 119040,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "West Bengal",
      "District": "Jalpaiguri",
      "City": "Jalpaiguri",
      "Population": 107341,
      "Area (in km^2)": 502,
      "Latitude": 26.54,
      "Longitude": 88.72
    },
    {
      "State": "West Bengal",
      "District": "Uttar Dinajpur",
      "City": "Raiganj",
      "Population": 183612,
      "Area (in km^2)": 488,
      "Latitude": 25.62,
      "Longitude": 88.13
    },
    {
      "State": "West Bengal",
      "District": "Dakshin Dinajpur",
      "City": "Balurghat",
      "Population": 153279,
      "Area (in km^2)": 355,
      "Latitude": 25.24,
      "Longitude": 88.78
    },
    {
      "State": "West Bengal",
      "District": "Murshidabad",
      "City": "Berhampore",
      "Population": 195223,
      "Area (in km^2)": 278,
      "Latitude": 24.1,
      "Longitude": 88.27
    },
    {
      "State": "West Bengal",
      "District": "Barddhaman",
      "City": "Kulti",
      "Population": 313809,
      "Area (in km^2)": 0,
      "Latitude": 23.73,
      "Longitude": 86.85
    },
    {
      "State": "West Bengal",
      "District": "Barddhaman",
      "City": "Asansol",
      "Population": 563917,
      "Area (in km^2)": 326.48,
      "Latitude": 23.67,
      "Longitude": 86.95
    },
    {
      "State": "West Bengal",
      "District": "Barddhaman",
      "City": "Jamuria",
      "Population": 149220,
      "Area (in km^2)": 134,
      "Latitude": 23.7,
      "Longitude": 87.08
    },
    {
      "State": "West Bengal",
      "District": "Barddhaman",
      "City": "Raniganj",
      "Population": 129441,
      "Area (in km^2)": 81,
      "Latitude": 23.63,
      "Longitude": 87.09
    },
    {
      "State": "West Bengal",
      "District": "Barddhaman",
      "City": "Durgapur",
      "Population": 566517,
      "Area (in km^2)": 154.2,
      "Latitude": 23.53,
      "Longitude": 87.32
    },
    {
      "State": "West Bengal",
      "District": "Barddhaman",
      "City": "Barddhaman",
      "Population": 314265,
      "Area (in km^2)": 0,
      "Latitude": 23.23,
      "Longitude": 87.87
    },
    {
      "State": "West Bengal",
      "District": "Nadia",
      "City": "Nabadwip",
      "Population": 125543,
      "Area (in km^2)": 93,
      "Latitude": 23.41,
      "Longitude": 88.37
    },
    {
      "State": "West Bengal",
      "District": "Nadia",
      "City": "Krishnanagar",
      "Population": 153062,
      "Area (in km^2)": 26,
      "Latitude": 23.4,
      "Longitude": 88.5
    },
    {
      "State": "West Bengal",
      "District": "Nadia",
      "City": "Santipur",
      "Population": 151777,
      "Area (in km^2)": 177,
      "Latitude": 23.26,
      "Longitude": 88.44
    },
    {
      "State": "West Bengal",
      "District": "Nadia",
      "City": "Kalyani",
      "Population": 100575,
      "Area (in km^2)": 0,
      "Latitude": 22.98,
      "Longitude": 88.43
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Bongaon",
      "Population": 108864,
      "Area (in km^2)": 344,
      "Latitude": 23.07,
      "Longitude": 88.82
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Halisahar",
      "Population": 124939,
      "Area (in km^2)": 8.29,
      "Latitude": 22.93,
      "Longitude": 88.42
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Kanchrapara",
      "Population": 129576,
      "Area (in km^2)": 9.06,
      "Latitude": 22.95,
      "Longitude": 88.42
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Naihati",
      "Population": 217900,
      "Area (in km^2)": 11.55,
      "Latitude": 22.88,
      "Longitude": 88.42
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Bhatpara",
      "Population": 386019,
      "Area (in km^2)": 34.69,
      "Latitude": 22.87,
      "Longitude": 88.42
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Habra",
      "Population": 147221,
      "Area (in km^2)": 21.8,
      "Latitude": 22.85,
      "Longitude": 88.66
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Ashokenagar Kalyangarh",
      "Population": 121592,
      "Area (in km^2)": 20,
      "Latitude": 22.83,
      "Longitude": 88.63
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "North Barrackpore",
      "Population": 132806,
      "Area (in km^2)": 11,
      "Latitude": 22.76,
      "Longitude": 88.37
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Barrackpore",
      "Population": 152783,
      "Area (in km^2)": 10.61,
      "Latitude": 22.77,
      "Longitude": 88.39
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Titagarh",
      "Population": 116541,
      "Area (in km^2)": 3.24,
      "Latitude": 22.73,
      "Longitude": 88.37
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Khardah",
      "Population": 108496,
      "Area (in km^2)": 0,
      "Latitude": 22.72,
      "Longitude": 88.38
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Panihati",
      "Population": 377347,
      "Area (in km^2)": 19.38,
      "Latitude": 22.68,
      "Longitude": 88.37
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Barasat",
      "Population": 278435,
      "Area (in km^2)": 34.06,
      "Latitude": 22.72,
      "Longitude": 88.48
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Madhyamgram",
      "Population": 196127,
      "Area (in km^2)": 0,
      "Latitude": 22.7,
      "Longitude": 88.45
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "North DumDum",
      "Population": 249142,
      "Area (in km^2)": 26,
      "Latitude": 22.65,
      "Longitude": 88.41
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Kamarhati",
      "Population": 330211,
      "Area (in km^2)": 10.96,
      "Latitude": 22.67,
      "Longitude": 88.37
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Baranagar",
      "Population": 245213,
      "Area (in km^2)": 7.12,
      "Latitude": 22.63,
      "Longitude": 88.37
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Dum Dum",
      "Population": 114786,
      "Area (in km^2)": 9.73,
      "Latitude": 22.62,
      "Longitude": 88.42
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "South DumDum",
      "Population": 403316,
      "Area (in km^2)": 0,
      "Latitude": 22.61,
      "Longitude": 88.4
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Rajarhat Gopalpur",
      "Population": 402844,
      "Area (in km^2)": 0,
      "Latitude": 22.62,
      "Longitude": 88.51
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Bidhannagar",
      "Population": 215514,
      "Area (in km^2)": 0,
      "Latitude": 22.58,
      "Longitude": 88.42
    },
    {
      "State": "West Bengal",
      "District": "North Twenty Four Parganas",
      "City": "Basirhat",
      "Population": 125254,
      "Area (in km^2)": 0,
      "Latitude": 22.66,
      "Longitude": 88.87
    },
    {
      "State": "West Bengal",
      "District": "Hugli",
      "City": "Bansberia",
      "Population": 103920,
      "Area (in km^2)": 9.07,
      "Latitude": 22.97,
      "Longitude": 88.4
    },
    {
      "State": "West Bengal",
      "District": "Hugli",
      "City": "Hugli-Chinsurah",
      "Population": 179931,
      "Area (in km^2)": 0,
      "Latitude": 22.9,
      "Longitude": 88.39
    },
    {
      "State": "West Bengal",
      "District": "Hugli",
      "City": "Chandannagar",
      "Population": 166867,
      "Area (in km^2)": 19,
      "Latitude": 22.86,
      "Longitude": 88.36
    },
    {
      "State": "West Bengal",
      "District": "Hugli",
      "City": "Bhadreswar",
      "Population": 101477,
      "Area (in km^2)": 8,
      "Latitude": 22.82,
      "Longitude": 88.35
    },
    {
      "State": "West Bengal",
      "District": "Hugli",
      "City": "Champdani",
      "Population": 111251,
      "Area (in km^2)": 6.59,
      "Latitude": 22.8,
      "Longitude": 88.33
    },
    {
      "State": "West Bengal",
      "District": "Hugli",
      "City": "Baidyabati",
      "Population": 121110,
      "Area (in km^2)": 12.03,
      "Latitude": 22.8,
      "Longitude": 88.32
    },
    {
      "State": "West Bengal",
      "District": "Hugli",
      "City": "Serampore",
      "Population": 181842,
      "Area (in km^2)": 11.6,
      "Latitude": 22.75,
      "Longitude": 88.33
    },
    {
      "State": "West Bengal",
      "District": "Hugli",
      "City": "Rishra",
      "Population": 124577,
      "Area (in km^2)": 0,
      "Latitude": 22.72,
      "Longitude": 88.35
    },
    {
      "State": "West Bengal",
      "District": "Hugli",
      "City": "Uttarpara Kotrung",
      "Population": 159147,
      "Area (in km^2)": 11.75,
      "Latitude": 22.68,
      "Longitude": 88.34
    },
    {
      "State": "West Bengal",
      "District": "Bankura",
      "City": "Bankura",
      "Population": 137386,
      "Area (in km^2)": 19.06,
      "Latitude": 23.23,
      "Longitude": 87.09
    },
    {
      "State": "West Bengal",
      "District": "Puruliya",
      "City": "Puruliya",
      "Population": 121067,
      "Area (in km^2)": 140.18,
      "Latitude": 23.33,
      "Longitude": 86.37
    },
    {
      "State": "West Bengal",
      "District": "Haora",
      "City": "Bally",
      "Population": 113377,
      "Area (in km^2)": 0,
      "Latitude": 22.66,
      "Longitude": 88.34
    },
    {
      "State": "West Bengal",
      "District": "Haora",
      "City": "Bally",
      "Population": 293373,
      "Area (in km^2)": 0,
      "Latitude": 22.66,
      "Longitude": 88.34
    },
    {
      "State": "West Bengal",
      "District": "Haora",
      "City": "Haora",
      "Population": 1077075,
      "Area (in km^2)": 63.55,
      "Latitude": 22.58,
      "Longitude": 88.25
    },
    {
      "State": "West Bengal",
      "District": "Haora",
      "City": "Uluberia",
      "Population": 235345,
      "Area (in km^2)": 0,
      "Latitude": 22.47,
      "Longitude": 88.12
    },
    {
      "State": "West Bengal",
      "District": "Kolkata",
      "City": "Kolkata",
      "Population": 4496694,
      "Area (in km^2)": 205,
      "Latitude": 22.57,
      "Longitude": 88.36
    },
    {
      "State": "West Bengal",
      "District": "South Twenty Four Parganas",
      "City": "Maheshtala",
      "Population": 448317,
      "Area (in km^2)": 44.18,
      "Latitude": 22.51,
      "Longitude": 88.25
    },
    {
      "State": "West Bengal",
      "District": "South Twenty Four Parganas",
      "City": "Rajpur Sonarpur",
      "Population": 424368,
      "Area (in km^2)": 49.26,
      "Latitude": 22.44,
      "Longitude": 88.39
    },
    {
      "State": "West Bengal",
      "District": "Paschim Medinipur",
      "City": "Medinipur",
      "Population": 169264,
      "Area (in km^2)": 0,
      "Latitude": 22.43,
      "Longitude": 87.32
    },
    {
      "State": "West Bengal",
      "District": "Paschim Medinipur",
      "City": "Kharagpur",
      "Population": 207604,
      "Area (in km^2)": 127,
      "Latitude": 22.35,
      "Longitude": 87.23
    },
    {
      "State": "West Bengal",
      "District": "Purba Medinipur",
      "City": "Haldia",
      "Population": 200827,
      "Area (in km^2)": 300,
      "Latitude": 22.07,
      "Longitude": 88.07
    },
    {
      "State": "Jharkhand",
      "District": "Giridih",
      "City": "Giridih",
      "Population": 114533,
      "Area (in km^2)": 409,
      "Latitude": 24.18,
      "Longitude": 86.3
    },
    {
      "State": "Jharkhand",
      "District": "Deoghar",
      "City": "Deoghar",
      "Population": 203123,
      "Area (in km^2)": 338,
      "Latitude": 24.48,
      "Longitude": 86.7
    },
    {
      "State": "Jharkhand",
      "District": "Dhanbad",
      "City": "Dhanbad",
      "Population": 1162472,
      "Area (in km^2)": 577,
      "Latitude": 23.8,
      "Longitude": 86.43
    },
    {
      "State": "Jharkhand",
      "District": "Bokaro",
      "City": "Chas (Nagar Parishad)",
      "Population": 141640,
      "Area (in km^2)": 0,
      "Latitude": 23.63,
      "Longitude": 86.16
    },
    {
      "State": "Jharkhand",
      "District": "Bokaro",
      "City": "Bokaro Steel City",
      "Population": 414820,
      "Area (in km^2)": 183,
      "Latitude": 23.67,
      "Longitude": 86.15
    },
    {
      "State": "Jharkhand",
      "District": "Purbi Singhbhum",
      "City": "Mango",
      "Population": 223805,
      "Area (in km^2)": 0,
      "Latitude": 22.81,
      "Longitude": 86.2
    },
    {
      "State": "Jharkhand",
      "District": "Purbi Singhbhum",
      "City": "Jamshedpur",
      "Population": 677350,
      "Area (in km^2)": 224,
      "Latitude": 22.81,
      "Longitude": 86.2
    },
    {
      "State": "Jharkhand",
      "District": "Hazaribagh",
      "City": "Hazaribag (Nagar Parishad)",
      "Population": 142489,
      "Area (in km^2)": 0,
      "Latitude": 23.98,
      "Longitude": 85.35
    },
    {
      "State": "Jharkhand",
      "District": "Ranchi",
      "City": "Ranchi",
      "Population": 1073427,
      "Area (in km^2)": 652.02,
      "Latitude": 23.34,
      "Longitude": 85.31
    },
    {
      "State": "Jharkhand",
      "District": "Saraikela-Kharsawan",
      "City": "Adityapur (Nagar Parishad)",
      "Population": 174355,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Odisha",
      "District": "Sambalpur",
      "City": "Sambalpur",
      "Population": 189366,
      "Area (in km^2)": 50,
      "Latitude": 21.47,
      "Longitude": 83.98
    },
    {
      "State": "Odisha",
      "District": "Sundargarh",
      "City": "Raurkela",
      "Population": 320040,
      "Area (in km^2)": 56,
      "Latitude": 22.23,
      "Longitude": 84.87
    },
    {
      "State": "Odisha",
      "District": "Mayurbhanj",
      "City": "Baripada",
      "Population": 116849,
      "Area (in km^2)": 40,
      "Latitude": 21.93,
      "Longitude": 86.75
    },
    {
      "State": "Odisha",
      "District": "Baleshwar",
      "City": "Baleshwar",
      "Population": 144373,
      "Area (in km^2)": 38,
      "Latitude": 21.48,
      "Longitude": 86.93
    },
    {
      "State": "Odisha",
      "District": "Bhadrak",
      "City": "Bhadrak",
      "Population": 121338,
      "Area (in km^2)": 78.86,
      "Latitude": 21.05,
      "Longitude": 86.49
    },
    {
      "State": "Odisha",
      "District": "Cuttack",
      "City": "Cuttack",
      "Population": 610189,
      "Area (in km^2)": 398,
      "Latitude": 20.46,
      "Longitude": 85.88
    },
    {
      "State": "Odisha",
      "District": "Khordha",
      "City": "Bhubaneswar",
      "Population": 885363,
      "Area (in km^2)": 185,
      "Latitude": 20.3,
      "Longitude": 85.82
    },
    {
      "State": "Odisha",
      "District": "Puri",
      "City": "Puri",
      "Population": 200564,
      "Area (in km^2)": 17,
      "Latitude": 19.82,
      "Longitude": 85.83
    },
    {
      "State": "Odisha",
      "District": "Ganjam",
      "City": "Brahmapur",
      "Population": 356598,
      "Area (in km^2)": 80,
      "Latitude": 19.31,
      "Longitude": 84.79
    },
    {
      "State": "Chhattisgarh",
      "District": "Surguja",
      "City": "Ambikapur",
      "Population": 121071,
      "Area (in km^2)": 733,
      "Latitude": 23.12,
      "Longitude": 83.2
    },
    {
      "State": "Chhattisgarh",
      "District": "Raigarh",
      "City": "Raigarh",
      "Population": 150019,
      "Area (in km^2)": 652,
      "Latitude": 21.9,
      "Longitude": 83.4
    },
    {
      "State": "Chhattisgarh",
      "District": "Korba",
      "City": "Korba",
      "Population": 363210,
      "Area (in km^2)": 1996,
      "Latitude": 22.36,
      "Longitude": 82.73
    },
    {
      "State": "Chhattisgarh",
      "District": "Bilaspur",
      "City": "Bilaspur",
      "Population": 349107,
      "Area (in km^2)": 448,
      "Latitude": 22.08,
      "Longitude": 82.15
    },
    {
      "State": "Chhattisgarh",
      "District": "Rajnandgaon",
      "City": "Rajnandgaon",
      "Population": 163114,
      "Area (in km^2)": 745,
      "Latitude": 21.1,
      "Longitude": 81.03
    },
    {
      "State": "Chhattisgarh",
      "District": "Durg",
      "City": "Bhilai Nagar",
      "Population": 618611,
      "Area (in km^2)": 341,
      "Latitude": 21.21,
      "Longitude": 81.38
    },
    {
      "State": "Chhattisgarh",
      "District": "Durg",
      "City": "Durg",
      "Population": 268806,
      "Area (in km^2)": 639,
      "Latitude": 21.19,
      "Longitude": 81.28
    },
    {
      "State": "Chhattisgarh",
      "District": "Raipur",
      "City": "Raipur",
      "Population": 1027264,
      "Area (in km^2)": 653,
      "Latitude": 21.25,
      "Longitude": 81.63
    },
    {
      "State": "Chhattisgarh",
      "District": "Dhamtari",
      "City": "Dhamtari",
      "Population": 101677,
      "Area (in km^2)": 681,
      "Latitude": 20.71,
      "Longitude": 81.55
    },
    {
      "State": "Chhattisgarh",
      "District": "Bastar",
      "City": "Jagdalpur",
      "Population": 125463,
      "Area (in km^2)": 720,
      "Latitude": 19.07,
      "Longitude": 82.03
    },
    {
      "State": "Madhya Pradesh",
      "District": "Morena",
      "City": "Morena",
      "Population": 200482,
      "Area (in km^2)": 1071,
      "Latitude": 26.5,
      "Longitude": 78
    },
    {
      "State": "Madhya Pradesh",
      "District": "Bhind",
      "City": "Bhind",
      "Population": 197585,
      "Area (in km^2)": 1189,
      "Latitude": 26.56,
      "Longitude": 78.79
    },
    {
      "State": "Madhya Pradesh",
      "District": "Gwalior",
      "City": "Gwalior",
      "Population": 1054420,
      "Area (in km^2)": 2668,
      "Latitude": 26.22,
      "Longitude": 78.18
    },
    {
      "State": "Madhya Pradesh",
      "District": "Datia",
      "City": "Datia",
      "Population": 100284,
      "Area (in km^2)": 1206,
      "Latitude": 25.67,
      "Longitude": 78.46
    },
    {
      "State": "Madhya Pradesh",
      "District": "Shivpuri",
      "City": "Shivpuri",
      "Population": 179977,
      "Area (in km^2)": 1937,
      "Latitude": 25.42,
      "Longitude": 77.66
    },
    {
      "State": "Madhya Pradesh",
      "District": "Chhatarpur",
      "City": "Chhatarpur",
      "Population": 142128,
      "Area (in km^2)": 1065,
      "Latitude": 24.92,
      "Longitude": 79.58
    },
    {
      "State": "Madhya Pradesh",
      "District": "Sagar",
      "City": "Sagar",
      "Population": 274556,
      "Area (in km^2)": 2157,
      "Latitude": 23.83,
      "Longitude": 78.75
    },
    {
      "State": "Madhya Pradesh",
      "District": "Damoh",
      "City": "Damoh",
      "Population": 139561,
      "Area (in km^2)": 1227,
      "Latitude": 23.84,
      "Longitude": 79.44
    },
    {
      "State": "Madhya Pradesh",
      "District": "Satna",
      "City": "Satna",
      "Population": 282977,
      "Area (in km^2)": 0,
      "Latitude": 24.58,
      "Longitude": 80.83
    },
    {
      "State": "Madhya Pradesh",
      "District": "Rewa",
      "City": "Rewa",
      "Population": 235654,
      "Area (in km^2)": 0,
      "Latitude": 24.53,
      "Longitude": 81.3
    },
    {
      "State": "Madhya Pradesh",
      "District": "Neemuch",
      "City": "Neemuch",
      "Population": 128561,
      "Area (in km^2)": 566,
      "Latitude": 24.47,
      "Longitude": 74.87
    },
    {
      "State": "Madhya Pradesh",
      "District": "Mandsaur",
      "City": "Mandsaur",
      "Population": 141667,
      "Area (in km^2)": 935,
      "Latitude": 24.08,
      "Longitude": 75.07
    },
    {
      "State": "Madhya Pradesh",
      "District": "Ratlam",
      "City": "Ratlam",
      "Population": 264914,
      "Area (in km^2)": 1321,
      "Latitude": 23.33,
      "Longitude": 75.04
    },
    {
      "State": "Madhya Pradesh",
      "District": "Ujjain",
      "City": "Nagda",
      "Population": 100039,
      "Area (in km^2)": 652,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Madhya Pradesh",
      "District": "Ujjain",
      "City": "Ujjain",
      "Population": 515215,
      "Area (in km^2)": 745,
      "Latitude": 23.18,
      "Longitude": 75.78
    },
    {
      "State": "Madhya Pradesh",
      "District": "Dewas",
      "City": "Dewas",
      "Population": 289550,
      "Area (in km^2)": 1001,
      "Latitude": 22.96,
      "Longitude": 76.05
    },
    {
      "State": "Madhya Pradesh",
      "District": "Dhar",
      "City": "Pithampur",
      "Population": 126200,
      "Area (in km^2)": 200,
      "Latitude": 22.61,
      "Longitude": 75.68
    },
    {
      "State": "Madhya Pradesh",
      "District": "Indore",
      "City": "Indore",
      "Population": 1992422,
      "Area (in km^2)": 891,
      "Latitude": 22.72,
      "Longitude": 75.86
    },
    {
      "State": "Madhya Pradesh",
      "District": "Khargone (West Nimar)",
      "City": "Khargone",
      "Population": 116150,
      "Area (in km^2)": 0,
      "Latitude": 21.83,
      "Longitude": 75.61
    },
    {
      "State": "Madhya Pradesh",
      "District": "Vidisha",
      "City": "Vidisha",
      "Population": 155951,
      "Area (in km^2)": 1071,
      "Latitude": 23.53,
      "Longitude": 77.82
    },
    {
      "State": "Madhya Pradesh",
      "District": "Bhopal",
      "City": "Bhopal",
      "Population": 1798218,
      "Area (in km^2)": 285.88,
      "Latitude": 23.26,
      "Longitude": 77.41
    },
    {
      "State": "Madhya Pradesh",
      "District": "Sehore",
      "City": "Sehore",
      "Population": 109118,
      "Area (in km^2)": 911,
      "Latitude": 23.2,
      "Longitude": 77.1
    },
    {
      "State": "Madhya Pradesh",
      "District": "Betul",
      "City": "Betul",
      "Population": 103330,
      "Area (in km^2)": 1347,
      "Latitude": 21.92,
      "Longitude": 77.9
    },
    {
      "State": "Madhya Pradesh",
      "District": "Hoshangabad",
      "City": "Hoshangabad",
      "Population": 117988,
      "Area (in km^2)": 231,
      "Latitude": 22.74,
      "Longitude": 77.74
    },
    {
      "State": "Madhya Pradesh",
      "District": "Katni",
      "City": "Murwara (Katni)",
      "Population": 221883,
      "Area (in km^2)": 634,
      "Latitude": 23.48,
      "Longitude": 80.4
    },
    {
      "State": "Madhya Pradesh",
      "District": "Jabalpur",
      "City": "Jabalpur",
      "Population": 1069292,
      "Area (in km^2)": 1147,
      "Latitude": 23.17,
      "Longitude": 79.93
    },
    {
      "State": "Madhya Pradesh",
      "District": "Chhindwara",
      "City": "Chhindwara",
      "Population": 175052,
      "Area (in km^2)": 627,
      "Latitude": 22.06,
      "Longitude": 78.94
    },
    {
      "State": "Madhya Pradesh",
      "District": "Seoni",
      "City": "Seoni",
      "Population": 102343,
      "Area (in km^2)": 1411,
      "Latitude": 22.09,
      "Longitude": 79.54
    },
    {
      "State": "Madhya Pradesh",
      "District": "Guna",
      "City": "Guna",
      "Population": 180935,
      "Area (in km^2)": 1636,
      "Latitude": 24.65,
      "Longitude": 77.32
    },
    {
      "State": "Madhya Pradesh",
      "District": "Singrauli",
      "City": "Singrauli",
      "Population": 220257,
      "Area (in km^2)": 1908,
      "Latitude": 24.2,
      "Longitude": 82.65
    },
    {
      "State": "Madhya Pradesh",
      "District": "Khandwa (East Nimar)",
      "City": "Khandwa",
      "Population": 200738,
      "Area (in km^2)": 0,
      "Latitude": 21.83,
      "Longitude": 76.35
    },
    {
      "State": "Madhya Pradesh",
      "District": "Burhanpur",
      "City": "Burhanpur",
      "Population": 210886,
      "Area (in km^2)": 1054,
      "Latitude": 21.31,
      "Longitude": 76.23
    },
    {
      "State": "Gujarat",
      "District": "Kachchh",
      "City": "Bhuj",
      "Population": 148834,
      "Area (in km^2)": 5936,
      "Latitude": 23.24,
      "Longitude": 69.67
    },
    {
      "State": "Gujarat",
      "District": "Kachchh",
      "City": "Gandhidham",
      "Population": 247992,
      "Area (in km^2)": 217,
      "Latitude": 23.08,
      "Longitude": 70.14
    },
    {
      "State": "Gujarat",
      "District": "Banas Kantha",
      "City": "Palanpur",
      "Population": 141592,
      "Area (in km^2)": 787,
      "Latitude": 24.18,
      "Longitude": 72.43
    },
    {
      "State": "Gujarat",
      "District": "Banas Kantha",
      "City": "Deesa",
      "Population": 111160,
      "Area (in km^2)": 1478,
      "Latitude": 24.26,
      "Longitude": 72.19
    },
    {
      "State": "Gujarat",
      "District": "Patan ",
      "City": "Patan",
      "Population": 133737,
      "Area (in km^2)": 0,
      "Latitude": 23.85,
      "Longitude": 72.13
    },
    {
      "State": "Gujarat",
      "District": "Mahesana",
      "City": "Mahesana",
      "Population": 190753,
      "Area (in km^2)": 843,
      "Latitude": 23.6,
      "Longitude": 72.4
    },
    {
      "State": "Gujarat",
      "District": "Gandhinagar",
      "City": "Kalol",
      "Population": 134426,
      "Area (in km^2)": 488,
      "Latitude": 22.61,
      "Longitude": 73.46
    },
    {
      "State": "Gujarat",
      "District": "Gandhinagar",
      "City": "Gandhinagar",
      "Population": 292797,
      "Area (in km^2)": 671,
      "Latitude": 23.24,
      "Longitude": 72.65
    },
    {
      "State": "Gujarat",
      "District": "Ahmadabad",
      "City": "Ahmadabad",
      "Population": 5577940,
      "Area (in km^2)": 1866,
      "Latitude": 23.03,
      "Longitude": 72.58
    },
    {
      "State": "Gujarat",
      "District": "Surendranagar",
      "City": "Surendranagar Dudhrej",
      "Population": 177851,
      "Area (in km^2)": 45,
      "Latitude": 22.72,
      "Longitude": 71.72
    },
    {
      "State": "Gujarat",
      "District": "Rajkot",
      "City": "Morvi",
      "Population": 210451,
      "Area (in km^2)": 1070,
      "Latitude": 22.82,
      "Longitude": 70.83
    },
    {
      "State": "Gujarat",
      "District": "Rajkot",
      "City": "Rajkot",
      "Population": 1323363,
      "Area (in km^2)": 1115,
      "Latitude": 22.31,
      "Longitude": 70.8
    },
    {
      "State": "Gujarat",
      "District": "Rajkot",
      "City": "Gondal",
      "Population": 112197,
      "Area (in km^2)": 1145,
      "Latitude": 21.96,
      "Longitude": 70.79
    },
    {
      "State": "Gujarat",
      "District": "Rajkot",
      "City": "Jetpur Navagadh",
      "Population": 118302,
      "Area (in km^2)": 0,
      "Latitude": 21.75,
      "Longitude": 70.62
    },
    {
      "State": "Gujarat",
      "District": "Jamnagar",
      "City": "Jamnagar",
      "Population": 600943,
      "Area (in km^2)": 1901,
      "Latitude": 22.47,
      "Longitude": 70.06
    },
    {
      "State": "Gujarat",
      "District": "Porbandar",
      "City": "Porbandar",
      "Population": 152760,
      "Area (in km^2)": 1145,
      "Latitude": 21.64,
      "Longitude": 69.61
    },
    {
      "State": "Gujarat",
      "District": "Junagadh",
      "City": "Junagadh",
      "Population": 319462,
      "Area (in km^2)": 680,
      "Latitude": 21.52,
      "Longitude": 70.46
    },
    {
      "State": "Gujarat",
      "District": "Junagadh",
      "City": "Veraval",
      "Population": 171121,
      "Area (in km^2)": 0,
      "Latitude": 20.92,
      "Longitude": 70.37
    },
    {
      "State": "Gujarat",
      "District": "Amreli",
      "City": "Amreli",
      "Population": 117967,
      "Area (in km^2)": 833,
      "Latitude": 21.6,
      "Longitude": 71.22
    },
    {
      "State": "Gujarat",
      "District": "Bhavnagar",
      "City": "Botad",
      "Population": 130327,
      "Area (in km^2)": 794,
      "Latitude": 22.17,
      "Longitude": 71.67
    },
    {
      "State": "Gujarat",
      "District": "Bhavnagar",
      "City": "Bhavnagar",
      "Population": 605882,
      "Area (in km^2)": 2293,
      "Latitude": 21.77,
      "Longitude": 72.15
    },
    {
      "State": "Gujarat",
      "District": "Anand ",
      "City": "Anand",
      "Population": 209410,
      "Area (in km^2)": 0,
      "Latitude": 22.55,
      "Longitude": 72.95
    },
    {
      "State": "Gujarat",
      "District": "Kheda",
      "City": "Nadiad",
      "Population": 225071,
      "Area (in km^2)": 404,
      "Latitude": 22.7,
      "Longitude": 72.87
    },
    {
      "State": "Gujarat",
      "District": "Panch Mahals",
      "City": "Godhra",
      "Population": 143644,
      "Area (in km^2)": 765,
      "Latitude": 22.77,
      "Longitude": 73.62
    },
    {
      "State": "Gujarat",
      "District": "Dohad ",
      "City": "Dohad",
      "Population": 118846,
      "Area (in km^2)": 14,
      "Latitude": 22.83,
      "Longitude": 74.25
    },
    {
      "State": "Gujarat",
      "District": "Vadodara",
      "City": "Vadodara",
      "Population": 1752371,
      "Area (in km^2)": 671,
      "Latitude": 22.31,
      "Longitude": 73.19
    },
    {
      "State": "Gujarat",
      "District": "Bharuch",
      "City": "Bharuch",
      "Population": 169007,
      "Area (in km^2)": 634,
      "Latitude": 21.71,
      "Longitude": 73
    },
    {
      "State": "Gujarat",
      "District": "Navsari ",
      "City": "Navsari",
      "Population": 171109,
      "Area (in km^2)": 0,
      "Latitude": 20.95,
      "Longitude": 72.93
    },
    {
      "State": "Gujarat",
      "District": "Valsad",
      "City": "Valsad",
      "Population": 139764,
      "Area (in km^2)": 524,
      "Latitude": 20.6,
      "Longitude": 72.92
    },
    {
      "State": "Gujarat",
      "District": "Valsad",
      "City": "Vapi",
      "Population": 163630,
      "Area (in km^2)": 0,
      "Latitude": 20.37,
      "Longitude": 72.92
    },
    {
      "State": "Gujarat",
      "District": "Surat",
      "City": "Surat",
      "Population": 4467797,
      "Area (in km^2)": 326.515,
      "Latitude": 21.17,
      "Longitude": 72.83
    },
    {
      "State": "Maharashtra",
      "District": "Nandurbar",
      "City": "Nandurbar",
      "Population": 111037,
      "Area (in km^2)": 1054,
      "Latitude": 21.37,
      "Longitude": 74.25
    },
    {
      "State": "Maharashtra",
      "District": "Dhule",
      "City": "Dhule",
      "Population": 375559,
      "Area (in km^2)": 1972,
      "Latitude": 20.9,
      "Longitude": 74.77
    },
    {
      "State": "Maharashtra",
      "District": "Jalgaon",
      "City": "Bhusawal",
      "Population": 187421,
      "Area (in km^2)": 453,
      "Latitude": 21.05,
      "Longitude": 75.8
    },
    {
      "State": "Maharashtra",
      "District": "Jalgaon",
      "City": "Jalgaon",
      "Population": 460228,
      "Area (in km^2)": 822,
      "Latitude": 21,
      "Longitude": 75.56
    },
    {
      "State": "Maharashtra",
      "District": "Akola",
      "City": "Akola",
      "Population": 425817,
      "Area (in km^2)": 1141,
      "Latitude": 20.71,
      "Longitude": 77
    },
    {
      "State": "Maharashtra",
      "District": "Amravati",
      "City": "Achalpur",
      "Population": 112311,
      "Area (in km^2)": 667,
      "Latitude": 21.25,
      "Longitude": 77.5
    },
    {
      "State": "Maharashtra",
      "District": "Amravati",
      "City": "Amravati",
      "Population": 647057,
      "Area (in km^2)": 904,
      "Latitude": 20.94,
      "Longitude": 77.78
    },
    {
      "State": "Maharashtra",
      "District": "Wardha",
      "City": "Wardha",
      "Population": 106444,
      "Area (in km^2)": 775,
      "Latitude": 20.73,
      "Longitude": 78.6
    },
    {
      "State": "Maharashtra",
      "District": "Wardha",
      "City": "Hinganghat",
      "Population": 101805,
      "Area (in km^2)": 911,
      "Latitude": 20.55,
      "Longitude": 78.84
    },
    {
      "State": "Maharashtra",
      "District": "Nagpur",
      "City": "Nagpur",
      "Population": 2405665,
      "Area (in km^2)": 227.36,
      "Latitude": 21.15,
      "Longitude": 79.08
    },
    {
      "State": "Maharashtra",
      "District": "Gondiya",
      "City": "Gondiya",
      "Population": 132813,
      "Area (in km^2)": 663,
      "Latitude": 21.45,
      "Longitude": 80.18
    },
    {
      "State": "Maharashtra",
      "District": "Chandrapur",
      "City": "Chandrapur",
      "Population": 320379,
      "Area (in km^2)": 1180,
      "Latitude": 19.97,
      "Longitude": 79.3
    },
    {
      "State": "Maharashtra",
      "District": "Yavatmal",
      "City": "Yavatmal",
      "Population": 116551,
      "Area (in km^2)": 1118,
      "Latitude": 20.39,
      "Longitude": 78.12
    },
    {
      "State": "Maharashtra",
      "District": "Nanded",
      "City": "Nanded Waghala",
      "Population": 550439,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Maharashtra",
      "District": "Parbhani",
      "City": "Parbhani",
      "Population": 307170,
      "Area (in km^2)": 1131,
      "Latitude": 19.26,
      "Longitude": 76.77
    },
    {
      "State": "Maharashtra",
      "District": "Jalna",
      "City": "Jalna",
      "Population": 285577,
      "Area (in km^2)": 1168,
      "Latitude": 19.85,
      "Longitude": 75.89
    },
    {
      "State": "Maharashtra",
      "District": "Aurangabad",
      "City": "Aurangabad",
      "Population": 1175116,
      "Area (in km^2)": 1306,
      "Latitude": 19.9,
      "Longitude": 75.35
    },
    {
      "State": "Maharashtra",
      "District": "Nashik",
      "City": "Malegaon",
      "Population": 481228,
      "Area (in km^2)": 1818,
      "Latitude": 20.56,
      "Longitude": 74.53
    },
    {
      "State": "Maharashtra",
      "District": "Nashik",
      "City": "Nashik",
      "Population": 1486053,
      "Area (in km^2)": 891,
      "Latitude": 20,
      "Longitude": 73.79
    },
    {
      "State": "Maharashtra",
      "District": "Thane",
      "City": "Vasai-Virar City",
      "Population": 1222390,
      "Area (in km^2)": 380,
      "Latitude": 19.47,
      "Longitude": 72.8
    },
    {
      "State": "Maharashtra",
      "District": "Thane",
      "City": "Mira-Bhayandar",
      "Population": 809378,
      "Area (in km^2)": 79.4,
      "Latitude": 19.3,
      "Longitude": 72.85
    },
    {
      "State": "Maharashtra",
      "District": "Thane",
      "City": "Thane",
      "Population": 1841488,
      "Area (in km^2)": 400,
      "Latitude": 19.22,
      "Longitude": 72.98
    },
    {
      "State": "Maharashtra",
      "District": "Thane",
      "City": "Navi Mumbai",
      "Population": 1120547,
      "Area (in km^2)": 0,
      "Latitude": 19.02,
      "Longitude": 73.02
    },
    {
      "State": "Maharashtra",
      "District": "Thane",
      "City": "Bhiwandi Nizampur",
      "Population": 709665,
      "Area (in km^2)": 0,
      "Latitude": 19.29,
      "Longitude": 73.06
    },
    {
      "State": "Maharashtra",
      "District": "Thane",
      "City": "Kalyan-Dombivli",
      "Population": 1247327,
      "Area (in km^2)": 137.15,
      "Latitude": 19.23,
      "Longitude": 73.13
    },
    {
      "State": "Maharashtra",
      "District": "Thane",
      "City": "Ulhasnagar",
      "Population": 506098,
      "Area (in km^2)": 13,
      "Latitude": 19.22,
      "Longitude": 73.15
    },
    {
      "State": "Maharashtra",
      "District": "Thane",
      "City": "Badlapur",
      "Population": 174226,
      "Area (in km^2)": 35.68,
      "Latitude": 19.17,
      "Longitude": 73.24
    },
    {
      "State": "Maharashtra",
      "District": "Thane",
      "City": "Ambarnath",
      "Population": 253475,
      "Area (in km^2)": 328,
      "Latitude": 19.2,
      "Longitude": 73.18
    },
    {
      "State": "Maharashtra",
      "District": "Mumbai Suburban",
      "City": "Greater Mumbai",
      "Population": 12478447,
      "Area (in km^2)": 603,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Maharashtra",
      "District": "Raigarh",
      "City": "Panvel",
      "Population": 180020,
      "Area (in km^2)": 613,
      "Latitude": 18.98,
      "Longitude": 73.1
    },
    {
      "State": "Maharashtra",
      "District": "Raigarh",
      "City": "Navi Mumbai Panvel Raigarh",
      "Population": 195373,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Maharashtra",
      "District": "Pune",
      "City": "Pimpri Chinchwad",
      "Population": 1727692,
      "Area (in km^2)": 181,
      "Latitude": 18.62,
      "Longitude": 73.8
    },
    {
      "State": "Maharashtra",
      "District": "Pune",
      "City": "Pune",
      "Population": 3124458,
      "Area (in km^2)": 331.26,
      "Latitude": 18.52,
      "Longitude": 73.86
    },
    {
      "State": "Maharashtra",
      "District": "Ahmadnagar",
      "City": "Ahmadnagar",
      "Population": 350859,
      "Area (in km^2)": 39.3,
      "Latitude": 19.08,
      "Longitude": 74.73
    },
    {
      "State": "Maharashtra",
      "District": "Bid",
      "City": "Bid",
      "Population": 146709,
      "Area (in km^2)": 45,
      "Latitude": 18.99,
      "Longitude": 75.76
    },
    {
      "State": "Maharashtra",
      "District": "Latur",
      "City": "Latur",
      "Population": 382940,
      "Area (in km^2)": 1009,
      "Latitude": 18.41,
      "Longitude": 76.58
    },
    {
      "State": "Maharashtra",
      "District": "Latur",
      "City": "Udgir",
      "Population": 103550,
      "Area (in km^2)": 736,
      "Latitude": 18.39,
      "Longitude": 77.11
    },
    {
      "State": "Maharashtra",
      "District": "Osmanabad",
      "City": "Osmanabad",
      "Population": 111825,
      "Area (in km^2)": 1347,
      "Latitude": 18.19,
      "Longitude": 76.04
    },
    {
      "State": "Maharashtra",
      "District": "Solapur",
      "City": "Barshi",
      "Population": 118722,
      "Area (in km^2)": 1542,
      "Latitude": 18.23,
      "Longitude": 75.68
    },
    {
      "State": "Maharashtra",
      "District": "Solapur",
      "City": "Solapur",
      "Population": 951558,
      "Area (in km^2)": 180.67,
      "Latitude": 17.66,
      "Longitude": 75.91
    },
    {
      "State": "Maharashtra",
      "District": "Satara",
      "City": "Satara",
      "Population": 120195,
      "Area (in km^2)": 911,
      "Latitude": 17.69,
      "Longitude": 74
    },
    {
      "State": "Maharashtra",
      "District": "Kolhapur",
      "City": "Ichalkaranji",
      "Population": 287353,
      "Area (in km^2)": 49.84,
      "Latitude": 16.71,
      "Longitude": 74.46
    },
    {
      "State": "Maharashtra",
      "District": "Kolhapur",
      "City": "Kolhapur",
      "Population": 549236,
      "Area (in km^2)": 66.82,
      "Latitude": 16.69,
      "Longitude": 74.24
    },
    {
      "State": "Maharashtra",
      "District": "Sangli",
      "City": "Sangli Miraj Kupwad",
      "Population": 502793,
      "Area (in km^2)": 0,
      "Latitude": 16.86,
      "Longitude": 74.56
    },
    {
      "State": "Andhra Pradesh",
      "District": "Adilabad",
      "City": "Adilabad",
      "Population": 117167,
      "Area (in km^2)": 35.5,
      "Latitude": 19.67,
      "Longitude": 78.53
    },
    {
      "State": "Andhra Pradesh",
      "District": "Nizamabad",
      "City": "Nizamabad",
      "Population": 311152,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Karimnagar",
      "City": "Ramagundam",
      "Population": 237559,
      "Area (in km^2)": 93.87,
      "Latitude": 18.75,
      "Longitude": 79.47
    },
    {
      "State": "Andhra Pradesh",
      "District": "Karimnagar",
      "City": "Jagtial",
      "Population": 103930,
      "Area (in km^2)": 45,
      "Latitude": 18.8,
      "Longitude": 78.93
    },
    {
      "State": "Andhra Pradesh",
      "District": "Karimnagar",
      "City": "Karimnagar",
      "Population": 283657,
      "Area (in km^2)": 40.5,
      "Latitude": 18.43,
      "Longitude": 79.12
    },
    {
      "State": "Andhra Pradesh",
      "District": "Hyderabad",
      "City": "GHMC",
      "Population": 1730320,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Hyderabad",
      "City": "GHMC",
      "Population": 250932,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Hyderabad",
      "City": "GHMC",
      "Population": 135370,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Hyderabad",
      "City": "Secunderabad",
      "Population": 217910,
      "Area (in km^2)": 64.5,
      "Latitude": 17.45,
      "Longitude": 78.5
    },
    {
      "State": "Andhra Pradesh",
      "District": "Hyderabad",
      "City": "GHMC",
      "Population": 172542,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Hyderabad",
      "City": "GHMC",
      "Population": 341099,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Hyderabad",
      "City": "GHMC",
      "Population": 153558,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Hyderabad",
      "City": "GHMC",
      "Population": 108062,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Hyderabad",
      "City": "GHMC",
      "Population": 189378,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Hyderabad",
      "City": "GHMC",
      "Population": 271385,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Hyderabad",
      "City": "GHMC",
      "Population": 442229,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Hyderabad",
      "City": "GHMC",
      "Population": 213359,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Hyderabad",
      "City": "GHMC",
      "Population": 468158,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Hyderabad",
      "City": "GHMC",
      "Population": 330193,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Hyderabad",
      "City": "GHMC",
      "Population": 237594,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Hyderabad",
      "City": "GHMC",
      "Population": 345722,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Rangareddy",
      "City": "GHMC",
      "Population": 309320,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Rangareddy",
      "City": "GHMC",
      "Population": 567996,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Rangareddy",
      "City": "GHMC",
      "Population": 383654,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Rangareddy",
      "City": "GHMC",
      "Population": 413571,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Rangareddy",
      "City": "GHMC",
      "Population": 105987,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Rangareddy",
      "City": "GHMC",
      "Population": 384835,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Rangareddy",
      "City": "GHMC",
      "Population": 118577,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Rangareddy",
      "City": "GHMC",
      "Population": 369034,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Rangareddy",
      "City": "GHMC",
      "Population": 229823,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "Mahbubnagar",
      "City": "Mahbubnagar",
      "Population": 190400,
      "Area (in km^2)": 0,
      "Latitude": 16.75,
      "Longitude": 78
    },
    {
      "State": "Andhra Pradesh",
      "District": "Nalgonda",
      "City": "Suryapet",
      "Population": 106805,
      "Area (in km^2)": 35,
      "Latitude": 17.13,
      "Longitude": 79.62
    },
    {
      "State": "Andhra Pradesh",
      "District": "Nalgonda",
      "City": "Nalgonda",
      "Population": 154326,
      "Area (in km^2)": 105,
      "Latitude": 17.05,
      "Longitude": 79.27
    },
    {
      "State": "Andhra Pradesh",
      "District": "Nalgonda",
      "City": "Miryalaguda",
      "Population": 104918,
      "Area (in km^2)": 28.36,
      "Latitude": 16.87,
      "Longitude": 79.58
    },
    {
      "State": "Andhra Pradesh",
      "District": "Warangal",
      "City": "Warangal",
      "Population": 620116,
      "Area (in km^2)": 406.87,
      "Latitude": 18,
      "Longitude": 79.59
    },
    {
      "State": "Andhra Pradesh",
      "District": "Khammam",
      "City": "Khammam",
      "Population": 184210,
      "Area (in km^2)": 93.45,
      "Latitude": 17.25,
      "Longitude": 80.17
    },
    {
      "State": "Andhra Pradesh",
      "District": "Srikakulam",
      "City": "Srikakulam",
      "Population": 135367,
      "Area (in km^2)": 136,
      "Latitude": 18.3,
      "Longitude": 83.9
    },
    {
      "State": "Andhra Pradesh",
      "District": "Vizianagaram",
      "City": "Vizianagaram",
      "Population": 228720,
      "Area (in km^2)": 140,
      "Latitude": 18.11,
      "Longitude": 83.4
    },
    {
      "State": "Andhra Pradesh",
      "District": "Visakhapatnam",
      "City": "GVMC",
      "Population": 1730320,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Andhra Pradesh",
      "District": "East Godavari",
      "City": "Rajahmundry",
      "Population": 341831,
      "Area (in km^2)": 45,
      "Latitude": 17,
      "Longitude": 81.78
    },
    {
      "State": "Andhra Pradesh",
      "District": "East Godavari",
      "City": "Kakinada",
      "Population": 312538,
      "Area (in km^2)": 192.3,
      "Latitude": 16.99,
      "Longitude": 82.25
    },
    {
      "State": "Andhra Pradesh",
      "District": "West Godavari",
      "City": "Tadepalligudem",
      "Population": 104032,
      "Area (in km^2)": 217,
      "Latitude": 16.81,
      "Longitude": 81.53
    },
    {
      "State": "Andhra Pradesh",
      "District": "West Godavari",
      "City": "Eluru",
      "Population": 218020,
      "Area (in km^2)": 235,
      "Latitude": 16.7,
      "Longitude": 81.1
    },
    {
      "State": "Andhra Pradesh",
      "District": "West Godavari",
      "City": "Bhimavaram",
      "Population": 146961,
      "Area (in km^2)": 194,
      "Latitude": 16.54,
      "Longitude": 81.52
    },
    {
      "State": "Andhra Pradesh",
      "District": "Krishna",
      "City": "Vijayawada",
      "Population": 1021806,
      "Area (in km^2)": 61.88,
      "Latitude": 16.52,
      "Longitude": 80.63
    },
    {
      "State": "Andhra Pradesh",
      "District": "Krishna",
      "City": "Gudivada",
      "Population": 118167,
      "Area (in km^2)": 117,
      "Latitude": 16.44,
      "Longitude": 80.99
    },
    {
      "State": "Andhra Pradesh",
      "District": "Krishna",
      "City": "Machilipatnam",
      "Population": 169892,
      "Area (in km^2)": 405,
      "Latitude": 16.17,
      "Longitude": 81.13
    },
    {
      "State": "Andhra Pradesh",
      "District": "Guntur",
      "City": "Mangalagiri",
      "Population": 107197,
      "Area (in km^2)": 141,
      "Latitude": 16.43,
      "Longitude": 80.55
    },
    {
      "State": "Andhra Pradesh",
      "District": "Guntur",
      "City": "Narasaraopet",
      "Population": 117489,
      "Area (in km^2)": 236,
      "Latitude": 16.25,
      "Longitude": 80.07
    },
    {
      "State": "Andhra Pradesh",
      "District": "Guntur",
      "City": "Chilakaluripet",
      "Population": 101398,
      "Area (in km^2)": 15,
      "Latitude": 16.09,
      "Longitude": 80.17
    },
    {
      "State": "Andhra Pradesh",
      "District": "Guntur",
      "City": "Guntur",
      "Population": 670073,
      "Area (in km^2)": 193,
      "Latitude": 16.31,
      "Longitude": 80.44
    },
    {
      "State": "Andhra Pradesh",
      "District": "Guntur",
      "City": "Tenali",
      "Population": 164937,
      "Area (in km^2)": 114,
      "Latitude": 16.24,
      "Longitude": 80.65
    },
    {
      "State": "Andhra Pradesh",
      "District": "Prakasam",
      "City": "Ongole",
      "Population": 204746,
      "Area (in km^2)": 204,
      "Latitude": 15.51,
      "Longitude": 80.05
    },
    {
      "State": "Andhra Pradesh",
      "District": "Sri Potti Sriramulu Nellore",
      "City": "Nellore",
      "Population": 547621,
      "Area (in km^2)": 343,
      "Latitude": 14.44,
      "Longitude": 79.99
    },
    {
      "State": "Andhra Pradesh",
      "District": "Y.S.R.",
      "City": "Proddatur",
      "Population": 163970,
      "Area (in km^2)": 21.06,
      "Latitude": 14.75,
      "Longitude": 78.55
    },
    {
      "State": "Andhra Pradesh",
      "District": "Y.S.R.",
      "City": "Kadapa",
      "Population": 318916,
      "Area (in km^2)": 164.08,
      "Latitude": 14.48,
      "Longitude": 78.8
    },
    {
      "State": "Andhra Pradesh",
      "District": "Kurnool",
      "City": "Kurnool",
      "Population": 424920,
      "Area (in km^2)": 341,
      "Latitude": 15.83,
      "Longitude": 78.03
    },
    {
      "State": "Andhra Pradesh",
      "District": "Kurnool",
      "City": "Adoni",
      "Population": 184625,
      "Area (in km^2)": 544,
      "Latitude": 15.62,
      "Longitude": 77.27
    },
    {
      "State": "Andhra Pradesh",
      "District": "Kurnool",
      "City": "Nandyal",
      "Population": 211424,
      "Area (in km^2)": 222,
      "Latitude": 15.48,
      "Longitude": 78.48
    },
    {
      "State": "Andhra Pradesh",
      "District": "Anantapur",
      "City": "Guntakal",
      "Population": 126270,
      "Area (in km^2)": 402,
      "Latitude": 15.17,
      "Longitude": 77.37
    },
    {
      "State": "Andhra Pradesh",
      "District": "Anantapur",
      "City": "Tadpatri",
      "Population": 108171,
      "Area (in km^2)": 361,
      "Latitude": 14.92,
      "Longitude": 78.02
    },
    {
      "State": "Andhra Pradesh",
      "District": "Anantapur",
      "City": "Anantapur",
      "Population": 261004,
      "Area (in km^2)": 278,
      "Latitude": 14.69,
      "Longitude": 77.6
    },
    {
      "State": "Andhra Pradesh",
      "District": "Anantapur",
      "City": "Dharmavaram",
      "Population": 121874,
      "Area (in km^2)": 375,
      "Latitude": 14.41,
      "Longitude": 77.71
    },
    {
      "State": "Andhra Pradesh",
      "District": "Anantapur",
      "City": "Hindupur",
      "Population": 151677,
      "Area (in km^2)": 200,
      "Latitude": 13.82,
      "Longitude": 77.48
    },
    {
      "State": "Andhra Pradesh",
      "District": "Chittoor",
      "City": "Tirupati",
      "Population": 293421,
      "Area (in km^2)": 27.44,
      "Latitude": 13.63,
      "Longitude": 79.42
    },
    {
      "State": "Andhra Pradesh",
      "District": "Chittoor",
      "City": "Madanapalle",
      "Population": 180180,
      "Area (in km^2)": 347,
      "Latitude": 13.55,
      "Longitude": 78.5
    },
    {
      "State": "Andhra Pradesh",
      "District": "Chittoor",
      "City": "Chittoor",
      "Population": 160722,
      "Area (in km^2)": 177,
      "Latitude": 13.22,
      "Longitude": 79.1
    },
    {
      "State": "Karnataka",
      "District": "Belgaum",
      "City": "Belgaum",
      "Population": 490045,
      "Area (in km^2)": 1032,
      "Latitude": 15.85,
      "Longitude": 74.5
    },
    {
      "State": "Karnataka",
      "District": "Bagalkot",
      "City": "Bagalkot",
      "Population": 111933,
      "Area (in km^2)": 925,
      "Latitude": 16.17,
      "Longitude": 75.68
    },
    {
      "State": "Karnataka",
      "District": "Bijapur",
      "City": "Bijapur",
      "Population": 327427,
      "Area (in km^2)": 2648,
      "Latitude": 16.83,
      "Longitude": 75.73
    },
    {
      "State": "Karnataka",
      "District": "Bidar",
      "City": "Bidar",
      "Population": 216020,
      "Area (in km^2)": 908,
      "Latitude": 17.92,
      "Longitude": 77.52
    },
    {
      "State": "Karnataka",
      "District": "Raichur",
      "City": "Raichur",
      "Population": 234073,
      "Area (in km^2)": 1546,
      "Latitude": 16.2,
      "Longitude": 77.36
    },
    {
      "State": "Karnataka",
      "District": "Koppal",
      "City": "Gangawati",
      "Population": 114642,
      "Area (in km^2)": 1334,
      "Latitude": 15.43,
      "Longitude": 76.53
    },
    {
      "State": "Karnataka",
      "District": "Gadag",
      "City": "Gadag-Betigeri",
      "Population": 172612,
      "Area (in km^2)": 54.01,
      "Latitude": 15.42,
      "Longitude": 75.62
    },
    {
      "State": "Karnataka",
      "District": "Dharwad",
      "City": "Hubli-Dharwad",
      "Population": 943788,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Karnataka",
      "District": "Haveri",
      "City": "Ranibennur",
      "Population": 106406,
      "Area (in km^2)": 901,
      "Latitude": 14.62,
      "Longitude": 75.62
    },
    {
      "State": "Karnataka",
      "District": "Bellary",
      "City": "Hospet",
      "Population": 206167,
      "Area (in km^2)": 934,
      "Latitude": 15.27,
      "Longitude": 76.38
    },
    {
      "State": "Karnataka",
      "District": "Bellary",
      "City": "Bellary",
      "Population": 410445,
      "Area (in km^2)": 1689,
      "Latitude": 15.1,
      "Longitude": 76.92
    },
    {
      "State": "Karnataka",
      "District": "Chitradurga",
      "City": "Chitradurga",
      "Population": 145853,
      "Area (in km^2)": 1383,
      "Latitude": 14.23,
      "Longitude": 76.4
    },
    {
      "State": "Karnataka",
      "District": "Davanagere",
      "City": "Davanagere",
      "Population": 434971,
      "Area (in km^2)": 958,
      "Latitude": 14.46,
      "Longitude": 75.92
    },
    {
      "State": "Karnataka",
      "District": "Shimoga",
      "City": "Shimoga",
      "Population": 322650,
      "Area (in km^2)": 1114,
      "Latitude": 13.93,
      "Longitude": 75.57
    },
    {
      "State": "Karnataka",
      "District": "Shimoga",
      "City": "Bhadravati",
      "Population": 151102,
      "Area (in km^2)": 686,
      "Latitude": 13.84,
      "Longitude": 75.7
    },
    {
      "State": "Karnataka",
      "District": "Udupi",
      "City": "Udupi",
      "Population": 144960,
      "Area (in km^2)": 939,
      "Latitude": 13.34,
      "Longitude": 74.74
    },
    {
      "State": "Karnataka",
      "District": "Chikmagalur",
      "City": "Chikmagalur",
      "Population": 118401,
      "Area (in km^2)": 1592,
      "Latitude": 13.3,
      "Longitude": 75.73
    },
    {
      "State": "Karnataka",
      "District": "Tumkur",
      "City": "Tumkur",
      "Population": 302143,
      "Area (in km^2)": 1028,
      "Latitude": 13.33,
      "Longitude": 77.1
    },
    {
      "State": "Karnataka",
      "District": "Bangalore",
      "City": "BBMP",
      "Population": 8443675,
      "Area (in km^2)": 0,
      "Latitude": 0,
      "Longitude": 0
    },
    {
      "State": "Karnataka",
      "District": "Mandya",
      "City": "Mandya",
      "Population": 137358,
      "Area (in km^2)": 713,
      "Latitude": 12.52,
      "Longitude": 76.89
    },
    {
      "State": "Karnataka",
      "District": "Hassan",
      "City": "Hassan",
      "Population": 155006,
      "Area (in km^2)": 933,
      "Latitude": 13.01,
      "Longitude": 76.1
    },
    {
      "State": "Karnataka",
      "District": "Dakshina Kannada",
      "City": "Mangalore",
      "Population": 499487,
      "Area (in km^2)": 865,
      "Latitude": 12.8,
      "Longitude": 74.83
    },
    {
      "State": "Karnataka",
      "District": "Mysore",
      "City": "Mysore",
      "Population": 920550,
      "Area (in km^2)": 797,
      "Latitude": 12.3,
      "Longitude": 76.65
    },
    {
      "State": "Karnataka",
      "District": "Gulbarga",
      "City": "Gulbarga",
      "Population": 543147,
      "Area (in km^2)": 1741,
      "Latitude": 17.32,
      "Longitude": 76.82
    },
    {
      "State": "Karnataka",
      "District": "Kolar",
      "City": "Kolar",
      "Population": 138462,
      "Area (in km^2)": 792,
      "Latitude": 13.13,
      "Longitude": 78.13
    },
    {
      "State": "Karnataka",
      "District": "Kolar",
      "City": "Robertson Pet",
      "Population": 162230,
      "Area (in km^2)": 58.12,
      "Latitude": 12.95,
      "Longitude": 78.27
    },
    {
      "State": "Kerala",
      "District": "Kasaragod",
      "City": "Kanhangad",
      "Population": 125564,
      "Area (in km^2)": 140,
      "Latitude": 12.3,
      "Longitude": 75.08
    },
    {
      "State": "Kerala",
      "District": "Kozhikode",
      "City": "Kozhikode",
      "Population": 550440,
      "Area (in km^2)": 1032,
      "Latitude": 11.26,
      "Longitude": 75.78
    },
    {
      "State": "Kerala",
      "District": "Malappuram",
      "City": "Malappuram",
      "Population": 101386,
      "Area (in km^2)": 33.61,
      "Latitude": 11.07,
      "Longitude": 76.07
    },
    {
      "State": "Kerala",
      "District": "Palakkad",
      "City": "Palakkad",
      "Population": 130955,
      "Area (in km^2)": 713,
      "Latitude": 10.78,
      "Longitude": 76.65
    },
    {
      "State": "Kerala",
      "District": "Thrissur",
      "City": "Thrissur",
      "Population": 315957,
      "Area (in km^2)": 630,
      "Latitude": 10.53,
      "Longitude": 76.21
    },
    {
      "State": "Kerala",
      "District": "Ernakulam",
      "City": "Kochi",
      "Population": 601574,
      "Area (in km^2)": 129,
      "Latitude": 9.97,
      "Longitude": 76.28
    },
    {
      "State": "Kerala",
      "District": "Alappuzha",
      "City": "Alappuzha",
      "Population": 240991,
      "Area (in km^2)": 46.2,
      "Latitude": 9.5,
      "Longitude": 76.34
    },
    {
      "State": "Kerala",
      "District": "Kollam",
      "City": "Kollam",
      "Population": 350131,
      "Area (in km^2)": 380,
      "Latitude": 8.89,
      "Longitude": 76.61
    },
    {
      "State": "Kerala",
      "District": "Thiruvananthapuram",
      "City": "Thiruvananthapuram",
      "Population": 762535,
      "Area (in km^2)": 308,
      "Latitude": 8.52,
      "Longitude": 76.94
    },
    {
      "State": "Tamil Nadu",
      "District": "Thiruvallur",
      "City": "Avadi",
      "Population": 345996,
      "Area (in km^2)": 65,
      "Latitude": 13.12,
      "Longitude": 80.1
    },
    {
      "State": "Tamil Nadu",
      "District": "Thiruvallur",
      "City": "Ambattur",
      "Population": 466205,
      "Area (in km^2)": 180,
      "Latitude": 13.08,
      "Longitude": 80.15
    },
    {
      "State": "Tamil Nadu",
      "District": "Thiruvallur",
      "City": "Tiruvottiyur",
      "Population": 249446,
      "Area (in km^2)": 0,
      "Latitude": 13.17,
      "Longitude": 80.3
    },
    {
      "State": "Tamil Nadu",
      "District": "Thiruvallur",
      "City": "Madavaram",
      "Population": 119105,
      "Area (in km^2)": 0,
      "Latitude": 13.15,
      "Longitude": 80.23
    },
    {
      "State": "Tamil Nadu",
      "District": "Chennai",
      "City": "Chennai",
      "Population": 4646732,
      "Area (in km^2)": 426,
      "Latitude": 13.07,
      "Longitude": 80.24
    },
    {
      "State": "Tamil Nadu",
      "District": "Kancheepuram",
      "City": "Tambaram",
      "Population": 174787,
      "Area (in km^2)": 62,
      "Latitude": 12.93,
      "Longitude": 80.12
    },
    {
      "State": "Tamil Nadu",
      "District": "Kancheepuram",
      "City": "Alandur",
      "Population": 164430,
      "Area (in km^2)": 89,
      "Latitude": 13,
      "Longitude": 80.2
    },
    {
      "State": "Tamil Nadu",
      "District": "Kancheepuram",
      "City": "Pallavaram",
      "Population": 215417,
      "Area (in km^2)": 18,
      "Latitude": 12.98,
      "Longitude": 80.18
    },
    {
      "State": "Tamil Nadu",
      "District": "Kancheepuram",
      "City": "Kancheepuram",
      "Population": 164384,
      "Area (in km^2)": 636,
      "Latitude": 12.83,
      "Longitude": 79.7
    },
    {
      "State": "Tamil Nadu",
      "District": "Vellore",
      "City": "Vellore",
      "Population": 185803,
      "Area (in km^2)": 877,
      "Latitude": 12.93,
      "Longitude": 79.15
    },
    {
      "State": "Tamil Nadu",
      "District": "Vellore",
      "City": "Ambur",
      "Population": 114608,
      "Area (in km^2)": 558,
      "Latitude": 12.79,
      "Longitude": 78.72
    },
    {
      "State": "Tamil Nadu",
      "District": "Tiruvannamalai",
      "City": "Tiruvannamalai",
      "Population": 145278,
      "Area (in km^2)": 974,
      "Latitude": 12.23,
      "Longitude": 79.07
    },
    {
      "State": "Tamil Nadu",
      "District": "Salem",
      "City": "Salem",
      "Population": 829267,
      "Area (in km^2)": 539,
      "Latitude": 11.66,
      "Longitude": 78.15
    },
    {
      "State": "Tamil Nadu",
      "District": "Erode",
      "City": "Erode",
      "Population": 157101,
      "Area (in km^2)": 768,
      "Latitude": 11.34,
      "Longitude": 77.73
    },
    {
      "State": "Tamil Nadu",
      "District": "Dindigul",
      "City": "Dindigul",
      "Population": 207327,
      "Area (in km^2)": 1139,
      "Latitude": 10.37,
      "Longitude": 77.97
    },
    {
      "State": "Tamil Nadu",
      "District": "Tiruchirappalli",
      "City": "Tiruchirappalli",
      "Population": 847387,
      "Area (in km^2)": 71,
      "Latitude": 10.8,
      "Longitude": 78.68
    },
    {
      "State": "Tamil Nadu",
      "District": "Cuddalore",
      "City": "Cuddalore",
      "Population": 173636,
      "Area (in km^2)": 308,
      "Latitude": 11.74,
      "Longitude": 79.77
    },
    {
      "State": "Tamil Nadu",
      "District": "Cuddalore",
      "City": "Neyveli",
      "Population": 105731,
      "Area (in km^2)": 0,
      "Latitude": 11.53,
      "Longitude": 79.48
    },
    {
      "State": "Tamil Nadu",
      "District": "Nagapattinam ",
      "City": "Nagapattinam",
      "Population": 102905,
      "Area (in km^2)": 17.92,
      "Latitude": 10.77,
      "Longitude": 79.83
    },
    {
      "State": "Tamil Nadu",
      "District": "Thanjavur",
      "City": "Kumbakonam",
      "Population": 140156,
      "Area (in km^2)": 277,
      "Latitude": 10.96,
      "Longitude": 79.38
    },
    {
      "State": "Tamil Nadu",
      "District": "Thanjavur",
      "City": "Thanjavur",
      "Population": 222943,
      "Area (in km^2)": 616,
      "Latitude": 10.79,
      "Longitude": 79.14
    },
    {
      "State": "Tamil Nadu",
      "District": "Pudukkottai",
      "City": "Pudukkottai",
      "Population": 117630,
      "Area (in km^2)": 324,
      "Latitude": 10.38,
      "Longitude": 78.82
    },
    {
      "State": "Tamil Nadu",
      "District": "Sivaganga",
      "City": "Karaikkudi",
      "Population": 106714,
      "Area (in km^2)": 600,
      "Latitude": 10.07,
      "Longitude": 78.78
    },
    {
      "State": "Tamil Nadu",
      "District": "Madurai",
      "City": "Madurai",
      "Population": 1017865,
      "Area (in km^2)": 147.97,
      "Latitude": 9.94,
      "Longitude": 78.12
    },
    {
      "State": "Tamil Nadu",
      "District": "Virudhunagar",
      "City": "Rajapalayam",
      "Population": 130442,
      "Area (in km^2)": 466,
      "Latitude": 9.45,
      "Longitude": 77.55
    },
    {
      "State": "Tamil Nadu",
      "District": "Thoothukkudi",
      "City": "Thoothukkudi",
      "Population": 237830,
      "Area (in km^2)": 362,
      "Latitude": 8.82,
      "Longitude": 78.13
    },
    {
      "State": "Tamil Nadu",
      "District": "Tirunelveli",
      "City": "Tirunelveli",
      "Population": 473637,
      "Area (in km^2)": 569,
      "Latitude": 8.74,
      "Longitude": 77.69
    },
    {
      "State": "Tamil Nadu",
      "District": "Kanniyakumari",
      "City": "Nagercoil",
      "Population": 224849,
      "Area (in km^2)": 49.371,
      "Latitude": 8.17,
      "Longitude": 77.43
    },
    {
      "State": "Tamil Nadu",
      "District": "Krishnagiri",
      "City": "Hosur",
      "Population": 116821,
      "Area (in km^2)": 958,
      "Latitude": 12.74,
      "Longitude": 77.83
    },
    {
      "State": "Tamil Nadu",
      "District": "Coimbatore",
      "City": "Coimbatore",
      "Population": 1050721,
      "Area (in km^2)": 246.75,
      "Latitude": 11.02,
      "Longitude": 76.97
    },
    {
      "State": "Tamil Nadu",
      "District": "Coimbatore",
      "City": "Kurichi",
      "Population": 123667,
      "Area (in km^2)": 0,
      "Latitude": 10.97,
      "Longitude": 77.02
    },
    {
      "State": "Tamil Nadu",
      "District": "Tiruppur",
      "City": "Tiruppur",
      "Population": 444352,
      "Area (in km^2)": 372,
      "Latitude": 11.11,
      "Longitude": 77.35
    },
    {
      "State": "Puducherry",
      "District": "Puducherry",
      "City": "Puducherry",
      "Population": 244377,
      "Area (in km^2)": 483,
      "Latitude": 11.9,
      "Longitude": 79.8
    },
    {
      "State": "Puducherry",
      "District": "Puducherry",
      "City": "Ozhukarai",
      "Population": 300104,
      "Area (in km^2)": 0,
      "Latitude": 11.95,
      "Longitude": 79.77
    },
    {
      "State": "Andaman & Nicobar Islands",
      "District": "South Andaman",
      "City": "Port Blair",
      "Population": 108058,
      "Area (in km^2)": 548,
      "Latitude": 11.62,
      "Longitude": 92.73
    }
];
const failedEntry = [];
const fxn = async (req, res) => {
    console.log('Started the entries');
    
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      for (const item of location_dataset) {
        try {
          await locationDB.create([{ state: item.State, city: item.City, district: item.District }], { session });
          console.log('Item entered');
        } catch (err) {
          console.error('Failed to insert item:', item, err);
          failedEntry.push(item);
        }
      }
  
      await session.commitTransaction();
      console.log('Finished the job');
      res.status(200).send('All entries processed successfully');
    } catch (err) {
      console.error('Transaction failed:', err);
      await session.abortTransaction();
      res.status(500).send('Failed to process entries');
    } finally {
      session.endSession();
    }
  };
  
  app.use('/start', fxn);
console.log(location_dataset.length);
connectionProvider.devDBConnection(app,3100);