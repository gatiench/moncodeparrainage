# MonCodeParrainage

Landing page statique de liens de parrainage financier. Le projet ne nécessite ni serveur applicatif, ni base de données, ni installation de dépendance.

## Pages publiées

- `/` : comparatif général.
- `/code-lucya-cnp/` : page dédiée au code Lucya CNP.
- `/code-parrainage-boursorama/` : page dédiée au lien de parrainage Boursorama.
- `/code-parrainage-fortuneo/` : page dédiée au code Fortuneo.
- `/a-propos/` : fonctionnement et transparence d'affiliation.
- `/mentions-legales/` : informations légales à compléter avant publication.
- `/contact/` : adresse de signalement et de contact.

## Mise à jour automatique

Le workflow GitHub Actions `.github/workflows/refresh-offer-dates.yml` s'exécute le premier jour de chaque mois. Il met à jour automatiquement le mois et l'année dans les titres SEO, les dates visibles, `offers.js` et `sitemap.xml`, puis publie un commit. Le site reste donc statique et indexable sans maintenance mensuelle manuelle.

Cette automatisation actualise les dates, mais ne peut pas inventer une nouvelle prime, un nouveau code ou une nouvelle condition. Les informations partenaires doivent être vérifiées avant d'ajouter ces valeurs dans `offers.js`.

## Maintenance des offres

Toutes les offres sont dans [`offers.js`](offers.js). Pour modifier le contenu :

1. Modifier le nom, la prime, les conditions ou la date dans l'objet concerné.
2. Renseigner `referralUrl` avec l'URL officielle vérifiée du partenaire.
3. Ajouter le montant numérique vérifié dans `bonusAmount` et son libellé dans `bonusLabel`.
4. Ajouter le code dans `code` s'il existe, sinon conserver `null`.
5. Passer `active` à `false` pour retirer temporairement une offre.
6. Mettre à jour la date `updatedAt`, puis republier le dossier.

Chaque offre possède également un `slug`, un `searchTitle`, une `searchDescription`, un `periodLabel` et une date `validThrough`. Ces champs servent à cibler des requêtes spécifiques comme `code Lucya CNP septembre 2026` sans dupliquer le HTML. La fiche directe est accessible avec `?offre=lucya`, `?offre=boursorama` ou `?offre=fortuneo`.

Quand `code` est renseigné, il devient l'élément visuel principal de la carte et le bouton `Copier le code` utilise le presse-papiers du navigateur. Quand `referralUrl` est renseignée, le bouton principal ouvre directement la page officielle du partenaire avec l'attribut d'affiliation `sponsored`. Le JSON-LD `Offer` n'est généré que si `referralUrl`, `bonusAmount` et `validThrough` sont tous renseignés.

Ne pas inventer de montant, de code ou de condition. Les conditions officielles du partenaire prévalent toujours.

## Déploiement

Le dossier peut être publié tel quel sur GitHub Pages, Vercel ou Cloudflare Pages. Aucun build command ni output directory n'est requis.

Le domaine configuré est `https://moncodeparrainage.fr/`. Vérifier également les mentions légales et les conditions d'affiliation avant publication.

## Mise en ligne recommandée

La solution la plus simple est GitHub Pages : créer un dépôt public, envoyer ces fichiers à la racine, puis activer `Settings > Pages > Deploy from a branch` sur `main` et le dossier `/root`. Vercel et Cloudflare Pages fonctionnent aussi avec le dossier racine, sans commande de build.

Après publication :

1. Acheter un nom de domaine court et descriptif si possible, plutôt que des backlinks payants de qualité inconnue.
2. Configurer le domaine personnalisé en HTTPS.
3. Remplacer le domaine d'exemple dans les balises canonical, Open Graph, `robots.txt` et `sitemap.xml`.
4. Déclarer le sitemap dans Google Search Console et demander l'indexation des pages réellement publiées.
5. Vérifier les liens de parrainage, le code copié et la destination partenaire sur mobile.

Un budget de 10 à 20 EUR est plus utile pour un domaine la première année que pour acheter des liens. Aucun achat ne garantit une position en tête de Google ; le référencement dépend de la qualité, de l'originalité et de la vérification régulière des offres.

Pour tester localement, servir le dossier en HTTP, par exemple avec l'extension Live Server de VS Code. L'ouverture directe du fichier HTML peut bloquer les modules JavaScript selon le navigateur.

## SEO et qualité

Le contenu important, les titres et la FAQ sont présents dans le HTML. Les données structurées `Offer` sont ajoutées uniquement lorsque l'offre possède une URL réelle. Les paramètres `?offre=lucya`, `?offre=boursorama` et `?offre=fortuneo` servent aux campagnes et à l'atterrissage ciblé ; ils ne remplacent pas de vraies pages éditoriales uniques si l'on veut positionner durablement chaque requête dans Google. Tester ensuite le HTML, le JSON-LD, les liens, l'accessibilité et les performances avec les outils de validation et Lighthouse.