"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
// Initialize FirebaseApp with service-account.json
// SET GOOGLE_APPLICATION_CREDENTIALS=
// "C:\Users\K\Desktop\dough\dough-survey\service-account.json"
const app = (0, app_1.initializeApp)();
exports.default = app;
//# sourceMappingURL=login.js.map