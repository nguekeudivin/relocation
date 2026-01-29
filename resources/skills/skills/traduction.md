## Traduction

Pour effectuer la traduction j'utilise cette approche. Un texte peut etre identifie par son ecrire normal ou par un code. Les 2 forces constituent 2 variantes differentes de la cle d'un meme texte. Donc pour le texte "Hello everyone". On a 2 cles possibles :

- "Hello Everyone"
- greeting
  Ensuite on cree des dictionnaires pour traduire ce texte dans l'importe quel langue.

en.json
{
"Hello Everyone" : "Hello Everyone",
"greeting" : "Hello Everyone",
}

fr.json
{
"Hello Everyone" : "Bonjour tout le monde",
"greeting" : "Bonjour tout le monde",
}

Cette approche permet d'avoir un systeme flexible. Ainsi on pourra avoir des cas ou on utilise litteralement le texte comme cle et dans un autre cas on utile une cle personnalise.
On peut se poser la question de savoir etant donne que les cles literales sont en anglais pourquoi cree encore un dictionneaire en.json. La raison derriere cela c'est juste pour prendre en compte les cles personnalise. Une fois ceci pris en compte pour garder la coherence avec les autres dictionnaires on utilise une fois un dictionnaire pour l'anglais quit a avoir des redondances.

Et la recommandation par default c'est de tout utilise les cles literales pour effectuer la traduction. C'est beaucoup plus simple, lisible et ca cree directement un fallback. Utiliser des cles personnalites que dans des cas specifics. Un example de cas specific sera par exemple quand on a un texte top long.

NB: Pour les termes qui comporte un seul mot. Dans la traduction ajouter creer deux versions: une qui commence le mot avec une miniscule. Une autre qui commence le mot avec une majuscule.
