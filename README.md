# korp! kassasüsteem

## Kirjeldus

Tegemist on kassasüsteemiga üliõpilaskoproratsioonidele. Kassa võimaldab lihtsalt ja kiirelt kasutajatel osta erinevaid tooteid erinevatel viisidel. Kuigi süsteem on algselt mõeldud korporatsioonidele ei tohiks olla ühtegi takistust, miks seda ei võiks ka mujal kasutada.

## Võimalused
Kassasüsteemil on kaks põhilist vaadet: **kassa** ning **admin**.

### Kassa
Kassa võimaldab teha järgmisi tegevusi:

* Vaadata kasutusjuhendit
* Valida kasutaja
* Lisada tehingule tooted
* Valida makseviis

Pärast makseviisi valikut läheb tehing kirja ning seda kuvatakse kassas **"Viimased tehingud"** tabelis.

### Admin
Admin võimaldab teha järgmisi tegevusi:

* Vaadata/muuta kasutajaid
* Vaadata tehinguid
* Vaadata/muuta makseviise
* Vaadata/muuta kasutaja staatuseid
* Vaadata/muuta toodete laoseisu
* Teha inventuuri

#### Inventuur
Inventuuri saab teha admin menüüpuntist ***Inventuur***

#### Mida inventuur tähendab?
Vajutades nuppu ***Inventuur*** tehakse järgmist:

* Leitakse kõik kasutajad kelle saldo ei ole 0
* Leitakse kõik tehingud
* Leitakse kõik tooted

Seejärel salvestatakse kõik see info inventuuri ning:

* Nullitakse kõikide kasutajate saldod
* Eemaldatakse kõik tehingud

Inventuuri infot saab igal ajal kuvada ***HTML'ina*** või alla laadida ***CSV'na***

## Kassa ülesseadmine
Kassa kasutamiseks on vajalik installeerida [Node.js](http://nodejs.org/) ja [MongoDB](http://www.mongodb.org/).
Kassa seadistus asub juurkaustas **config.json** failis.

### config.json lahtiseletatuna
**config.json** failis on järgmised konfiparameetrid:

```
{
  //Serveri konfiguratsioon
  "server": {
  	//Port millel veebiserverit jooksutatakse
    "port": 3000
  },
  //Andmebaasi konfiguratsioon
  "database": {
    "name": "posdb",
    "host": "localhost",
    "port": 27017,
    "username": "",
    "password": ""
  },
  //Admin liidese kasutaja info
  "admin": {
  	//Kui authenticate on true, siis küsitakse parooli
    "authenticate": true,
    "realm": "admin",
    "username": "admin",
    "password": ""
  },
  //Kassa kasutaja info
  "posuser": {
  	//Kui authenticate on false, siis parooli ei küsita
    "authenticate": false,
    "realm": "pos",
    "username": "posuser",
    "password": ""
  }
}
```
Kui **kassa** või **admin** kasutajal on **authenticate** parameetri väärtuseks **true**, siis küsitakse kasutaja käest parooli (Autentimine kasutab [HTTP Digest](http://en.wikipedia.org/wiki/Digest_access_authentication) autenti). Vaikimisi kassa kasutamisel parooli ei küsita, kuid admini käest küsitakse.

**NB!** Kui kassa on internetist ligipääsetav tuleks alati paroolid ära seadistada!

Kui seadistus on paigas, tuleb käivitamiseks jooksutada: `node app.js`. 

Veel parem oleks kasutada [node-supervisor](https://github.com/isaacs/node-supervisor) pluginat.


## Tehnoloogiad
Hetkel on antud projektis kasutusel järgmised tehnoloogiad.

### Backend
* Node.js <http://nodejs.org/>
* MongoDB <http://www.mongodb.org/>
* Express <http://expressjs.com/>
* Jade <http://jade-lang.com/>

### Frontend
* Bootstrap <http://twitter.github.io/bootstrap/>
* AngularJS <http://angularjs.org/>
* AngularUI Bootstrap <http://angular-ui.github.io/bootstrap/>
* Intro.js <http://usablica.github.io/intro.js/>
* Flat UI <http://designmodo.github.io/Flat-UI/>