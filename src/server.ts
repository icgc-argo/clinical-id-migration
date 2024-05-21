import {beginMigration} from "./migration.mjs";
import express from 'express';
import {triggerDataCorrection} from "./data-correction.js";
const app = express();

app.route('/migrate').get(beginMigration);
app.route('/correct').get(triggerDataCorrection);
app.listen(process.env['PORT'], () => {
    console.log(`HTTP REST API SERVER available at http://localhost:${process.env['PORT']}`);
});

console.log('Server started successfully');
