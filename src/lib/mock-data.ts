import { Project } from "@/types/project";

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Impression 3D pour prototype robotique",
    shortDescription: "Financer les pièces nécessaires pour un prototype étudiant.",
    description:
      "Projet étudiant visant à construire un prototype robotique pour une démonstration académique. Le financement servira à acheter des pièces imprimées en 3D et du matériel de montage.",
    category: "Tech",
    ownerName: "Anaelle",
    targetAmount: 150,
    currentAmount: 65,
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200&auto=format&fit=crop",
    deadline: "2026-04-10",
    supportersCount: 12,
  },
  {
    id: "2",
    title: "Mini expo artistique étudiante",
    shortDescription: "Organiser une exposition pour des créateurs du campus.",
    description:
      "Une initiative pour mettre en avant les artistes étudiants à travers une petite exposition sur le campus avec impressions, affiches et installation.",
    category: "Art",
    ownerName: "Lina",
    targetAmount: 200,
    currentAmount: 120,
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop",
    deadline: "2026-04-18",
    supportersCount: 18,
  },
  {
    id: "3",
    title: "Collecte pour un hackathon solidaire",
    shortDescription: "Aider à financer les collations et le matériel.",
    description:
      "Un petit événement étudiant orienté entraide et innovation sociale. Les dons servent à financer les collations, impressions et petits besoins logistiques.",
    category: "Social",
    ownerName: "Yasmine",
    targetAmount: 300,
    currentAmount: 90,
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    deadline: "2026-04-25",
    supportersCount: 9,
  },
];