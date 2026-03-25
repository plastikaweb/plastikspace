**ECO STORE**

Document de Requisits de Producte

_Plataforma E-commerce Multi-tenant per a Cooperatives_

| Versió            | 1.7 — Març 2026                                                |
| :---------------- | :------------------------------------------------------------- |
| **Estat**         | En Desenvolupament Actiu                                       |
| **Projecte**      | Eco Store — Botiga Online per a Cooperatives Ecològiques       |
| **Primer tenant** | Associació El Llevat · https://el-llevat.9botiga.top/          |
| **Repositori**    | https://github.com/plastikaweb/plastikspace                    |
| **Backend**       | PocketBase (Multi-tenant, auto-allotjat, SQLite)               |
| **Frontend**      | Angular 21 · Angular Material 3 · Tailwind CSS · ngx-translate |
| **Propietari**    | Product Owner / Tech Lead                                      |

| ⚠ Abast d'aquest document _Aquest PRD cobreix únicament la botiga pública i l'àrea de soci (Eco Store). La gestió interna de la cooperativa (Tenant Admin i Superadmin) es documenta en un document separat: eco-admin PRD._ |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

# **1\. Resum Executiu**

Eco Store és l'aplicació web orientada al consumidor d'una plataforma SaaS multi-tenant dissenyada per a cooperatives ecològiques i d'economia social. Cada cooperativa (tenant) opera la seva pròpia botiga amb marca pròpia, impulsada per un backend compartit, que permet als socis navegar per productes, gestionar cistella i comandes, i interactuar amb la cooperativa, tot dins d'una experiència accessible i multilingüe.

El primer tenant en producció és l'Associació El Llevat. La plataforma compleix els requisits d'accessibilitat WCAG 2.1 AA i suporta inicialment el català i el castellà. El backend és PocketBase (Go, auto-allotjat), amb SQLite integrat i subscripcions en temps real.

# **2\. Objectius i Mètriques d'Èxit**

## **2.1 Objectius de Negoci**

- Permetre a les cooperatives vendre en línia sense comissions per transacció ni dependència de marketplaces.

- Reduir la càrrega administrativa dels gestors mitjançant un panell d'autogestió (eco-admin).

- Generar confiança a través de la transparència: origen, productor, tags eco i informació real d'estoc.

- Suportar el model de cicle de comanda cooperatiu i, opcionalment, botigues obertes 24/7.

- Atraure nous socis a través d'una experiència digital moderna i accessible.

## **2.2 Mètriques d'Èxit (KPIs)**

| Mètrica                          | Objectiu                               |
| :------------------------------- | :------------------------------------- |
| Taxa de completat de comanda     | \> 70% de les cistelles iniciades      |
| Retenció de socis actius         | \> 80% fan ≥ 1 comanda per cicle       |
| Accessibilitat WCAG 2.1 AA       | Zero violacions crítiques en auditoria |
| LCP mòbil 4G (llistat productes) | \< 2,5 s                               |
| Suport relacionat amb usabilitat | \< 5% del volum de comandes            |

# **3\. Actors i Rols**

A la botiga pública tots els usuaris veuen la mateixa experiència. Les capacitats per rol s'activen únicament un cop autenticats. Els rols Tenant Admin i Superadmin corresponen al projecte eco-admin (fora d'abast d'aquest document).

| Actor             | Auth | Descripció                                                                     | Permisos principals                                                                                  |
| :---------------- | :--- | :----------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| Visitant / Anònim | No   | Usuari no registrat: futur soci, visitant ocasional o soci inactiu.            | Navegar catàleg · Afegir al cistell · Formulari de contacte · Pàgines legals · Consent cookies       |
| Soci (Client)     | Sí   | Membre registrat. Rol intern: PARTNER (habitual), TENANT_ADMIN o GLOBAL_ADMIN. | Checkout complet · Historial de comandes · Wishlist · Perfil i adreces · Valoracions · Notificacions |

# **4\. Requisits Funcionals**

Prioritat MoSCoW: **MUST** (imprescindible) · **SHOULD** (alt valor) · **COULD** (desitjable). **Estat:** Fet (verd) · En curs (blau) · Pendent (groc) · Diferit (gris).

## **4.1 Pàgina d'Inici (INI)**

_Pàgina de benvinguda de la botiga (ruta /). Primera experiència del visitant i principal eina de conversió cap al catàleg i l'alta de socis. El contingut és personalitzable per tenant a través de camps de configuració._

| ID         | Descripció                                                                                                                                                                                                                                                                                                                                                                                                | Prior.     | Estat   |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------ |
| **INI-01** | Secció Hero. Mostra una imatge de fons personalitzada (heroImageCustom, prioritat) o un preset predefinit (heroImagePreset: valors com "hort", "cistella", "mercat") que garanteix bon aspecte sense fotos pròpies. Inclou títol (heroTitle), subtítol (heroSubtitle) i un CTA primari per accedir a la botiga. La imatge s'ha de servir en format WebP/AVIF per optimitzar el LCP.                       | **MUST**   | Pendent |
| **INI-02** | CTA d'alta de soci. Botó o banner secundari ben visible per als visitants no registrats per iniciar el procés d'alta ("Fes-te soci" / "Uneix-te"). Redirigeix a PRV-06 (sol·licitud d'adhesió) o a PRV-05b (registre si ja s'és preautoritzat). Ocult per a socis autenticats.                                                                                                                            | **MUST**   | Pendent |
| **INI-03** | Secció "Com funciona". Secció gràfica amb passos que explica el procés de la cooperativa. Si el tenant no configura passos manuals (howItWorksSteps buit), el frontend els genera automàticament llegint el logisticsConfig del tenant: dies d'obertura/tancament de comandes, disponibilitat de recollida i condicions de lliurament a domicili.                                                         | **MUST**   | Pendent |
| **INI-04** | Aparador de productes destacats. Mostra entre 4 i 8 productes en un carrusel o graella reduïda. Dos modes: (a) manual — productes marcats isFeatured \= true; (b) dinàmic — consulta els productes amb millor rating o més venuts del tenant. Configurable per tenant.                                                                                                                                    | **SHOULD** | Pendent |
| **INI-05** | Navegació per categories principals. Mostra les categories actives del tenant (aquelles amb almenys 1 producte en estoc) com a targetes visuals amb icona i color de categoria. Clic navega al llistat filtrat per aquella categoria. Limitat a les 6–8 categories amb més productes si n'hi ha moltes. Generació automàtica i dinàmica — sense camp manual showOnHome per reduir fricció de manteniment. | **MUST**   | Pendent |
| **INI-06** | Secció "Qui som" / "El nostre impacte". Text enriquit (aboutUsText) amb la filosofia de la cooperativa, productors locals i dades de confiança (nombre de socis, anys al barri, etc.). Editable pel tenant des d'eco-admin.                                                                                                                                                                               | **SHOULD** | Pendent |
| **INI-07** | Prova social (Social Proof). Secció de testimonis o ressenyes destacades de socis de la cooperativa per generar confiança. Pot mostrar valoracions recents de VAL-02 o testimonis configurats manualment.                                                                                                                                                                                                 | **COULD**  | Pendent |
| **INI-08** | Pre-footer de conversió. Banner just abans del peu de pàgina amb un últim CTA: registre per a visitants anònims o contacte per a interessats. Contingut configurable per tenant.                                                                                                                                                                                                                          | **SHOULD** | Pendent |
| **INI-09** | Animacions de scroll reveal. Les seccions de la pàgina apareixen suaument a mesura que l'usuari fa scroll (IntersectionObserver \+ classes Tailwind de transició). No ha d'afectar el LCP ni el CLS.                                                                                                                                                                                                      | **COULD**  | Pendent |

