export interface Membre {
  id: number;
  pseudonyme: string;
  nom: string;
  prenom: string;
  preferences: string[];
  email: string;
  genre: string;
  dateNaissance: Date;
  photoProfil: string;
  presentation: string;
  status: string;
}

export const martin: Membre = {
  id: 1, // ID unique pour chaque utilisateur
  pseudonyme: 'Marty',
  nom: 'Dupont',
  prenom: 'Martin',
  preferences: ['Natation', 'Cyclisme', 'Course à pied'],
  email: 'martin.dupont@gmail.com',
  genre: 'Homme',
  dateNaissance: new Date('1990-05-15'), // Format AAAA-MM-JJ
  photoProfil: 'assets/Martin.png',
  presentation:
    "Passionné de sport et de l'esprit olympique, je suis toujours prêt à relever de nouveaux défis et à partager mes expériences avec la communauté.",
  status: 'confirmed',
};

export const friends: Membre[] = [
  {
    id: 2,
    pseudonyme: 'Rafa',
    nom: 'Nadal',
    prenom: 'Rafael',
    preferences: ['Tennis'],
    email: 'rafa.nadal@gmail.com',
    genre: 'Homme',
    dateNaissance: new Date('1986-06-03'), // Format AAAA-MM-JJ
    photoProfil: 'assets/Rafa.png',
    presentation:
      'Joueur de tennis professionnel, passionné par le sport et les compétitions.',
    status: 'confirmed',
  },
  {
  id: 3,
    pseudonyme: 'Elena',
    nom: 'Martinez',
    prenom: 'Elena',
    preferences: ['Gymnastique', 'Athlétisme'],
    email: 'elena.martinez@example.com',
    genre: 'Femme',
    dateNaissance: new Date('1992-08-12'), // Format AAAA-MM-JJ
    photoProfil: 'assets/Elena.png',
    presentation: "Amatrice de gymnastique et d'athlétisme, je suis passionnée par les Jeux Olympiques et j'adore partager cette passion avec les autres.",
    status: 'confirmed'
  }


];
