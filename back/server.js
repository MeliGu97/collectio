const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const Utilisateur = require('./Utilisateur');
const Collection = require('./Collection');
const Element = require('./Element');
const Evenement = require('./Evenement');
const Periode = require('./Periode');
const Une = require('./Une');

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


// ------------------------- 
// #region COLLECTION 
// ------------------------- 

// Route pour tout récupérer  
app.get('/collections', async (req, res) => {
  try {
    //const collections = await Collection.find();
    //pour faire auto matcher les tables lors de la récupération des données
    //recupere un obj avec collection ET toutes les periodes associées
    const collections = await Collection.find().populate({
      path: 'periodesId',
      options: { sort: { dateDebut: 1 } } // Tri par dateDebut croissant
    });
    //console.log("collectionsssss",collections);
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour récupérer 1 collection par son id
app.get('/collections/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).populate({
      path: 'periodesId',
      options: { sort: { dateDebut: 1 } } // Tri par dateDebut croissant
    });
    if (!collection) {
      return res.status(404).json({ message: 'Collection non trouvée' });
    }
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour récupérer les collections d'un utilisateur par son id
app.get('/collections/user/:userId', async (req, res) => {
  try {
    const collections = await Collection.find({ userId: req.params.userId }).populate({
      path: 'periodesId',
      options: { sort: { dateDebut: 1 } } // Tri par dateDebut croissant
    });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pour ajouter 
app.post('/collections', async (req, res) => {
  console.log("req : ", req)
  try {
    const newCollection = new Collection({
      label: req.body.label,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      picto: req.body.picto,
      categorie: req.body.categorie,
      sousCategorie: req.body.sousCategorie,
      elementsId: req.body.elementsId,
      periodesId: req.body.periodesId,
      public: req.body.public,
      userId: req.body.userId,
    });
      const collectionEnregistre = await newCollection.save();
      res.status(201).json(collectionEnregistre);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
  });

// Pour modifier
app.put('/collections/:id', async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!collection) {
      return res.status(404).json({ message: 'Collection non trouvée' });
    }
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
  
// Route pour supprimer en cascade une collection 
app.delete('/collections/:id', async (req, res) => {
  try {
    const objectId = req.params.id;
    const collectionASupprimer = await Collection.findById(objectId);

    if (!collectionASupprimer) {
      return res.status(404).json({ message: 'Collection non trouvée' });
    }

    // Supprimer les éléments associés à la collection
    for (const elementId of collectionASupprimer.elementsId) {
      // Récupérer les événements associés à l'élément
      const evenementsAssocies = await Evenement.find({ elementId: elementId });

      // Supprimer les événements associés à l'élément un par un
      for (const evenement of evenementsAssocies) {
        await Evenement.deleteOne({ _id: evenement._id });
      }

      // Supprimer l'élément de la base de données
      await Element.deleteOne({ _id: elementId });
    }

    // Supprimer la collection de la base de données
    await Collection.deleteOne({ _id: objectId });

    res.json({ message: 'Collection et éléments associés supprimés avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la collection:', error);
    res.status(500).json({ message: error.message });
  }
});




// ------------------------- 
// #region ELEMENT
// ------------------------- 
// Route pour tout récupérer 
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

// Route pour récupérer 1 élément par son id
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


// Pour ajouter 
app.post('/elements', async (req, res) => {
  //console.log(req)
  try {
    const nouvelElement = new Element({
      label: req.body.label,
      description: req.body.description,
      collectionsId: req.body.collectionsId,
      imageUrl: req.body.imageUrl,
    });

      //console.log("nouvel element :",nouvelElement);
      const elementEnregistre = await nouvelElement.save();
      await Collection.updateMany(
        { _id: { $in: req.body.collectionsId } },
        { $push: { elementsId: elementEnregistre._id } }
      );
      res.status(201).json(elementEnregistre);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
  });

    // modifier 
    app.put('/elements/:id', async (req, res) => {
      try {
        const updatedElement = await Element.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedElement);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  

// Route pour supprimer un élément par son ID
app.delete('/elements/:id', async (req, res) => {
  try {
    const objectId = req.params.id;
    const elementASupprimer = await Element.findById(objectId);

    if (!elementASupprimer) {
      return res.status(404).json({ message: 'Élément non trouvé' });
    }

    // Récupérer les événements associés à l'élément
    const evenementsAssocies = await Evenement.find({ elementId: objectId });

    // Supprimer les événements associés à l'élément un par un
    for (const evenement of evenementsAssocies) {
      await Evenement.deleteOne({ _id: evenement._id });
    }

    // Supprimer l'ID de l'élément de la collection
    await Collection.updateMany(
      { elementsId: objectId },
      { $pull: { elementsId: objectId } }
    );

    // Supprimer l'élément de la base de données
    await Element.deleteOne({ _id: objectId });

    res.json({ message: 'Élément et événements associés supprimés avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'élément:', error);
    res.status(500).json({ message: error.message });
  }
});


// ------------------------- 
// #region EVENEMENT
// ------------------------- 
// Route pour tout récupérer  

// app.get('/evenements', async (req, res) => {
//   try {
//     const evenements = await Evenement.find();
//     res.json(evenements);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
app.get('/evenements', async (req, res) => {
  try {
    const elementId = req.query.elementId;
    if (!elementId) {
      return res.status(400).json({ message: 'elementId est requis' });
    }
    const evenements = await Evenement.find({ elementId });
    res.json(evenements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Route pour récupérer 1 événement par son id
app.get('/evenements/:id', async (req, res) => {
  try {
    const objectId = req.params.id;
    const evenementCible = await Evenement.findById(objectId);
    if (!evenementCible) {
      return res.status(404).json({ message: 'Evenement non trouvé' });
    }
    res.json(evenementCible);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pour ajouter 
app.post('/evenements', async (req, res) => {
  try {
    const nouvelEvenement = new Evenement({
      label: req.body.label,
      jour: req.body.jour,
      mois: req.body.mois,
      annee: req.body.annee,
      heure: req.body.heure,
      minute: req.body.minute,
      date: req.body.date,
      detail: req.body.detail,
      elementId: req.body.elementId,
    });
      const evenementEnregistre = await nouvelEvenement.save();
      res.status(201).json(evenementEnregistre);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
  });

  // Modidier un evenement 
app.put('/evenements/:id', async (req, res) => {
  try {
    const updatedEvenement = await Evenement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvenement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Route pour supprimer un événement par son ID
app.delete('/evenements/:id', async (req, res) => {
  try {
    const objectId = req.params.id;
    const result = await Evenement.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }

    res.json({ message: 'Événement supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    res.status(500).json({ message: error.message });
  }
});


// ------------------------- 
// #region PERIODE
// ------------------------- 

// Route pour tout récupérer  
app.get('/periodes', async (req, res) => {
try {
  const periodes = await Periode.find();
  res.json(periodes);
} catch (error) {
  res.status(500).json({ message: error.message });
}
});


// Route pour récupérer 1 élément par son id
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


// Pour ajouter 
app.post('/periodes', async (req, res) => {
try {
  const nouvelPeriode = new Periode({
    label: req.body.label,
    dateEvents: req.body.dateEvent,
    collectionsId: req.body.collectionsId,
  });
    const periodeEnregistre = await nouvelPeriode.save();
    res.status(201).json(periodeEnregistre);
} catch (error) {
    res.status(500).json({ message: error.message });
}
});


//  ------------------------------
//  #region UTILISATEUR
// ---------------------------------

// Route pour récupérer 1 utilisateur par son id
app.get('/utilisateurs/:id', async (req, res) => {
  try {
    const objectId = req.params.id; // L'ID est déjà dans le format attendu
    const utilisateurCible = await Utilisateur.findById(objectId);
    if (!utilisateurCible) {
      return res.status(404).json({ message: 'Élément non trouvé' });
    }
    //console.log("utilisateurCibleeeeeeee : ", utilisateurCible)
    res.json(utilisateurCible);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  });

app.post('/utilisateurs', async (req, res) => {
  try {
    const { prenom, nom, nomUtilisateur, motDePasse, role } = req.body;

    // On verifie que le nom d'utilisateur n'existe pas déjà 
    const existingUser = await Utilisateur.findOne({ nomUtilisateur });
    if (existingUser) {
      return res.status(400).json({ message: 'Ce nom de collectionneur existe déjà' });
    }

    // Hache le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    // Crée un utili
    const newUser = new Utilisateur({
      prenom,
      nom,
      nomUtilisateur,
      motDePasse: hashedPassword,
      role,
    });

    // Sauvegarde dans bdd
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créer avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création', error });
  }
});

app.post('/login', async (req, res) => {
  try {
      const { nomUtilisateur, motDePasse } = req.body;

      // Verifie si l'utilisateur existe
      const user = await Utilisateur.findOne({ nomUtilisateur });
      if (!user) {
          return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }

      // puis si le mdp est correcte
      const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
      if (!isPasswordValid) {
          return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }

      // si les deux sont bons alors ok sinon erreur
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la connexion', error });
  }
});



// ------------------------- 
// #region UNE
// ------------------------- 
// Route pour tout récupérer  
app.get('/unes', async (req, res) => {
  try {
    const unes = await Une.find().populate({
      path: 'collectionId',
      populate: {
        path: 'periodesId'
      }
    });
    res.json(unes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});




// Pour ajouter 
app.post('/unes', async (req, res) => {
  try {
    const nouvelUne = new Une({
      order: req.body.order,
      collectionId: req.body.collectionsId,
    });
      const uneEnregistre = await nouvelUne.save();
      res.status(201).json(uneEnregistre);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
  });
  



  // 
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données MongoDB :', error);
  });