| Requisits PocketBase — nous camps necessaris (INI) \*Col·lecció tenants: afegir heroTitle (String, i18n JSON), heroSubtitle (String, i18n JSON), heroImagePreset (String, valors: hort | cistella | mercat | default), heroImageCustom (File/Imatge, opcional — prioritat sobre preset), aboutUsText (String, HTML ric, i18n JSON), howItWorksSteps (JSON opcional — si buit, el frontend el genera des de logisticsConfig). Col·lecció products: afegir isFeatured (Boolean, default false) — permet marcar productes per a l'aparador de la Home.\* |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## **4.2 Catàleg i Botiga (BOT)**

| ID          | Descripció                                                                                                                                                                                                                                                                                                                                      | Prior.     | Estat   |
| :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------ |
| **BOT-01**  | Llistat paginat de productes. El visitant pot navegar per tots els productes disponibles en format de targetes amb imatge, nom, preu i estat d'estoc. Inclou paginació amb selector d'elements per pàgina i controls de navegació.                                                                                                              | **MUST**   | Fet     |
| **BOT-02a** | Filtratge per categories. El visitant pot filtrar el llistat per categoria de producte. Les categories s'agrupen per category_group (ex. "Rebost i Cuina", "Frescos i Nevera"). Les categories amb 0 productes en estoc no es mostren.                                                                                                          | **MUST**   | Fet     |
| **BOT-02b** | Cerca textual. El visitant pot filtrar els productes per nom mitjançant un camp de cerca.                                                                                                                                                                                                                                                       | **MUST**   | Pendent |
| **BOT-02c** | Filtratge per tags. El visitant pot filtrar per tags dinàmics (eco, oferta, novetat…) assignats als productes.                                                                                                                                                                                                                                  | **MUST**   | Pendent |
| **BOT-02d** | Ordenació del llistat. El visitant pot ordenar els productes per data, valoració o preu (ascendent / descendent) via un dropdown de selecció.                                                                                                                                                                                                   | **MUST**   | Fet     |
| **BOT-03**  | Pàgina de detall de producte. Mostra: galeria d'imatges amb thumbnails, nom, categoria, tags com a pills (ECO, NOVETAT, OFERTA), preu amb IVA, badge de tipus d'unitat (PREU PER UNITAT / PESA Xg / OCUPA Xl), origen, productor (amb link), badge de disponibilitat (ex. "Disponible — Entrega 24/48h"), descripció i breadcrumb de navegació. | **MUST**   | Fet     |
| **BOT-04**  | Botó dinàmic d'afegir al cistell. El botó "Afegir" es transforma en el selector de quantitat \[− N \+\] en fer el primer tap. Actualitza el cistell en temps real (amb debounce). Quan la quantitat arriba a 0 reverteix al botó inicial. Visible tant al llistat com al detall.                                                                | **MUST**   | Fet     |
| **BOT-05**  | Cistell per a visitants anònims. El cistell s'emmagatzema al localStorage. En fer login, es fusiona automàticament amb el cistell del compte si n'hi havia un de previ.                                                                                                                                                                         | **MUST**   | Fet     |
| **BOT-06a** | Checkout pas 1 — cistella. Vista de revisió d'articles amb selector de quantitat, preu per unitat, IVA, total per article i botó d'eliminació. Articles agrupats per categoria. Resum lateral amb subtotal, IVA i total.                                                                                                                        | **MUST**   | Fet     |
| **BOT-06b** | Checkout pas 2 — lliurament. El soci selecciona el mètode (Recollida a la botiga — GRATIS · Enviament a domicili — GRATIS des de llindar configurable), el punt de recollida entre els tenant_addresses actius, i la franja horària disponible.                                                                                                 | **MUST**   | Fet     |
| **BOT-06c** | Checkout pas 3 — confirmació. Resum complet de productes, resum de lliurament, camp de notes opcionals (màx. 200 caràcters), banner informatiu sobre pagament al lliurament per productes de pes variable. CTA "Confirmar Comanda".                                                                                                             | **MUST**   | Fet     |
| **BOT-07**  | Wishlist. El soci autenticat pot afegir i eliminar productes a la llista de desitjos via la icona de cor. Requereix autenticació; la icona és visible però inactiva per a visitants anònims.                                                                                                                                                    | **SHOULD** | En curs |
| **BOT-08**  | Estoc i disponibilitat. Badge "Disponible — Entrega 24/48h" (o equivalent configurable) a la pàgina de detall. Productes sense estoc apareixen amb overlay grisat i CTA "Avisa'm".                                                                                                                                                              | **MUST**   | En curs |
| **BOT-09**  | Informació del cicle de comanda. Mostra estat del cicle (obert/tancat), compte enrere de tancament i data aproximada de lliurament. Si el tenant té closed \= true, mostra banner persistent (descartable) amb closedReason configurat. Per a tenants en mode 24/7, el component no es mostra tret que la botiga estigui tancada manualment.    | **MUST**   | Fet     |
| **BOT-10**  | Productes relacionats. A la pàgina de detall es mostra una secció "També et podria agradar" amb productes de la mateixa categoria, en scroll horitzontal.                                                                                                                                                                                       | **SHOULD** | Fet     |
| **BOT-11**  | Imatges trencades. Cap element d'imatge pot mostrar la icona d'error del navegador. S'usa un placeholder SVG neutre/gris que respecta les dimensions del contenidor.                                                                                                                                                                            | **MUST**   | Fet     |
| **BOT-12**  | Humanització d'unitats. El HumanizeUnitPipe transforma cadenes crues en text comprensible. Badges visuals: PESA 100G, OCUPA 1,50L, PREU PER UNITAT, PESA 500G…                                                                                                                                                                                  | **SHOULD** | Fet     |
| **BOT-13a** | Avisa'm — visitant anònim. El visitant pot deixar el seu email per rebre notificació quan un producte sense estoc torni a estar disponible.                                                                                                                                                                                                     | **SHOULD** | Pendent |
| **BOT-13b** | Avisa'm — soci autenticat. Quan un soci afegeix un producte sense estoc a la wishlist, la notificació de reposició s'activa automàticament.                                                                                                                                                                                                     | **SHOULD** | Pendent |
| **BOT-14**  | Pàgina "Qui Som". Pàgina estàtica del tenant accessible des del nav principal (Inici / Botiga / Qui Som). Conté informació sobre la cooperativa: missió, equip, valors. El contingut és configurable per tenant.                                                                                                                                | **SHOULD** | Fet     |
| **BOT-15**  | Cistell agrupat per categoria. Al pas de revisió del cistell (BOT-06a), els articles s'agrupen visualment per la seva categoria de producte amb el nom del grup com a header.                                                                                                                                                                   | **SHOULD** | Fet     |

## **4.3 Cercador Global (SRC)**

_Barra de cerca persistent al header que permet localitzar qualsevol contingut de l'aplicació. Els resultats es mostren en un dropdown typeahead sense necessitat de navegar a una pàgina separada._

