export interface Membre {
  pseudonyme: string;
  nom: string;
  prenom: string;
  preferences: string[];
  email: string;
  genre: string;
  dateNaissance: Date;
  photoProfil: string;
  presentation: string;
}

export const martin: Membre = {
  pseudonyme: 'Marty',
  nom: 'Dupont',
  prenom: 'Martin',
  preferences: ['Natation', 'Cyclisme', 'Course à pied'],
  email: 'martin.dupont@example.com',
  genre: 'Homme',
  dateNaissance: new Date('1990-05-15'), // Format AAAA-MM-JJ
  photoProfil: 'assets/Martin.png',
  presentation:
    "Passionné de sport et de l'esprit olympique, je suis toujours prêt à relever de nouveaux défis et à partager mes expériences avec la communauté.",
};
