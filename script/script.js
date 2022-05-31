// FONCTION CONSTRUCTEUR DU PROTOYPE
function ContactGeneral(famillyName, firstName, email, phoneNumber) {
  this.nom = famillyName;
  this.prenom = firstName;
  this.email = email;
  this.phoneNumber = phoneNumber;
}
function ContactPro(famillyName, firstName, email, phoneNumber, entreprise) {
  ContactGeneral.call(this, famillyName, firstName, email, phoneNumber);
  this.entreprise = entreprise;
  this.presentation = function () {
    return `Je suis ${this.nom} ${this.prenom}. Mon email est ${this.email} <br /> Et voici mon numéro: ${this.phoneNumber} <br /> entreprise: ${this.entreprise}`;
  };
}
function ContactPerso(famillyName, firstName, email, phoneNumber, exPerso) {
  ContactGeneral.call(this, famillyName, firstName, email, phoneNumber);
  this.exPerso = exPerso;
  this.presentation = function () {
    return `Je suis ${this.nom} ${this.prenom}. Mon email est ${this.email} <br /> Et voici mon numéro: ${this.phoneNumber} <br /> exPerso: ${this.exPerso}`;
  };
}

// SELECTEURS
let formData = document.querySelector(".form");
let listeContacts = document.querySelector(".listeContacts");
let deleteButton = document.querySelector(".deleteButton");
// DECLARATION DU TABLEAU
let tab1 = [];

// CHARGER LE LOCAL STORAGE A CHAQUE NOUVELLE PAGE
const elementsFromJSON = JSON.parse(localStorage.getItem("infosTab"));
if (localStorage.getItem("infosTab") != null) {
  tab1 = [];

  elementsFromJSON.forEach(function (element) {
    if (element.entreprise) {
      tab1.push(
        new ContactPro(
          element.nom,
          element.prenom,
          element.email,
          element.phoneNumber,
          element.entreprise
        )
      );
    } else {
      console.log(element.prenom, element.exPerso);
      tab1.push(
        new ContactPerso(
          element.nom,
          element.prenom,
          element.email,
          element.phoneNumber,
          element.exPerso
        )
      );
    }
  });
  showContact();
} else {
  tab1 = [];
}

// AFFICHER INPUT ENTREPRISE AVEC SELECT
let select = document.getElementById("selecteur");
select.addEventListener("change", function (e) {
  let input = document.getElementById("afficherPro");

  if (e.target.value == "pro") input.style.display = "inline-block";
  else input.style.display = "none";
});

// AFFICHER INPUT PERSO AVEC SELECT
select.addEventListener("change", function (e) {
  let input = document.getElementById("afficherPerso");

  if (e.target.value == "general") input.style.display = "inline-block";
  else input.style.display = "none";
});

// FONCTION FORMULAIRE + AFFICHER CONTACTS
formData.addEventListener("submit", function (ev) {
  ev.preventDefault(); //==> empeche la page de f5 quand tu appuie sur submit dans le form

  // Récupération des données du formulaires
  let data = new FormData(formData);
  let famillyName = data.get("name");
  let firstName = data.get("firstName");
  let email = data.get("email");
  let phoneNumber = data.get("phoneNumber");
  let exPerso = data.get("perso");
  let entreprise = data.get("entreprise");

  // Création de l'objet contact
  let informations = "";
  if (select.value == "general") {
    informations = new ContactPerso(
      famillyName,
      firstName,
      email,
      phoneNumber,
      exPerso
    );
  } else {
    informations = new ContactPro(
      famillyName,
      firstName,
      email,
      phoneNumber,
      entreprise
    );
  }

  // POUSSER LES INFORMATIONS DANS MON TABLEAU
  tab1.push(informations);

  // AFFICHER LA PUTAIN DE PHRASE
  showContact();

  console.table(tab1);

  // SAUVEGARDER DANS LE LOCAL STORAGE LE TABLEAU
  let myJSON = JSON.stringify(tab1);
  localStorage.setItem("infosTab", myJSON);

  //   RESET LE FORMULAIRE
  formData.reset();

  // AFFICHER LES OBJETS LITTERAUX AVEC F5
  // let paragraphe = document.createElement("p");
  // paragraphe.innerText = informations.presentation();
  // listeContacts.appendChild(paragraphe);

  //   CREATION BOUTTON SUPPR POUR ENLEVER UN CONTACT
  // let deleteButton = document.createElement("button");
  // deleteButton.innerText = "Supprimer";
  // listeContacts.appendChild(deleteButton);
});

function showContact() {
  console.log(tab1);
  // Création de la fonction show contact avec la méthode forEach
  // Création d'une variable content
  let content = "";
  tab1.forEach(function (element) {
    // Ajout à la variable content de mon élément
    content += `<p>${element.presentation()}<button class="deleteButton">Supprimer</button> </p> `;
  });

  listeContacts.innerHTML = content;

  let deleteButton = document.querySelectorAll(".deleteButton");
  // SUITE FOR EACH SUPPRESSION CONTACT
  deleteButton.forEach(function (button, indexSuppr) {
    button.addEventListener("click", function () {
      tab1.splice(indexSuppr, 1);
      localStorage.setItem("infosTab", JSON.stringify(tab1));
      showContact();
    });
  });
}