| ID         | Descripció                                                                                                                                                                                                                                                                   | Prior.     | Estat   |
| :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------ |
| **SRC-01** | Punt d'entrada. Barra de cerca persistent al header, visible a totes les pàgines. Accessible a tots els usuaris (autenticats i anònims). En dispositius mòbils es col·lapsa en una icona de lupa que desplega la barra.                                                      | **MUST**   | Pendent |
| **SRC-02** | Typeahead amb debounce. A partir de 2 caràcters, s'executa la cerca amb un debounce de 300 ms. Els resultats apareixen en un dropdown flotant agrupats per tipus amb un header de secció per cada grup. Màxim 3–5 resultats per grup. Tancament al clic fora o tecla Escape. | **MUST**   | Pendent |
| **SRC-03** | Resultats de productes. Mostra imatge miniatura, nom, categoria i preu. Clic navega a la pàgina de detall del producte.                                                                                                                                                      | **MUST**   | Pendent |
| **SRC-04** | Resultats de categories. Mostra icona, nom del grup i nom de la categoria, i nombre de productes disponibles. Clic navega al llistat filtrat per aquella categoria.                                                                                                          | **MUST**   | Pendent |
| **SRC-05** | Resultats de comandes (soci autenticat). Cerca per número de comanda o nom de producte dins les comandes pròpies del soci. Mostra número de comanda, data i estat. Clic navega al detall de la comanda (EST-03). Invisible per a visitants anònims.                          | **SHOULD** | Pendent |
| **SRC-06** | Resultats de receptes. Cerca pel títol o ingredients de les receptes publicades. Visible només si el mòdul RCT està actiu per al tenant.                                                                                                                                     | **COULD**  | Pendent |
| **SRC-07** | Resultats de pàgines estàtiques. Inclou pàgines com "Qui Som" i pàgines legals. Mostra títol i un extracte breu del contingut.                                                                                                                                               | **SHOULD** | Pendent |
| **SRC-08** | Estat buit. Si cap grup retorna resultats, es mostra un missatge amigable ("No s'han trobat resultats per a «X»") amb suggeriments de productes destacats o categories populars.                                                                                             | **MUST**   | Pendent |
| **SRC-09** | Accessibilitat del cercador. La barra és operativa amb teclat (Tab per entrar, fletxes per navegar, Enter per seleccionar, Escape per tancar). Compleix WCAG 2.1 AA: rol combobox, aria-expanded, aria-activedescendant.                                                     | **MUST**   | Pendent |

## **4.4 Autenticació i Perfil de Soci (PRV)**

| ID          | Descripció                                                                                                                                                                                                | Prior.     | Estat   |
| :---------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------ |
| **PRV-01**  | Login i logout segur. Autenticació via email \+ contrasenya. Tokens JWT gestionats per PocketBase (durada: 7 dies). Sense SSO (Google, Apple, Facebook) a v1.                                             | **MUST**   | Fet     |
| **PRV-02a** | Edició de dades personals. El soci pot actualitzar el seu nom, telèfon i avatar.                                                                                                                          | **MUST**   | En curs |
| **PRV-02b** | Canvi d'email. El soci pot sol·licitar un canvi d'email amb confirmació enviada a la nova adreça.                                                                                                         | **MUST**   | En curs |
| **PRV-03**  | Restabliment de contrasenya. El soci pot sol·licitar un restabliment de contrasenya per correu electrònic.                                                                                                | **MUST**   | Pendent |
| **PRV-04**  | Llibreta d'adreces. El soci pot gestionar múltiples adreces de lliurament i designar-ne una com a predeterminada.                                                                                         | **SHOULD** | Pendent |
| **PRV-05a** | Pre-autorització per email (costat admin). El tenant admin afegeix l'email del futur soci a la llista d'autoritzats via panell eco-admin. Fins que l'email no és a la llista, el registre no és possible. | **MUST**   | Pendent |
| **PRV-05b** | Registre de soci (costat usuari). El futur soci es registra usant l'email pre-autoritzat i crea la seva contrasenya. S'envia email de verificació.                                                        | **MUST**   | Pendent |
| **PRV-06**  | Sol·licitud d'adhesió. El visitant que no és soci pot enviar un formulari de sol·licitud perquè la cooperativa l'avaluï.                                                                                  | **SHOULD** | Pendent |
| **PRV-07**  | Formulari de contacte. Qualsevol visitant pot enviar un missatge general a la cooperativa (nom, email, missatge).                                                                                         | **SHOULD** | Pendent |

## **4.5 Socis de Prova (TRL)**

_Funcionalitat que permet a un visitant experimentar la botiga com a soci temporal (TRIAL) durant un període limitat, sense compromís formal. L'objectiu és reduir la fricció d'incorporació i augmentar la taxa de conversió a soci definitiu._

| Decisió d'arquitectura — per què no una col·lecció separada _Els socis de prova utilitzen la mateixa col·lecció users. Crear una col·lecció nova implicaria migrar dades (cistelles historial configuracions) si finalment es fan socis, i duplicaria la lògica d'autenticació i els Auth Guards a Angular. En canvi afegint membershipStatus i trialEndsAt a users, la conversió a soci definitiu és transparent: el mateix userId, mateix historial, mateixes preferències._ |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| ID         | Descripció                                                                                                                                                                                                                                                                                                                                                                                                                                       | Prior.     | Estat                                                                                                                                                                                                                 |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| **TRL-01** | Alta com a soci de prova. El tenant admin (des d'eco-admin, USR-04) pot crear un compte de soci de prova introduint nom i email. El sistema assigna membershipStatus \= TRIAL i trialEndsAt \= now \+ durada configurada (per defecte 30 dies). S'envia email de benvinguda amb les instruccions d'accés.                                                                                                                                        | **MUST**   | Pendent                                                                                                                                                                                                               |
| **TRL-02** | Badge de prova al header. Mentre membershipStatus \= TRIAL i trialEndsAt \> now, el header mostra un badge persistent "Estàs en mode prova — et queden X dies". El compte enrere es calcula al client. El badge és descartable per sessió però reapareix en el pròxim login.                                                                                                                                                                     | **MUST**   | Pendent                                                                                                                                                                                                               |
| **TRL-03** | CTA de conversió a l'àrea de soci. A la pàgina "El meu compte", els socis en prova veuen un bloc destacat amb el CTA "Fes-te soci definitiu" que redirigeix al flux PRV-06 (sol·licitud d'adhesió) o al flux de pagament si n'hi ha.                                                                                                                                                                                                             | **MUST**   | Pendent                                                                                                                                                                                                               |
| **TRL-04** | Bloqueig de checkout per prova caducada (frontend). Si trialEndsAt \< now, el botó "Finalitzar Compra" es desactiva visualment i en fer-hi clic obre un Material Dialog d'upsell: "El teu període de prova ha finalitzat. Per continuar comprant i mantenir el teu historial formalitza la teva alta com a soci." Amb CTA "Fes-te soci" i link secundari "Potser més tard". El soci pot seguir navegant el catàleg i mantenint el cistell actiu. | **MUST**   | Pendent                                                                                                                                                                                                               |
| **TRL-05** | Bloqueig de checkout per prova caducada (backend — PocketBase API Rules). Les Create Rules de les col·leccions orders i carts validen: (a) l'usuari estigui autenticat (@request.auth.id \!= ""), (b) pertanyi al tenant de la comanda (@request.auth.storeId \= storeId), i (c) membershipStatus \= "ACTIVE"                                                                                                                                    |            | (membershipStatus \= "TRIAL" && trialEndsAt \> @now). Els estats INACTIVE i SUSPENDED queden implícitament bloquejats per no complir cap de les dues condicions. Garanteix la seguretat independentment del frontend. | **MUST** | Pendent |
| **TRL-06** | Preservació de dades en caducar. Quan la prova caduca el soci NO perd les dades: el cistell actiu es manté la wishlist es preserva i l'historial de comandes anteriors és accessible en mode lectura. Incentiu de conversió clau.                                                                                                                                                                                                                | **MUST**   | Pendent                                                                                                                                                                                                               |
| **TRL-07** | Conversió a soci definitiu. Quan el tenant admin aprova la conversió des d'eco-admin s'actualitzen únicament dos camps: membershipStatus → ACTIVE i trialEndsAt → null. En el pròxim refresc del token Angular desapareixen tots els missatges de prova els botons de compra es reactiven i el soci manté el mateix ID historial i preferències. Conversió 100% transparent.                                                                     | **MUST**   | Pendent                                                                                                                                                                                                               |
| **TRL-08** | Notificació de caducitat imminent. X dies abans de la caducitat (configurable per tenant per defecte 3 dies) s'envia un email automàtic al soci de prova recordant-li que el seu període finalitza aviat i convidant-lo a formalitzar l'alta.                                                                                                                                                                                                    | **SHOULD** | Pendent                                                                                                                                                                                                               |
| **TRL-09** | Gestió de socis de prova i estats des d'eco-admin. El tenant admin pot filtrar el llistat de socis per membershipStatus (TRIAL / ACTIVE / INACTIVE / SUSPENDED), veure els dies restants de cada prova i accionar les transicions d'estat: TRIAL → ACTIVE (conversió), ACTIVE → INACTIVE (excedència o baixa), ACTIVE → SUSPENDED (bloqueig per impagament o problemes administratius) des del panell (USR-01 / USR-09).                         | **SHOULD** | Pendent                                                                                                                                                                                                               |

