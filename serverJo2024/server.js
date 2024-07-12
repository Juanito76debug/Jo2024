"use strict";

import express from "express";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import bcrypt from "bcrypt";
import open from "open";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import nodemailer from "nodemailer";
import crypto from "crypto"; // Pour générer de nouveaux identifiants
import utf8 from "utf8"; //

const app = express();
const server = createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const encodedString = utf8.encode("Votre chaîne ici");
console.log(encodedString);

console.log("Initialisation du serveur...");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "votre_email@gmail.com",
    pass: "votre_mot_de_passe",
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bienvenue sur le serveur Node.js pour les Jeux Olympiques 2024!");
});

// Définissez le chemin statique pour servir les fichiers de votre application Angular
const staticPath = path.join(__dirname, "../monAppJo2024/src");
console.log("Static path:", staticPath);
app.use(express.static(staticPath));

// Route pour servir index.html
app.get("*", (req, res) => {
  const indexPath = path.join(staticPath, "index.html");
  console.log("Serving index.html from:", indexPath);
  res.sendFile(indexPath);
});

mongoose
  .connect("mongodb://localhost:27017/monAppJo2024")
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => {
    console.error("Connexion à MongoDB échouée !", error);
    process.exit(1); // Arrête le serveur si la connexion échoue
  });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  }
  next();
});

const User = mongoose.model("User", userSchema);

app.post("/api/auth/register", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "Tous les champs sont obligatoires" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Le mot de passe doit contenir au moins 6 caractères" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Le nom d'utilisateur est déjà pris" });
    }

    const newUser = new User({ username, password, email });
    await newUser.save();

    const mailOptions = {
      from: "votre_email@gmail.com",
      to: email,
      subject: "Confirmation d'inscription",
      text: "Votre inscription a été réussie !",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Erreur lors de l'envoi de l'email", error });
      } else {
        console.log("Email envoyé: " + info.response);
        return res
          .status(201)
          .json({ message: "Utilisateur créé avec succès", success: true });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de l'inscription", error });
  }
});

app.post("/api/auth/login", async (req, res) => {
  console.log("Paramètres reçus:", req.body);

  const { username, password } = req.body;
  if (username === "Martin" && password === "1234") {
    res.status(200).json({ message: "Connexion réussie", success: true });
  } else {
    res
      .status(401)
      .json({ message: "Identifiants incorrects", success: false });
  }
});

// Route pour la récupération de mot de passe
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log("Email reçu pour réinitialisation:", email); // Log pour débogage

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Utilisateur non trouvé pour l'email:", email); // Log pour débogage
      return res.status(404).send("Utilisateur non trouvé");
    }

    // Générer de nouveaux identifiants
    const newPassword = crypto.randomBytes(8).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword; // Hacher le mot de passe avant de le sauvegarder
    await user.save();

    // Logique pour envoyer l'email de récupération
    const mailOptions = {
      from: "votre_email@gmail.com",
      to: email,
      subject: "Réinitialisation de mot de passe",
      text: `Vos nouveaux identifiants de connexion :\nEmail : ${email}\nMot de passe : ${newPassword}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Erreur lors de l'envoi de l'email:", error); // Log pour débogage
        return res.status(500).send("Erreur lors de l'envoi de l'email");
      }
      console.log("Email de récupération envoyé à:", email); // Log pour débogage
      res.status(200).send("Email de récupération envoyé");
    });
  } catch (error) {
    console.error("Erreur du serveur:", error); // Log pour débogage
    res.status(500).send("Erreur du serveur");
  }
});

app.post("/api/users/:id/friends", async (req, res) => {
  const userId = req.params.id;
  const friendId = req.body.friendId;
  try {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    if (!user || !friend) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    user.friends.push(friendId);
    await user.save();
    res.status(200).json({ message: "Ami ajouté avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'ami:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'ami", error });
  }
});

// Route pour obtenir le profil d'un utilisateur par ID
app.get("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'utilisateur avec ID ${userId}:`,
      error
    );
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération de l'utilisateur",
        error,
      });
  }
});

// Route pour obtenir tous les utilisateurs
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des utilisateurs",
        error,
      });
  }
});

// Route pour mettre à jour un utilisateur par ID
app.put("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de l'utilisateur avec ID ${userId}:`,
      error
    );
    res
      .status(500)
      .json({
        message: "Erreur lors de la mise à jour de l'utilisateur",
        error,
      });
  }
});

// Route pour mettre à jour un utilisateur par ID
app.put("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de l'utilisateur avec ID ${userId}:`,
      error
    );
    res
      .status(500)
      .json({
        message: "Erreur lors de la mise à jour de l'utilisateur",
        error,
      });
  }
});

// Route pour supprimer un utilisateur par ID
app.delete("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    await User.findByIdAndDelete(userId);
    console.log(`Utilisateur avec ID ${userId} supprimé.`);
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error(
      `Erreur lors de la suppression de l'utilisateur avec ID ${userId}:`,
      error
    );
    res
      .status(500)
      .json({
        message: "Erreur lors de la suppression de l'utilisateur",
        error,
      });
  }
});

// Route pour supprimer tous les utilisateurs
app.delete("/api/users", async (req, res) => {
  try {
    await User.deleteMany({});
    console.log("Tous les utilisateurs ont été supprimés.");
    res
      .status(200)
      .json({ message: "Tous les utilisateurs ont été supprimés avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression des utilisateurs:", error);
    res
      .status(500)
      .json({
        message: "Erreur lors de la suppression des utilisateurs",
        error,
      });
  }
});

// Route pour supprimer un ami d'un utilisateur par ID
app.delete("/api/users/:id/friends/:friendId", async (req, res) => {
  const userId = req.params.id;
  const friendId = req.params.friendId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    await user.save();
    res.status(200).json({ message: "Ami supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'ami:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'ami", error });
  }
});

// Route pour obtenir la liste des amis d'un utilisateur par ID
app.get("/api/users/:id/friends", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).populate("friends");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Erreur lors de la récupération des amis:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des amis", error });
  }
});

io.on("connection", (socket) => {
  console.log("Un utilisateur est connecté");

  socket.on("register", async (userData) => {
    try {
      const newUser = new User(userData);
      await newUser.save();
      socket.emit("registerResponse", { success: true });
    } catch (error) {
      socket.emit("registerResponse", { success: false, error });
    }
  });

  socket.on("login", async (credentials) => {
    try {
      const { username, password } = credentials;
      const user = await User.findOne({ username });
      if (user && (await bcrypt.compare(password, user.password))) {
        socket.emit("loginResponse", { success: true });
      } else {
        socket.emit("loginResponse", { success: false });
      }
    } catch (error) {
      socket.emit("loginResponse", { success: false, error });
    }
  });

  socket.on("deleteUser", async (userId) => {
    try {
      await User.findByIdAndDelete(userId);
      socket.emit("userDeleted", { success: true });
    } catch (error) {
      socket.emit("error", { success: false, message: error.message });
    }
  });

  socket.on("deleteAllUsers", async () => {
    try {
      await User.deleteMany({});
      socket.emit("allUsersDeleted", { success: true });
    } catch (error) {
      socket.emit("error", { success: false, message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

open("http://localhost:3000");
