import {getMongoIds} from "./migration.js";


console.log('starting migration.....')
setTimeout(() => {
    console.log('hello');
}, 3000);

await getMongoIds();
console.log('Server started successfully');