| Requisits PocketBase — nous camps necessaris (TRL) \*Col·lecció users: afegir membershipStatus (Select, 4 opcions: TRIAL | ACTIVE | INACTIVE | SUSPENDED, valor per defecte: ACTIVE per a socis normals) i trialEndsAt (DateTime, nullable). API Rules: orders.createRule i carts.createRule han d'incloure la validació: (@request.auth.membershipStatus \= "ACTIVE" |     | (@request.auth.membershipStatus \= "TRIAL" && @request.auth.trialEndsAt \> @now)). Nota multi-tenant: trialEndsAt es vincula a un tenant concret a través de la relació users.tenant existent. Angular Auth Guard: el guard que protegeix el checkout ha de llegir membershipStatus i trialEndsAt del token JWT actual.\* |
| :----------------------------------------------------------------------------------------------------------------------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## **4.6 Gestió Post-Comanda (PST)**

| Nota de disseny: modes de funcionament _Alguns tenants operen amb cicles de comanda (finestra temporal). Altres funcionen en mode 24/7 (botiga sempre oberta). Les operacions de cancel·lació i modificació estan subjectes a la configuració de cada tenant (tenants.logisticsConfig)._ |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

| ID          | Descripció                                                                                                                                                                    | Prior.     | Estat   |
| :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------ |
| **PST-01a** | Cancel·lació de comanda — mode cicle. El soci pot cancel·lar una comanda mentre el cicle estigui obert i dins la finestra de temps configurada al logisticsConfig del tenant. | **SHOULD** | Pendent |
| **PST-01b** | Cancel·lació de comanda — mode 24/7. El soci pot cancel·lar una comanda en estat PENDING o CONFIRMED dins la finestra configurada a logisticsConfig.                          | **SHOULD** | Pendent |
| **PST-02**  | Modificació d'una comanda activa. El soci pot afegir o eliminar articles d'una comanda activa, dins la finestra permesa per logisticsConfig.                                  | **SHOULD** | Pendent |
| **PST-03**  | Sol·licitud de devolució o canvi. El soci pot iniciar una sol·licitud de devolució o canvi des del detall de la comanda.                                                      | **COULD**  | Pendent |

## **4.7 Valoracions i Ressenyes (VAL)**

| ID         | Descripció                                                                                                                                                                                                                             | Prior.     | Estat   |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------ |
| **VAL-01** | Publicar valoració. El soci autenticat pot enviar una puntuació (1–5 estrelles) i un comentari de text per a productes que hagi comprat. El botó "Escriure una opinió" és visible a la pàgina de detall del producte.                  | **SHOULD** | En curs |
| **VAL-02** | Lectura de valoracions. Qualsevol visitant pot llegir les ressenyes i veure la puntuació mitjana i nombre total de valoracions (ex. "4.8 — 124 valoracions"). El rating i reviewsCount estan desnormalitzats al registre del producte. | **SHOULD** | Fet     |
| **VAL-03** | Reaccions a ressenyes. Els socis poden votar positivament o marcar ressenyes d'altres usuaris. \[Decisió pendent: Q-01\]                                                                                                               | **COULD**  | Diferit |

## **4.8 Notificacions (NOT)**

| ID         | Descripció                                                                                                                                                          | Prior.     | Estat   |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------- | :------ |
| **NOT-01** | Email de confirmació de comanda. El sistema envia un email automàtic en el moment en que el soci finalitza el checkout, amb el resum complet de la comanda.         | **MUST**   | En curs |
| **NOT-02** | Email de canvi d'estat de comanda. El sistema notifica el soci quan la comanda avança d'estat (PREPARING, READY, DELIVERED, CANCELLED).                             | **MUST**   | En curs |
| **NOT-03** | Notificació de reposició d'estoc. Quan un producte torna a estar disponible, s'envia notificació als socis que el tenien a la wishlist o que han activat "Avisa'm". | **SHOULD** | Pendent |
| **NOT-04** | Notificació d'obertura de cicle. S'envia email als socis quan s'obre un nou cicle de comanda (només tenants amb mode cicle).                                        | **SHOULD** | Pendent |
| **NOT-05** | Recordatori de tancament de cicle. S'envia recordatori als socis X hores abans del tancament d'un cicle. El temps és configurable per tenant.                       | **SHOULD** | Pendent |
| **NOT-06** | Preferències de canal. El soci pot configurar els canals preferits per a cada tipus de notificació (Email, SMS, Push). \[SMS: decisió pendent Q-07\]                | **COULD**  | Pendent |

## **4.9 Descomptes i Promocions (MKT)**

| ID         | Descripció                                                                                                                                                                 | Prior.     | Estat   |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------ |
| **MKT-01** | Descomptes per volum. El sistema aplica automàticament descomptes per volum configurats pel tenant (ex. 5% a partir de 3 unitats del mateix producte).                     | **SHOULD** | Pendent |
| **MKT-02** | Codis promocionals. El soci pot introduir un codi promocional al checkout. El sistema el valida i aplica el descompte corresponent.                                        | **SHOULD** | Pendent |
| **MKT-03** | Productes destacats / en oferta. Els productes marcats com a "destacat" (isFeatured \= true) o "oferta" es ressalten visualment al llistat i a la pàgina d'inici (INI-04). | **SHOULD** | Pendent |

## **4.10 Historial i Estadístiques (EST)**

