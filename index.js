"use strict";
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
exports.deleteDB = exports.getDB = exports.setDB = exports.db = exports.allAsync = exports.runAsync = void 0;
var fs = require("fs");
var path = require("path");
var sqlite3 = require("sqlite3");
var util_1 = require("util");
var nodelog = require("@ajayos/nodelog");
var DB_FOLDER = 'DB';
var DB_FILE = 'ajayos.sql';
var DB_PATH = './' + DB_FOLDER + '/' + DB_FILE;
// Check if DB folder exists, create it if it does not
if (!fs.existsSync(path.join('./' + DB_FOLDER))) {
    fs.mkdirSync(path.join('./' + DB_FOLDER));
}
// Connect to the SQLite database
var db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, function (err) {
    if (err) {
        console.error(err.message);
    }
    else {
        // Set the password for the database
        db.run("PRAGMA key='eff7f92d38fafc792db6f88550399b56c521df95f841a265d93383d6b08395bc';", function (err) {
            if (err) {
                log(err.message, 'error');
            }
            else {
                log("Connected to the database.", 'info');
            }
        });
    }
});
exports.db = db;
// Promisify the db.run() and db.all() methods for easier use with async/await
var runAsync = (0, util_1.promisify)(db.run.bind(db));
exports.runAsync = runAsync;
var allAsync = (0, util_1.promisify)(db.all.bind(db));
exports.allAsync = allAsync;
// Create the 'setDB' function
var setDB = function (tableName, rowName, data) { return __awaiter(void 0, void 0, void 0, function () {
    var result, result_1, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                return [4 /*yield*/, allAsync("SELECT name FROM sqlite_master WHERE type='table' AND name='".concat(tableName, "';"))];
            case 1:
                result = _a.sent();
                if (!(result.length === 0)) return [3 /*break*/, 4];
                // Table does not exist, create it and insert the data
                return [4 /*yield*/, runAsync("CREATE TABLE ".concat(tableName, " (row_name TEXT PRIMARY KEY, data TEXT NOT NULL);"))];
            case 2:
                // Table does not exist, create it and insert the data
                _a.sent();
                return [4 /*yield*/, runAsync("INSERT INTO ".concat(tableName, " (row_name, data) VALUES (?, ?);"), [rowName, JSON.stringify(data)])];
            case 3:
                _a.sent();
                return [3 /*break*/, 9];
            case 4: return [4 /*yield*/, allAsync("SELECT row_name FROM ".concat(tableName, " WHERE row_name='").concat(rowName, "';"))];
            case 5:
                result_1 = _a.sent();
                if (!(result_1.length === 0)) return [3 /*break*/, 7];
                // Row does not exist, insert it
                return [4 /*yield*/, runAsync("INSERT INTO ".concat(tableName, " (row_name, data) VALUES (?, ?);"), [rowName, JSON.stringify(data)])];
            case 6:
                // Row does not exist, insert it
                _a.sent();
                return [3 /*break*/, 9];
            case 7: 
            // Row exists, update it
            return [4 /*yield*/, runAsync("INSERT OR REPLACE INTO ".concat(tableName, " (row_name, data) VALUES (?, ?);"), [rowName, JSON.stringify(data)])];
            case 8:
                // Row exists, update it
                _a.sent();
                _a.label = 9;
            case 9: return [2 /*return*/, true];
            case 10:
                err_1 = _a.sent();
                console.error(err_1.message);
                return [2 /*return*/, false];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.setDB = setDB;
// Create the 'getDB' function
var getDB = function (tableName, rowName) { return __awaiter(void 0, void 0, void 0, function () {
    var result, result_2, result_3, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                return [4 /*yield*/, allAsync("SELECT name FROM sqlite_master WHERE type='table' AND name='".concat(tableName, "';"))];
            case 1:
                result = _a.sent();
                if (!(result.length === 0)) return [3 /*break*/, 3];
                // Table does not exist, create it
                return [4 /*yield*/, runAsync("CREATE TABLE ".concat(tableName, " (row_name TEXT PRIMARY KEY, data TEXT NOT NULL);"))];
            case 2:
                // Table does not exist, create it
                _a.sent();
                return [2 /*return*/, undefined];
            case 3:
                if (!rowName) return [3 /*break*/, 5];
                return [4 /*yield*/, allAsync("SELECT data FROM ".concat(tableName, " WHERE row_name='").concat(rowName, "';"))];
            case 4:
                result_2 = _a.sent();
                if (result_2.length === 0) {
                    // Row does not exist, return undefined
                    return [2 /*return*/, undefined];
                }
                else {
                    // Row exists, return the data
                    return [2 /*return*/, JSON.parse(result_2[0].data)];
                }
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, allAsync("SELECT row_name, data FROM ".concat(tableName, ";"))];
            case 6:
                result_3 = _a.sent();
                return [2 /*return*/, result_3.map(function (row) {
                        return {
                            rowName: row.row_name,
                            data: JSON.parse(row.data)
                        };
                    })];
            case 7: return [3 /*break*/, 9];
            case 8:
                err_2 = _a.sent();
                console.error(err_2.message);
                return [2 /*return*/, undefined];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.getDB = getDB;
// Create the 'deleteDB' function
var deleteDB = function (tableName, rowName) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                if (!rowName) return [3 /*break*/, 5];
                return [4 /*yield*/, allAsync("SELECT row_name FROM ".concat(tableName, " WHERE row_name='").concat(rowName, "';"))];
            case 1:
                result = _a.sent();
                if (!(result.length === 0)) return [3 /*break*/, 2];
                // Row does not exist, return false
                return [2 /*return*/, false];
            case 2: 
            // Row exists, delete it
            return [4 /*yield*/, runAsync("DELETE FROM ".concat(tableName, " WHERE row_name='").concat(rowName, "';"))];
            case 3:
                // Row exists, delete it
                _a.sent();
                return [2 /*return*/, true];
            case 4: return [3 /*break*/, 7];
            case 5: 
            // Row name is not specified, delete the table
            return [4 /*yield*/, runAsync("DROP TABLE ".concat(tableName, ";"))];
            case 6:
                // Row name is not specified, delete the table
                _a.sent();
                return [2 /*return*/, true];
            case 7: return [3 /*break*/, 9];
            case 8:
                err_3 = _a.sent();
                console.error(err_3.message);
                return [2 /*return*/, false];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.deleteDB = deleteDB;
