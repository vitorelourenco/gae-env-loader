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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.loadSecrets = exports.accessSecretVersion = exports.listSecrets = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var secret_manager_1 = require("@google-cloud/secret-manager");
function listSecrets(request) {
    return __awaiter(this, void 0, void 0, function () {
        var secrets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, client.listSecrets(request)];
                case 1:
                    secrets = (_a.sent())[0];
                    return [2, secrets];
            }
        });
    });
}
exports.listSecrets = listSecrets;
function accessSecretVersion(name) {
    return __awaiter(this, void 0, void 0, function () {
        var version;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, client.accessSecretVersion({ name: name })];
                case 1:
                    version = (_a.sent())[0];
                    return [2, version];
            }
        });
    });
}
exports.accessSecretVersion = accessSecretVersion;
var client = new secret_manager_1.SecretManagerServiceClient();
function loadSecrets(prioritizeLocal) {
    var _a, _b, _c, _d, _e;
    if (prioritizeLocal === void 0) { prioritizeLocal = true; }
    return __awaiter(this, void 0, void 0, function () {
        var gcpProjectId, secrets, promises, _i, secrets_1, secret, key, versions, _f, versions_1, version, key, value, err_1;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    gcpProjectId = (function () {
                        if (!process.env.GOOGLE_CLOUD_PROJECT)
                            dotenv_1["default"].config();
                        return process.env.GOOGLE_CLOUD_PROJECT;
                    })();
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 4, , 5]);
                    return [4, listSecrets({ parent: "projects/" + gcpProjectId })];
                case 2:
                    secrets = _g.sent();
                    promises = [];
                    for (_i = 0, secrets_1 = secrets; _i < secrets_1.length; _i++) {
                        secret = secrets_1[_i];
                        if (!secret.name)
                            throw new Error("Expected value for secret: " + secret.name);
                        key = (_b = (_a = secret.name) === null || _a === void 0 ? void 0 : _a.split("/")) === null || _b === void 0 ? void 0 : _b[3];
                        if (!key)
                            throw new Error("Expected key for secret: " + secret);
                        if (prioritizeLocal && process.env[key])
                            continue;
                        promises.push(accessSecretVersion(secret.name + "/versions/latest"));
                    }
                    return [4, Promise.all(promises)];
                case 3:
                    versions = _g.sent();
                    for (_f = 0, versions_1 = versions; _f < versions_1.length; _f++) {
                        version = versions_1[_f];
                        key = (_d = (_c = version.name) === null || _c === void 0 ? void 0 : _c.split("/")) === null || _d === void 0 ? void 0 : _d[3];
                        if (!key)
                            throw new Error("Expected key for version: " + version);
                        if (!((_e = version === null || version === void 0 ? void 0 : version.payload) === null || _e === void 0 ? void 0 : _e.data))
                            throw new Error("Expected value for version: " + version.name);
                        value = version.payload.data.toString();
                        process.env[key] = value;
                    }
                    return [3, 5];
                case 4:
                    err_1 = _g.sent();
                    console.error(err_1);
                    return [3, 5];
                case 5: return [2];
            }
        });
    });
}
exports.loadSecrets = loadSecrets;
//# sourceMappingURL=index.js.map