| ID         | Descripció                                                                                                                                                                                                                                                    | Prior.     | Estat   |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------- | :------ |
| **EST-01** | Historial de comandes. El soci pot veure la llista completa de les seves comandes paginada. Cada targeta mostra: número de comanda (\#ORD-TENANT-...), estat amb badge de color, data, total, nombre de productes, mètode de lliurament i resum de productes. | **MUST**   | Fet     |
| **EST-02** | Filtratge i ordenació de l'historial. El soci pot filtrar l'historial per estat o rang de dates, i ordenar per data (ascendent / descendent).                                                                                                                 | **MUST**   | Pendent |
| **EST-03** | Detall de comanda. El soci pot veure el detall complet d'una comanda: articles, quantitats, preus, adreça de lliurament i línia de temps d'estats.                                                                                                            | **MUST**   | Pendent |
| **EST-04** | Exportació PDF. El soci pot descarregar qualsevol comanda en format PDF. \[Mètode de generació: decisió pendent Q-08\]                                                                                                                                        | **SHOULD** | Pendent |
| **EST-05** | Estadístiques de consum personal. Gràfiques de despesa per període i categories més comprades.                                                                                                                                                                | **COULD**  | Pendent |

## **4.11 UI, Accessibilitat i Legal (UI / LGL)**

| ID         | Descripció                                                                                                                                                        | Prior.     | Estat   |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :------ |
| **UI-01**  | Mode fosc / clar / sistema. Selector persistent de tema visual. Respecta la preferència del sistema operatiu per defecte.                                         | **SHOULD** | Pendent |
| **UI-02**  | Selector d'idioma. La UI mostra un selector amb els idiomes activats pel tenant. El selector només apareix si el tenant té més d'un idioma configurat.            | **MUST**   | En curs |
| **UI-03**  | Tema de colors per tenant. Cada tenant pot personalitzar la paleta de colors de la seva botiga.                                                                   | **COULD**  | Pendent |
| **LGL-01** | Pàgines legals. Pàgines informatives estàtiques: Nota Legal, Política de Privadesa i Política de Cookies.                                                         | **MUST**   | Pendent |
| **LGL-02** | Consent de cookies. Banner de consentiment en el primer accés amb acceptació / rebuig explícit. Preferències persistides. \[Implementació: decisió pendent Q-10\] | **MUST**   | Pendent |

## **4.12 Assistent IA i Missatgeria (HLP)**

| ID         | Descripció                                                                                                                                                                 | Prior.    | Estat   |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------- | :------ |
| **HLP-01** | Assistent IA. Chatbot per a preguntes sobre productes, estat de comandes, informació de la cooperativa i suggeriments de receptes. \[Proveïdor LLM: decisió pendent Q-04\] | **COULD** | Pendent |
| **HLP-02** | Missatgeria directa. Canal de missatgeria interna entre soci i tenant admin. \[Implementació: decisió pendent Q-05\]                                                       | **COULD** | Pendent |

## **4.13 Receptaris (RCT)**

| ID         | Descripció                                                                                                                              | Prior.    | Estat   |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------- | :-------- | :------ |
| **RCT-01** | Crear i compartir receptes. Els socis autenticats poden crear receptes triant productes de la botiga com a ingredients i compartir-les. | **COULD** | Pendent |
| **RCT-02** | Consultar receptes. Socis i visitants anònims poden veure les receptes publicades.                                                      | **COULD** | Pendent |
| **RCT-03** | Comentaris a receptes. Els socis poden deixar comentaris en cada recepta publicada.                                                     | **COULD** | Pendent |
| **RCT-04** | Puntuació de receptes. Els socis poden puntuar cada recepta de l'1 al 5\.                                                               | **COULD** | Pendent |

# **5\. Requisits No Funcionals**

## **5.1 Rendiment**

- Largest Contentful Paint (LCP) \< 2,5 s en mòbil 4G. La imatge Hero (INI-01) s'ha de servir en WebP/AVIF i carregar com a LCP crítica (fetchpriority="high").

- Time to Interactive (TTI) \< 4 s.

- Lazy loading d'imatges al llistat de productes.

- Cistell anònim al localStorage (no al servidor) per minimitzar round-trips.

- products.rating i products.reviewsCount desnormalitzats per evitar joins en consultes de llistat.

## **5.2 Accessibilitat (WCAG 2.1 AA) — Obligatori**

_L'aplicació ha de complir WCAG 2.1 Nivell AA. Declaració d'Accessibilitat publicada el 22 de març de 2025\._

- HTML semàntic: \<main\>, \<nav\>, \<header\>, \<footer\>, \<article\> on escaigui.

- Tots els elements interactius amb icona única (wishlist, cistell, cerca) han de tenir aria-label descriptiu.

- El formulari de cerca ha d'incloure un botó visualment ocult (.sr-only) per a lectors de pantalla.

- Offset de l'header fix: html { scroll-padding-top: 120px }.

- Contrast ≥ 4,5:1 per a text normal i ≥ 3:1 per a text gran sobre tots els fons.

- Tots els camps de formulari han de tenir \<label\> associat o aria-labelledby.

- Focus visible i clar en tots els elements interactius per a navegació per teclat.

- Problema conegut: algunes àrees es trenquen al 200% de zoom. Resolució objectiu: 1 mes.

## **5.3 Seguretat**

- Les regles d'accés de PocketBase apliquen aïllament multi-tenant: els usuaris només llegeixen/escriuen registres del seu tenant.

- Autenticació via tokens JWT (PocketBase auth). Durada del token: 7 dies.

- HTTPS obligatori en producció.

- Cap dada sensible (contrasenyes, dades de pagament) emmagatzemada al frontend.

- Els tenant admins estan delimitats estrictament a les seves pròpies dades.

## **5.4 Escalabilitat i Multi-tenancy**

| Aclarició sobre "sense canvis de codi" _Un nou tenant es crea íntegrament des del panell d'administració de PocketBase: nou registre a la col·lecció tenants, assignació de categories, idiomes i logisticsConfig. No es requereix cap desplegament, canvi de codi ni migració de schema._ |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

- Totes les col·leccions principals inclouen un camp tenant per aïllar les dades per cooperativa.

- Les categories globals (tenant \= null) es comparteixen entre tenants; els tenant admins les vinculen des del panell eco-admin.

- L'arquitectura suporta afegir nous tenants sense downtime ni migracions de schema.

## **5.5 Internacionalització (i18n)**

- Llibreria: ngx-translate (runtime translations).

- Una taula global de languages defineix tots els idiomes suportats per la plataforma.

- Cada tenant pot activar o desactivar idiomes específics per a la seva botiga.

- Idiomes inicials: català (ca) i castellà (es). Arquitectura preparada per a anglès i altres.

- Totes les cadenes visibles a l'usuari han d'estar externalitzades: cap text fix al codi.

# **6\. Arquitectura Tècnica**

## **6.1 Stack Tecnològic**

| Capa                   | Tecnologia              | Notes                                                                          |
| :--------------------- | :---------------------- | :----------------------------------------------------------------------------- |
| **Framework frontend** | Angular 21              | Standalone Components. Angular Signals per a gestió d'estat local.             |
| **Components UI**      | Angular Material 3      | Temàtica via CSS custom properties (MDC-based). Sistema de colors Material 3\. |
| **Estils**             | Tailwind CSS \+ SCSS    | Tailwind per a layout i espaiat. Variables CSS natives per al theming M3.      |
| **i18n**               | ngx-translate           | Traduccions en temps d'execució. Fitxers JSON per idioma per tenant.           |
| **Tipografia**         | Manrope (Google Fonts)  | Totes les mides de text, headings i components UI.                             |
| **PWA**                | Angular Service Worker  | Ja implementat. Cache offline i instal·lació com a app al dispositiu.          |
| **Backend / API**      | PocketBase              | Go, auto-allotjat. REST \+ subscripcions en temps real (SSE).                  |
| **Base de dades**      | SQLite (via PocketBase) | Encastada. Migracions gestionades per PocketBase.                              |
| **Monorepo**           | Nx (plastikspace)       | Libs compartides. eco-store és una app dins el workspace.                      |
| **Hosting**            | VPS auto-allotjat       | Docker recomanat per a PocketBase.                                             |
| **CI/CD**              | GitHub Actions          | Pipeline de desplegament a definir.                                            |

## **6.2 Model de Dades PocketBase**

_Les col·leccions de sistema (\_superusers etc.) s'ometen d'aquesta taula. Totes les col·leccions principals inclouen un camp tenant per a l'aïllament multi-tenant._

| Col·lecció                   | Tipus | Camps principals                                                                                                                                                                                                                                                                                                                           | Notes                                                                                                                                             |
| :--------------------------- | :---- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **users**                    | auth  | name, email, role, tenant, normalizedName, phone, avatar, verified, membershipStatus (TRIAL                                                                                                                                                                                                                                                | ACTIVE                                                                                                                                            | INACTIVE | SUSPENDED), trialEndsAt (DateTime nullable) | Rols: PARTNER · TENANT_ADMIN · GLOBAL_ADMIN. Token: 7 dies. v1.7: membershipStatus (default ACTIVE, 4 valors) i trialEndsAt per al mòdul de socis de prova (TRL). |
| **tenants**                  | base  | name, email, phone, address, city, zip, province, normalizedName, languages, logo, active, closed, closedReason, slogan, description, fiscalName, cif, logisticsConfig (JSON), heroTitle (JSON i18n), heroSubtitle (JSON i18n), heroImagePreset (String), heroImageCustom (File), aboutUsText (JSON i18n), howItWorksSteps (JSON opcional) | v1.6: afegits camps hero\_\* i aboutUsText per a la pàgina d'inici (INI). logisticsConfig: finestres de cancel·lació horaris modes de lliurament. |
| **products**                 | base  | name (JSON i18n), normalizedName, inStock, stock, price, iva, priceWithIva, images (màx. 4), unitType, unitBase, minQuantity, maxQuantity, category, tags, rating, reviewsCount, features (JSON), description (JSON i18n), origin, provider, tenant, isFeatured (Boolean)                                                                  | v1.6: afegit isFeatured (Boolean default false) per a l'aparador de la home (INI-04/MKT-03). rating i reviewsCount desnormalitzats.               |
| **product_categories**       | base  | name (JSON i18n), normalizedName, description (JSON i18n), color, icon, group, tenant                                                                                                                                                                                                                                                      | tenant \= null → categoria global compartida. Vinculada a category_groups.                                                                        |
| **category_groups**          | base  | name (JSON i18n)                                                                                                                                                                                                                                                                                                                           | Grups globals de categories (ex. Fruites Verdures Làctics).                                                                                       |
| **tags**                     | base  | name, normalizedName, color, lang, client (tenant)                                                                                                                                                                                                                                                                                         | Creats on-the-fly pel tenant admin. camp client → tenant propietari (cascade delete).                                                             |
| **carts**                    | base  | user, tenant, items (JSON), status (ACTIVE/DONE/EXPIRED), expiresAt, orderCycle, deliveryMethod, day, time, address (JSON), subtotal, tax, shipping, total, notes                                                                                                                                                                          | Items com a JSON (no col·lecció separada). Visitants anònims: localStorage al frontend.                                                           |
| **order_cycles**             | base  | tenant, name, code, startsAt, endsAt, approxDelivery, status (DRAFT/OPEN/PROCESSING/COMPLETED/CLOSED)                                                                                                                                                                                                                                      | Opcional: tenants 24/7 no creen cicles. status controla la finestra de compra.                                                                    |
| **orders**                   | base  | orderNumber, tenant, user, status (PENDING/CONFIRMED/PREPARING/READY/DELIVERED/CANCELLED), paymentStatus (UNPAID/PAID/REFUNDED/FAILED), deliveryMethod, day, time, address (JSON), subtotal, tax, shipping, total, items (JSON), notes, language, orderCycle                                                                               | items és JSON (no col·lecció separada). paymentStatus reservat per a integració futura de pagament.                                               |
| **languages**                | base  | code (únic), name, Active, order                                                                                                                                                                                                                                                                                                           | Taula global d'idiomes suportats. code: ca es en…                                                                                                 |
| **tenant_addresses**         | base  | tenant, name, address, city, zip, province, phone, default, location (JSON), active, slots (JSON), instructions (JSON)                                                                                                                                                                                                                     | Punts de recollida i lliurament de la cooperativa. slots: franges horàries disponibles.                                                           |
| **user_addresses**           | base  | user, name, fullName, address, city, zip, province, phone, default, instructions, active                                                                                                                                                                                                                                                   | Llibreta d'adreces del soci (cascade delete en eliminar l'usuari).                                                                                |
| **product_categories_stats** | view  | category, name, normalizedName, color, groupName, icon, tenant, totalProducts                                                                                                                                                                                                                                                              | Vista SQL calculada. Mostra el recompte de productes en estoc per categoria i tenant. Usada per als filtres de la UI i la home (INI-05).          |

