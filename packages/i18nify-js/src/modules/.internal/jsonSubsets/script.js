"use strict";
// const fs = require('fs');
// const path = require('path');
// const currencyOriginalData = require('#/i18nify-data/currency/data.json');
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// const currencyGeoDataFilePath =
//   './src/modules/.internal/jsonSubsets/currency/currencyDataSubset.json';
// // currency module json subset generation
// const currencySubsetData = Object.entries(
//   currencyOriginalData.currency_information,
// ).reduce((acc, [key, value]) => {
//   acc[key] = {
//     name: value.name,
//     minor_unit: value.minor_unit,
//     symbol: value.symbol,
//   };
//   return acc;
// }, {});
// if (fs.existsSync(currencyGeoDataFilePath)) {
//   // If the file exists, delete it
//   fs.unlinkSync(currencyGeoDataFilePath);
// }
// const dirPath = path.dirname(currencyGeoDataFilePath);
// fs.mkdirSync(dirPath, { recursive: true });
// fs.writeFileSync(
//   currencyGeoDataFilePath,
//   JSON.stringify(currencySubsetData, null, 2),
//   'utf8',
// );
// console.log('Currency module json data subset created successfully.');
var fs = require("fs");
var path = require("path");
var data_json_1 = require("#/i18nify-data/currency/data.json");
console.log('🚀 ~ currencyOriginalData:', data_json_1.default);
var currencyGeoDataFilePath = './src/modules/.internal/jsonSubsets/currency/currencyDataSubset.json';
var currencySubsetData = Object.entries(data_json_1.default.currency_information).reduce(function (acc, _a) {
    var key = _a[0], value = _a[1];
    acc[key] = {
        name: value.name,
        minor_unit: value.minor_unit,
        symbol: value.symbol,
    };
    return acc;
}, {});
// Check if the file exists before trying to delete it, then use async functions to handle file operations
var createCurrencyGeoDataFile = function () { return __awaiter(void 0, void 0, void 0, function () {
    var dirPath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (fs.existsSync(currencyGeoDataFilePath)) {
                    // If the file exists, delete it
                    fs.unlinkSync(currencyGeoDataFilePath);
                }
                dirPath = path.dirname(currencyGeoDataFilePath);
                // Create directory recursively if it doesn't exist
                fs.mkdirSync(dirPath, { recursive: true });
                // Write the file asynchronously
                return [4 /*yield*/, fs.promises.writeFile(currencyGeoDataFilePath, JSON.stringify(currencySubsetData, null, 2), 'utf8')];
            case 1:
                // Write the file asynchronously
                _a.sent();
                console.log('Currency module json data subset created successfully.');
                return [2 /*return*/];
        }
    });
}); };
createCurrencyGeoDataFile();
