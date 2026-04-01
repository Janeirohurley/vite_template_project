# Arborescence du Site Web (UMS-Web)

L'arborescence suivante représente la structure hiérarchique de l'application UMS-Web. Elle est organisée par rôles et par modules fonctionnels.

## Schéma Hiérarchique

```mermaid
graph TD
    Root((Accueil)) --> Auth[Authentification]
    Root --> Admin[Portail Administrateur]
    Root --> Dean[Portail Doyen]
    Root --> Director[Portail Directeur Académique]
    Root --> Finance[Portail Finance]
    Root --> StudentService[Portail Service Étudiant]
    Root --> Portals[Portails Externes]

    subgraph Authentification
        Auth --> Login[Connexion]
        Auth --> Register[Inscription]
        Auth --> Recovery[Récupération de mot de passe]
        Auth --> MFA[Double Authentification]
    end

    subgraph Portail Administrateur
        Admin --> DashboardA[Tableau de Bord]
        Admin --> Users[Gestion des Utilisateurs]
        Admin --> ProgramsA[Programmes Académiques]
        Admin --> SurveysA[Gestion des Sondages]
        Admin --> Infrastructure[Infrastructure & Géo]
        Admin --> Configs[Configuration Système]
    end

    subgraph Portail Doyen
        Dean --> DashboardD[Tableau de Bord]
        Dean --> StudentsD[Gestion des Étudiants]
        Dean --> TeachersD[Gestion des Enseignants]
        Dean --> Courses[Cours & Programmes]
        Dean --> Exams[Examens & Résultats]
    end

    subgraph Portail Finance
        Finance --> DashboardF[Tableau de Bord]
        Finance --> Payments[Gestion des Paiements]
        Finance --> Bank[Banques & Tarifications]
    end

    subgraph Portail Service Étudiant
        StudentService --> DashboardSS[Tableau de Bord]
        StudentService --> Enrollment[Inscriptions & Admissions]
        StudentService --> Activities[Activités & Clubs]
        StudentService --> Support[Bourses & Documents]
    end

    subgraph Portals[Portails & Autres]
        Portals --> StudentP[Portail Étudiant]
        Portals --> TeacherP[Portail Enseignant]
        Portals --> Timetable[Emploi du Temps]
        Portals --> PublicSurveys[Sondages Publics]
    end
```

## Description des Niveaux

*   **Niveau 0 (Racine) :** Page d'accueil et points d'entrée principaux.
*   **Niveau 1 (Sections Principales) :** Portails dédiés par rôle (Admin, Doyen, Finance, etc.) et Authentification.
*   **Niveau 2 (Pages Secondaires) :** Fonctionnalités spécifiques à chaque module (Tableaux de bord, listes, formulaires).
*   **Niveau 3 (Détails) :** Sous-sections comme la configuration détaillée ou les détails de paiement.
