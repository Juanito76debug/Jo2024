import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bcrypt from 'bcrypt';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'; // Importation de cors
import nodemailer from 'nodemailer';

const app = express();
const server = createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'votre_email@gmail.com',
    pass: 'votre_mot_de_passe'
  }
});

app.use(cors()); // Utilisation du middleware cors
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bienvenue sur le serveur Node.js pour les Jeux Olympiques 2024!');
});

mongoose.connect('mongodb://localhost:27017/monAppJo2024', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Middleware pour hasher le mot de passe avant de sauvegarder l'utilisateur
userSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  }
  next();
});

const User = mongoose.model('User', userSchema);

// Route pour l'inscription
app.post('/api/auth/register', async (req, res) => {
  const { username, password, email } = req.body;

  // Vérifications simples
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
  }

  // Vérification des identifiants en dur
  if (username === 'Martin' && password === '123456') {
    // Envoyer un email de confirmation
    const mailOptions = {
      from: 'votre.email@gmail.com',
      to: email, // Utiliser l'email saisi par l'utilisateur
      subject: 'Confirmation d\'inscription',
      text: 'Votre inscription a été réussie !'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email', error });
      } else {
        console.log('Email envoyé: ' + info.response);
        return res.status(201).json({ message: 'Utilisateur créé avec succès', success: true });
      }
    });
  } else {
    return res.status(400).json({ message: 'Identifiants incorrects', success: false });
  }
});
// Route pour l'authentification
app.post('/api/auth/login', async (req, res) => {
  // Afficher en console les paramètres reçus
  console.log('Paramètres reçus:', req.body);

  // Vérifier le username/password en dur
  const { username, password } = req.body;
  if (username === 'Martin' && password === '1234') {
    // Si les identifiants sont corrects, renvoyer une réponse positive
    res.status(200).json({ message: 'Connexion réussie', success: true });
  } else {
    // Si les identifiants sont incorrects, renvoyer une réponse négative
    res.status(401).json({ message: 'Identifiants incorrects', success: false });
  }
});

io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté');

  socket.on('register', async (userData) => {
    try {
      const newUser = new User(userData);
      await newUser.save();
      socket.emit('registerResponse', { success: true });
    } catch (error) {
      socket.emit('registerResponse', { success: false, error });
    }
  });

  socket.on('login', async (credentials) => {
    try {
      const { username, password } = credentials;
      const user = await User.findOne({ username });
      if (user && await bcrypt.compare(password, user.password)) {
        socket.emit('loginResponse', { success: true });
      } else {
        socket.emit('loginResponse', { success: false });
      }
    } catch (error) {
      socket.emit('loginResponse', { success: false, error });
    }
  });

  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté');
  });

  // Ajoutez ici d'autres gestionnaires d'événements pour Socket.IO
});

// Assurez-vous que le chemin vers le fichier index.html est correct
const staticPath = path.join('C:/Users/jgimenez/OneDrive - cdc-habitat.fr/Documents/jo2024/monAppJo2024/src');
console.log('Static path:', staticPath); // Ajout d'un log pour vérifier le chemin
app.use(express.static(staticPath));

// Servir index.html uniquement pour les routes non-API
app.get('*', (req, res) => {
  const indexPath = path.join(staticPath, 'index.html');
  console.log('Serving index.html from:', indexPath); // Ajout d'un log pour vérifier le chemin
  res.sendFile(indexPath);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

open('http://localhost:3000');