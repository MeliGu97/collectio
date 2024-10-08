import express from "express";
import "dotenv/config";
import mongoose from "mongoose";

// #region importer les routes
import collectionRoute from './routes/collectionRoute.js';
import elementRoute from './routes/elementRoute.js';
import evenementRoute from './routes/evenementRoute.js';
import periodeRoute from './routes/periodeRoute.js';
import utilisateurRoute from './routes/utilisateurRoute.js';
import uneRoute from './routes/uneRoute.js';
import favorisRoute from './routes/favorisRoute.js';
import signalementRoute from './routes/signalementRoute.js';

import cors from "cors";
import fs from 'fs';
import https from 'https';

const app = express();

import ObjectId from 'mongodb';

// #region ---
var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));
// Middleware pour parser le JSON
//app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// #region ici les routes qu'on utilise !
app.use(collectionRoute, elementRoute, evenementRoute, periodeRoute, utilisateurRoute, uneRoute, favorisRoute, signalementRoute)


// Démarrage du serveur HTTPS
const PORT = process.env.PORT; 
const httpsOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Serveur démarré en mode HTTPS sur le port ${PORT}`);
});


const urlBDD = process.env.MONGODB_URL;
// Options de connexion 
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connexion à MongoDB
mongoose.connect(urlBDD, options)
  .then(() => {
    console.log('Connexion à la base de données MongoDB réussie');
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données MongoDB :', error);
  });
