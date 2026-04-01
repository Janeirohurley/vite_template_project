# Changelog du Projet UMS

## v0.1.0 - 2025-12-13

Ce tag `v0.1.0` marque le premier instantané significatif du projet `ums`

Description de la version / du Tag v0.1.0

Ce tag v0.1.0 marque le premier instantané (snapshot) significatif du projet. Il représente la mise en place de l'architecture de base et l'implémentation partielle ou initiale des trois modules fonctionnels principaux : Authentification, Administration et Services Étudiants.

Fonctionnalités incluses :

1. Module d'Authentification (Auth)
Mise en place de la structure de base pour la gestion des sessions utilisateurs.
Implémentation des mécanismes de connexion (login) et d'inscription (signup) ainsi que les fonctionne de gestion des mot de passe comme le (reset password).
Gestion initiale des différents rôles (Admin, Étudiant, Doyen potentiel).
2. Module d'Administration et Gestion (Admin/Student management basics)
Gestion des utilisateurs : Interfaces (probablement statiques ou début de logique CRUD) pour lister et potentiellement gérer les comptes utilisateurs.
Gestion des programmes : Structure et interfaces initiales pour définir ou lister les programmes d'études.

Visualisation des logs : Mise en place d'une interface ou d'une structure initiale pour visualiser les journaux d'activité (logs) côté services étudiants.
3. Module Services Étudiants (Student-services)
Tableau de bord (Dashboard) : Une interface utilisateur pour les étudiants ou les services administratifs a été créée.
Note Importante : L'interface est actuellement statique, ce qui signifie que la mise en page et les éléments visuels sont en place, mais ils ne sont pas encore alimentés par des données dynamiques (depuis une base de données).
Gestion des inscriptions : Logique et interfaces fonctionnelles pour le processus d'inscription des étudiants.