### **Notes del model de dades**

- No existeix una col·lecció order_items. Els articles de cistella i comanda s'emmagatzemen com a camp items (JSON).

- products.rating i products.reviewsCount s'actualitzen via hook de PocketBase quan es crea o modifica una ressenya.

- tenant_addresses (punts de recollida/lliurament de la coop) és distint de user_addresses (llibreta personal del soci).

- tags.client referencia el tenant propietari i s'eliminen en cascada quan s'elimina el tenant.

- v1.7 — nous camps users.membershipStatus (TRIAL|ACTIVE|INACTIVE|SUSPENDED) i users.trialEndsAt: gestionen el cicle de vida complet dels socis sense col·lecció separada. SUSPENDED permet bloqueig temporal per impagament o problemes administratius.

- v1.6 — nou camp products.isFeatured: Boolean per marcar productes per a l'aparador de la pàgina d'inici.

- v1.6 — nous camps tenants.hero\_\* i tenants.aboutUsText: configuren la pàgina d'inici per tenant (INI-01, INI-03, INI-06).

# **7\. Sistema de Disseny i Directrius UX**

## **7.1 Identitat Visual — Eco Vibrant**

El llenguatge de disseny és "Eco Vibrant": càlid natural proper i de confiança. Evita estètiques corporatives fredes i emfatitza la missió ecològica de la cooperativa a través del color la forma i la tipografia.

### **7.1.1 Paleta de Colors (Material 3\)**

_Colors generats a partir de les llavors de marca mitjançant Material 3 Color Utilities. Suport de mode clar/fosc via CSS custom properties i light-dark()._

| Rol                      | Clar (light) | Fosc (dark) | Ús principal                                         |
| :----------------------- | :----------- | :---------- | :--------------------------------------------------- |
| **Primary (Fulla)**      | \#356a1f     | \#9ad67d    | CTA principals, botó "Afegir", accions clau          |
| **Primary Container**    | \#b5f397     | \#1d5206    | Fons del selector de quantitat, elements actius      |
| **Secondary (Sàlvia)**   | \#41682e     | \#a6d38c    | Elements de suport, badges de categoria              |
| **Tertiary (Terracota)** | \#914c18     | \#ffb689    | Accents, estrelles de valoració, promocions          |
| **Background / Surface** | \#f8faf0     | \#11140f    | Fons de l'aplicació (blanc trencat / verd molt fosc) |
| **Surface Container**    | \#ecefe5     | \#1d211a    | Fons de targetes, panells, drawers                   |
| **On Surface**           | \#191d16     | \#e1e4d9    | Text principal sobre superfície                      |
| **Outline**              | \#72796b     | \#8c9384    | Vores d'inputs, divisors, separadors                 |
| **Error**                | \#ba1a1a     | \#ffb4ab    | Errors de validació, accions destructives            |

### **7.1.2 Tipografia — Manrope**

| Token M3           | Mida     | Pes | Ús                              |
| :----------------- | :------- | :-- | :------------------------------ |
| **Display Large**  | 3.562rem | 400 | Títols hero principals (INI-01) |
| **Headline Large** | 2rem     | 400 | Títols de secció majors         |
| **Title Large**    | 1.375rem | 400 | Títols de targetes i panells    |
| **Body Large**     | 1rem     | 400 | Text corporal principal         |
| **Body Medium**    | 0.875rem | 400 | Text secundari, descripcions    |
| **Label Large**    | 0.875rem | 500 | Etiquetes de botons             |
| **Label Small**    | 0.688rem | 500 | Badges, tags, microtext         |

### **7.1.3 Forma i Espaiat**

- Targetes de producte: border-radius 1rem (16px) — targetes suaus i acolladores.

- Botons pills i badges de tags: border-radius 9999px — totalment arrodonits.

- Cap cantell agut en elements principals de la UI.

