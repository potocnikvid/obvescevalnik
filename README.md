|                             |                                                         |
| :-------------------------- | :------------------------------------------------------ |
| **Naziv projekta**          | Občinski obveščevalnik |
| **Člani projektne skupine** | Matic Conradi, Vid Potočnik, Miha Godec, Lucijan Semprimožnik, Luka Kolar |
| **Kraj in datum**           | Ljubljana, 30.3.2022                                   |


* :yellow_square: - [Predlog projekta](docs/predlog-projekta),
* :orange_square: - [Zajem zahtev](docs/zajem-zahtev),
* :green_square: - [Načrt rešitve](docs/nacrt) in
* :blue_square: - [Implementacija](src).

# Zagon

Stran je v produkciji na voljo na [tej povezavi](https://obvescevalnik-service-q5mxa7qd6q-uc.a.run.app). Prvo nalaganje spletne strani na javni povezavi zna trajati več deset sekund, saj mora ob predhodni neaktivnosti Google Cloud Run izvesti mrzli zagon ("cold start"). Informacije o lokalnem zagonu se nahajajo v [mapi /src](src). Podatki o testiranju se nahajajo v [mapi /test](test).

# Uporabniški podatki

### Uporabnik:

e-pošta: `johndoe@email.com`

geslo: `password`

### Administrator:

e-pošta: `admin@obvescevalnik.si`

geslo: `password`
