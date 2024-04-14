const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const Collection = require('./Collection');
const Element = require('./Element');

const Evenement = require('./Evenement');
const Periode = require('./Periode');

const { ObjectId } = require('mongodb');

var corsOptions = {
  origin: "http://localhost:4200"
};
  
app.use(cors(corsOptions));
// Middleware pour parser le JSON
//app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// Démarrage du serveur HTTPS
const PORT = 443; // Port HTTPS par défaut
const httpsOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Serveur démarré en mode HTTPS sur le port ${PORT}`);
});


const urlBDD = 'mongodb://meli:admin@localhost:27017/collectio';

// Options de connexion (facultatif)
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connexion à MongoDB
mongoose.connect(urlBDD, options)
  .then(() => {
    console.log('Connexion à la base de données MongoDB réussie');
    
// -----------------------------------------
// -----------------------------------------
// Route pour tout récupérer  
// -----------------------------------------
// -----------------------------------------
app.get('/elements', async (req, res) => {
  try {
    //console.log("elementsssss");
    const elements = await Element.find();
    //console.log("elementsssss",elements);
    res.json(elements);
  } catch (error) {
    //console.log("erreur");
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------------
app.get('/collections', async (req, res) => {
  try {
    //console.log("collectionsssss");
    const collections = await Collection.find();
    //console.log("collectionsssss",collections);
    res.json(collections);
  } catch (error) {
    //console.log("erreur");
    res.status(500).json({ message: error.message });
  }
});


// -----------------------------------------
app.get('/evenements', async (req, res) => {
  try {
    const evenements = await Evenement.find();
    res.json(evenements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// -----------------------------------------
app.get('/periodes', async (req, res) => {
try {
  const periodes = await Periode.find();
  res.json(periodes);
} catch (error) {
  res.status(500).json({ message: error.message });
}
});


// -----------------------------------------
// Route pour récupérer 1 élément par son id
// -----------------------------------------
app.get('/elements/:id', async (req, res) => {
try {
  const objectId = req.params.id; // L'ID est déjà dans le format attendu
  const elementCible = await Element.findById(objectId);
  if (!elementCible) {
    return res.status(404).json({ message: 'Élément non trouvé' });
  }
  //console.log("elementCibleeeeeeee : ", elementCible)
  res.json(elementCible);
} catch (error) {
  res.status(500).json({ message: error.message });
}
});

// -----------------------------------------
app.get('/collections/:id', async (req, res) => {
try {
  const objectId = req.params.id; // L'ID est déjà dans le format attendu
  const collectionCible = await Collection.findById(objectId);
  if (!collectionCible) {
    return res.status(404).json({ message: 'Collection non trouvée' });
  }
  res.json(collectionCible);
} catch (error) {
  res.status(500).json({ message: error.message });
}
});

// -----------------------------------------
app.get('/evenements/:id', async (req, res) => {
try {
  const objectId = req.params.id; // L'ID est déjà dans le format attendu
  const evenementCible = await Evenement.findById(objectId);
  if (!evenementCible) {
    return res.status(404).json({ message: 'Evenement non trouvé' });
  }
  res.json(evenementCible);
} catch (error) {
  res.status(500).json({ message: error.message });
}
});

// ----------------------------------------
app.get('/periodes/:id', async (req, res) => {
try {
  const objectId = req.params.id; // L'ID est déjà dans le format attendu
  const periodeCible = await Periode.findById(objectId);
  if (!periodeCible) {
    return res.status(404).json({ message: 'Periode non trouvée' });
  }
  res.json(periodeCible);
} catch (error) {
  res.status(500).json({ message: error.message });
}
});




// -----------------------------------------
// -----------------------------------------
// Pour ajouter 
// -----------------------------------------
// -----------------------------------------
app.post('/elements', async (req, res) => {
//console.log(req)
try {
  //console.log('Requête POST reçue pour ajouter un élément', req.body);
  //console.log('Requête POST reçue pour ajouter un élément');
  const nouvelElement = new Element({
    label: req.body.label,
    description: req.body.description,
    collections: req.body.collections,
    imageUrl: req.body.imageUrl,
  });
    //console.log("nouvel element :",nouvelElement);
    const elementEnregistre = await nouvelElement.save();
    res.status(201).json(elementEnregistre);
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

// -----------------------------------------

app.post('/collections', async (req, res) => {
//console.log(req)
try {
  //console.log('Requête POST reçue pour ajouter une collection', req.body);
  //console.log('Requête POST reçue pour ajouter un élément');
  const nouvelCollection = new Collection({
    label: req.body.label,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
  });
    //console.log("nouvel collection :",nouvelCollection);
    const collectionEnregistre = await nouvelCollection.save();
    res.status(201).json(collectionEnregistre);
} catch (error) {
    res.status(500).json({ message: error.message });
}
});


// -----------------------------------------

app.post('/evenements', async (req, res) => {
try {
  const nouvelEvenement = new Evenement({
    label: req.body.label,
    date: req.body.date,
  });
    const evenementEnregistre = await nouvelEvenement.save();
    res.status(201).json(evenementEnregistre);
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

// -----------------------------------------

app.post('/periodes', async (req, res) => {
try {
  const nouvelPeriode = new Periode({
    label: req.body.label,
    dateEvents: req.body.dateEvent,
    collections: req.body.collections
  });
    const periodeEnregistre = await nouvelPeriode.save();
    res.status(201).json(periodeEnregistre);
} catch (error) {
    res.status(500).json({ message: error.message });
}
});


// -----------------------------------------
// Route pour supprimer un élément par son ID
// -----------------------------------------
app.delete('/elements/:id', async (req, res) => {
  try {
    const objectId = req.params.id;
    const elementASupprimer = await Element.findById(objectId);
    if (!elementASupprimer) {
      return res.status(404).json({ message: 'Élément non trouvé' });
    }

    // Supprimer l'élément des collections correspondantes
    await Collection.updateMany(
      { elements: objectId },
      { $pull: { elements: objectId } }
    );

    // Supprimer l'élément de la base de données
    await Element.deleteOne({ _id: objectId });
    
    res.json({ message: 'Élément supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/collections/:id', async (req, res) => {
  try {
    const objectId = req.params.id;
    const elementASupprimer = await Element.findById(objectId);
    if (!elementASupprimer) {
      return res.status(404).json({ message: 'Collection non trouvé' });
    }

    // Supprimer l'Collection des collections correspondantes
    await Collection.updateMany(
      { collections: objectId },
      { $pull: { collections: objectId } }
    );

    // Supprimer l'Collection de la base de données
    await Element.deleteOne({ _id: objectId });
    
    res.json({ message: 'Collection supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données MongoDB :', error);
  });