- Escala d'espaiat CSS: \--space-xs (0.25rem) · \--space-sm (0.5rem) · \--space-md (1rem) · \--space-lg (1.5rem) · \--space-xl (2rem).

## **7.2 Pàgina d'Inici — Directrius UX**

La pàgina d'inici és la carta de presentació de cada cooperativa. El disseny segueix les directrius del tema Eco Vibrant i prioritza el rendiment (LCP) i la conversió.

- Hero section: fons fosc (Verd Sàlvia o Verd Fulla) o imatge a pantalla completa amb overlay enfosquit (rgba(0,0,0,0.4)). Text en blanc. Display Large per al títol. Botó CTA Primary blanc sobre verd.

- Secció "Com funciona": fons Background (\#f8faf0). Icones il·lustrades. Màxim 3–4 passos per no sobrecarregar.

- Aparador de productes destacats: grid de 2–4 targetes (mateixa maqueta que BOT-01). Carrusel amb scroll horitzontal en mòbil.

- Navegació per categories: targetes amb color de categoria i icona. Border-radius 1rem. Màxim 6–8 targetes visibles.

- Secció Qui Som / Impacte: fons Surface Container (\#ecefe5). Text enriquit alineat a l'esquerra. Possibilitat d'afegir xifres clau amb accent Tertiary (terracota).

- Social Proof: fons Background. Cites de socis amb avatar i nom. Carrusel o graella de 2–3 testimonis.

- Pre-footer: fons Primary (verd) amb text blanc. CTA gran i visible.

- Scroll reveal: animació de fade-in \+ slide-up per a les seccions. duration: 400ms ease-out. Respectar prefers-reduced-motion.

## **7.3 Patrons UI Clau**

### **7.3.1 Header Flotant en Píndola**

- Header sticky a la part superior del viewport.

- Fons semitransparent amb backdrop-filter: blur() per a profunditat visual.

- Conté: logo nav principal selector d'idioma barra de cerca (SRC-01) icona wishlist i icona cistell amb badge comptador.

- A mòbil: es replega a menú hamburguesa \+ logo \+ icona cistell.

### **7.3.2 Botó Dinàmic d'Afegir al Cistell**

- Estat inicial: botó sòlid Primary verd amb etiqueta "Afegir".

- Després del primer tap: transició suau al selector de quantitat \[− N \+\] amb fons Primary Container.

- El selector actualitza el cistell en temps real amb debounce a les crides API.

- Si la quantitat arriba a 0 el selector reverteix al botó "Afegir".

### **7.3.3 Grid i Targetes de Producte**

- Grid responsive: 1 columna (xs/360px) · 2 (sm/600px) · 3 (md/960px) · 4 (lg+/1280px).

- Targetes: fons blanc border-radius 1rem elevation level 1\.

- Targeta: miniatura nom unitat/pes humanitzat preu amb IVA badge d'estoc i botó d'afegir.

- Productes sense estoc: overlay grisat \+ CTA "Avisa'm".

## **7.4 Notes d'Implementació Angular**

- Tots els components han de ser Standalone (sense NgModules excepte integracions de tercers).

- Gestió d'estat: Angular Signals per a estat local; serveis amb Signals per a estat compartit. NgRx només si la complexitat ho justifica.

- Lazy loading: els mòduls de funcionalitat (catàleg comandes perfil receptari) han de ser rutes lazy-loaded.

- PocketBase SDK JS oficial embolcallat en serveis Angular injectables per a consultes i subscripcions en temps real.

- INI: la pàgina d'inici és una ruta lazy-loaded. Les seccions de contingut es carreguen en paral·lel via forkJoin. La imatge Hero té fetchpriority="high" i preload link a l'HTML.

# **8\. Fora de l'Abast (v1)**

## **8.1 Pagament en Línia**

| Decisió de disseny _El pagament en línia (Stripe PayPal Redsys) és fora d'abast a v1. Motiu: els productes ecològics solen tenir pesos variables i el preu final no es pot determinar fins al picking. Dos models futurs: (a) pagament en lliurament; (b) activació del pagament en línia un cop el preu final sigui confirmat._ |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## **8.2 Aplicació Nativa Mòbil (iOS / Android)**

L'aplicació web és completament responsive i ja implementa Service Workers (PWA). Una app nativa independent queda fora d'abast de v1.

## **8.3 Panell d'Administració (eco-admin)**

La gestió interna (Tenant Admin: productes comandes configuració; Superadmin: tenants categories globals idiomes) correspon al projecte eco-admin que és un document i aplicació separats.

## **8.4 Login Social**

Únicament autenticació per email \+ contrasenya. El registre requereix pre-autorització del tenant admin. Cap integració de Google / Apple / Facebook SSO a v1.

## **8.5 CMS de Continguts (eco-admin)**

La gestió de la pàgina d'inici (INI) es fa des del panell eco-admin a v1. Un editor visual WYSIWYG de pàgines estàtiques és funcionalitat futura (post-v1).

# **9\. Funcionalitats Futures (Post-v1)**

| Funcionalitat                        | Descripció                                                                                                                                                                  | Horitzó       |
| :----------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------ |
| **Landing Page Comercial**           | Pàgina de presentació a https://9botiga.top per atraure noves cooperatives. Mostra funcionalitats, casos d'ús i CTA de sol·licitud de demo. App independent d'eco-store.    | Fase 2        |
| **Pagament en Línia**                | Integrar Stripe, PayPal o Redsys un cop definit el model de preus per pes variable. Dos models: (a) pagament en lliurament o (b) activació quan el preu final és confirmat. | Fase 2        |
| **Assistent IA (HLP-01)**            | Chatbot per a preguntes sobre productes, comandes i receptes. Idea exploratòria: rotació multi-model per aprofitar tiers gratuïts de diversos proveïdors.                   | Fase 3        |
| **Missatgeria Directa (HLP-02)**     | Canal de missatgeria interna entre soci i tenant admin. Obert a discovery: solució pròpia vs. tercers (Crisp, Intercom…).                                                   | Fase 3        |
| **Estadístiques Avançades (EST-05)** | Gràfiques de despesa per període, categories més comprades i evolució del consum personal del soci.                                                                         | Fase 3        |
| **CMS visual de la Home**            | Editor visual WYSIWYG per gestionar la pàgina d'inici (INI) des d'eco-admin sense coneixements tècnics.                                                                     | Fase 3        |
| **Preus B2B Personalitzats**         | Tarifes negociades per client, descomptes contractuals i condicions especials per a membres d'honor.                                                                        | Fase avançada |

# **10\. Decisions Pendents**

_Les decisions resoltes s'han incorporat directament al cos del document. La taula recull únicament les qüestions obertes que requereixen acció._

| ID       | Qüestió / Decisió pendent                                                                                                                                  | Responsable        | Data límit      | Estat   |
| :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- | :-------------- | :------ |
| **Q-01** | Han d'estar les reaccions a ressenyes (VAL-03) a l'abast de v1?                                                                                            | PO                 | Sprint planning | Obert   |
| **Q-04** | Assistent IA (HLP-01): quin proveïdor LLM (OpenAI, Ollama local, altre)? Idea exploratòria: script de rotació multi-model per aprofitar tiers gratuïts.    | PO \+ Tech Lead    | Q3 2026         | Obert   |
| **Q-05** | Missatgeria directa (HLP-02): solució pròpia o tercers (Crisp, Intercom…)?                                                                                 | PO                 | Q3 2026         | Obert   |
| **Q-06** | Tags: llista fixa normalitzada per tenant (evitar eco/Eco/ecologic) o free-form?                                                                           | PO \+ Superadmin   | Sprint planning | En curs |
| **Q-07** | Canal SMS per a notificacions (NOT-06): quin proveïdor (Twilio, Vonage)? Necessari per a v1?                                                               | PO                 | Q2 2026         | Obert   |
| **Q-08** | Exportació PDF (EST-04): generar al client (jsPDF/pdfmake) o al servidor via hook PocketBase?                                                              | Tech Lead          | Sprint planning | Obert   |
| **Q-10** | Consent de cookies (LGL-02): CMP de tercers (Cookiebot, Axeptio) o solució pròpia?                                                                         | Tech Lead \+ Legal | Sprint planning | Obert   |
| **Q-11** | Pàgina d'inici (INI-04) — aparador de productes: mode manual (isFeatured), mode dinàmic (rating/vendes) o tots dos com a opció de configuració per tenant? | PO                 | Sprint planning | Obert   |

# **11\. Annexos**

## **11.1 Glossari**

| Terme                              | Definició                                                                                                                                                                                                                                                                                                                                                                  |
| :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ | ------------------------------------------------------- |
| **Tenant**                         | Una cooperativa o associació que opera la seva pròpia botiga sobre la plataforma (ex. Associació El Llevat).                                                                                                                                                                                                                                                               |
| **Order Cycle (Cicle de comanda)** | Finestra temporal durant la qual els socis poden realitzar comandes. Normalment setmanal o quinzenal. Alguns tenants operen en mode 24/7 sense cicles.                                                                                                                                                                                                                     |
| **Soci / Membre**                  | Usuari registrat que és formalment soci de la cooperativa. Té drets de compra complets.                                                                                                                                                                                                                                                                                    |
| **Wishlist**                       | Llista de productes que un soci vol seguir o comprar en el futur. Requereix autenticació.                                                                                                                                                                                                                                                                                  |
| **logisticsConfig**                | Camp JSON al registre tenants que emmagatzema la configuració logística: finestres de cancel·lació, horaris de lliurament i modes disponibles.                                                                                                                                                                                                                             |
| **heroImagePreset**                | Valor String que identifica una imatge predefinida de la galeria de l'app per al Hero de la home (valors: hort                                                                                                                                                                                                                                                             | cistella | mercat | default). Permet tenir bon aspecte sense fotos pròpies. |
| **isFeatured**                     | Camp Boolean a la col·lecció products. Quan és true, el producte es mostra a l'aparador de productes destacats de la pàgina d'inici (INI-04).                                                                                                                                                                                                                              |
| **membershipStatus**               | Camp Select a la col·lecció users amb 4 valors: TRIAL (soci de prova, accés complet mentre trialEndsAt \> now), ACTIVE (soci definitiu consolidat), INACTIVE (excedència o baixa temporal — manté historial però no pot operar), SUSPENDED (bloquejat temporalment, ex: per impagament o problemes administratius). Controla l'accés al checkout via PocketBase API Rules. |
| **trialEndsAt**                    | Camp DateTime a la col·lecció users (nullable). Data i hora exacta de caducitat del període de prova. Només té efecte si membershipStatus \= TRIAL. Null per a qualsevol altre estat (ACTIVE, INACTIVE, SUSPENDED).                                                                                                                                                        |
| **HumanizeUnitPipe**               | Pipe Angular pur que transforma cadenes crues (ex. "1500 g") en text comprensible (ex. "Aprox. 1,5 kg").                                                                                                                                                                                                                                                                   |
| **PWA / Service Worker**           | Progressive Web App. L'aplicació usa Service Workers per a cache offline i instal·lació com a app al dispositiu.                                                                                                                                                                                                                                                           |
| **SSOT**                           | Single Source of Truth — aquest document és el SSOT per a totes les decisions de producte d'eco-store.                                                                                                                                                                                                                                                                     |
| **eco-admin PRD**                  | Document de requisits separat que cobreix el panell d'administració per a Tenant Admin i Superadmin.                                                                                                                                                                                                                                                                       |
| **MoSCoW**                         | Marc de priorització: Must Have · Should Have · Could Have · Won't Have (per a aquesta versió).                                                                                                                                                                                                                                                                            |

## **11.2 Declaració d'Accessibilitat**

- Declaració publicada el 22 de març de 2025\.

- Objectiu: WCAG 2.1 Nivell AA — Totalment conforme.

- Limitació coneguda: algunes àrees es trenquen al 200% de zoom. Resolució objectiu: 1 mes.

- Mètode d'avaluació: auto-avaluació. Es recomana auditoria de tercers independent per al llançament v1.0.

- Contacte: info@llevat.org | \+34 676 057 072 | SLA: 2 dies hàbils.

## **11.3 Historial de Revisions**

| Versió  | Data     | Autor                       | Canvis principals                                                                                                                                                                                                                                                                |
| :------ | :------- | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **0.1** | Oct 2023 | Equip projecte              | Esborrany inicial de requisits funcionals.                                                                                                                                                                                                                                       |
| **1.0** | Feb 2026 | Equip projecte              | SRS complet, arquitectura i sistema de disseny afegits.                                                                                                                                                                                                                          |
| **1.1** | Feb 2026 | PO / Claude                 | Consolidació en PRD SSOT: schema PocketBase, Q\&A, fora d'abast, MoSCoW.                                                                                                                                                                                                         |
| **1.2** | Feb 2026 | Carlos Plastikaweb / Claude | Traducció al català. 21 comentaris processats. Flux PRV-05, mode 24/7, pagament diferit, landing page, PWA/SW, ngx-translate.                                                                                                                                                    |
| **1.3** | Mar 2026 | Carlos Plastikaweb / Claude | Neteja per a stakeholders externs. Atomització de specs (NOT-01/02, PST-01a/01b, PRV-02a/02b, BOT-13a/13b, PRV-05a/05b, EST-02/03). Schema PocketBase actualitzat des del JSON oficial. Paleta de colors M3 completa.                                                            |
| **1.4** | Mar 2026 | Carlos Plastikaweb / Claude | Actualització d'estat per revisió visual de l'app. BOT-06 atomitzat en 06a/06b/06c. Nous requisits: BOT-14 (Qui Som), BOT-15 (cistell agrupat). Estados actualitzats: BOT-02d, BOT-03, BOT-10 → Fet; VAL-01 → En curs; VAL-02 → Fet.                                             |
| **1.5** | Mar 2026 | Carlos Plastikaweb / Claude | Nou mòdul §4.4 Cercador Global (SRC-01 a SRC-09): barra persistent al header, typeahead amb debounce 300ms, resultats agrupats per productes/categories/comandes/receptes/pàgines estàtiques. Renumeració de seccions §4.                                                        |
| **1.6** | Mar 2026 | Carlos Plastikaweb / Claude | Nou mòdul §4.1 Pàgina d'Inici (INI-01 a INI-09). Nous camps schema: tenants.heroTitle, heroSubtitle, heroImagePreset, heroImageCustom, aboutUsText, howItWorksSteps; products.isFeatured. Nova decisió pendent Q-11. Directrius UX Home a §7.2. §8.5 CMS visual (fora abast v1). |
| **1.7** | Mar 2026 | Carlos Plastikaweb / Claude | Nou mòdul §4.5 Socis de Prova (TRL-01 a TRL-09): alta de prova, schema users (membershipStatus 4 valors: TRIAL                                                                                                                                                                   | ACTIVE | INACTIVE | SUSPENDED \+ trialEndsAt), badge al header, bloqueig de checkout (frontend \+ PocketBase API Rules amb storeId), preservació de dades en caducar, upsell dialog, conversió transparent a soci definitiu. Renumeració §4.5→4.6 (PST) fins §4.13 (RCT). Annexos: split(',') eliminats, arrays explícits. Tots els fields en camelCase. |

_Aquest document és el SSOT de l'Eco Store. Tots els stakeholders han de consultar-lo abans de prendre decisions de producte disseny o enginyeria._
