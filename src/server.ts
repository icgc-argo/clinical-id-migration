import {beginMigration} from "./migration.js";
import express from 'express';
const app = express();

app.route('/migrate').get(beginMigration);
app.listen(process.env['PORT'], () => {
    console.log(`HTTP REST API SERVER available at http://localhost:${process.env['PORT']}`);
});

//await beginMigration();
console.log('Server started successfully');
