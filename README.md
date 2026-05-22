# Lloguer Ètic



**Autors:** Pol Casals i Oriol Velasco



---



## 1. Introducció

Aquest projecte és un videojoc web amb lògica i gràfics 2D desenvolupat com a pràctica de l'assignatura. El joc, anomenat "Lloguer Ètic", posa el jugador en la pell de diferents personatges del món immobiliari, obligant-lo a prendre decisions sobre la compra, reforma i lloguer d'habitatges, equilibrant els diners guanyats amb l'ètica professional.



Enllaç al joc (GitHub Pages): https://lloguer-etic-treball-en-equip.github.io/Lloguer-tic/

Enllaç al BAS: https://bas.udg.edu/~u6105601/Lloguer-tic/

Enllaç al repositori: https://github.com/Lloguer-Etic-treball-en-equip/Lloguer-tic

## 2. Descripció del disseny del joc

El joc és una implementació de la demo d'actualitat de Disseny Conceptual de Videojocs. Consisteix en una combinació de mini-jocs estructurats en diferents fases consecutives:



* **Selecció de Rol:** Un menú principal amb una ruleta aleatòria que assigna el rol al jugador (Agent Immobiliari, Aprenent Immigrant, Becari).

* **Fase 1 (Oficina - Comprar):** Es genera una oferta d'habitatge aleatòria (imatge, preu i habitacions). El jugador pot acceptar-la o rebutjar-la per buscar-ne una altra.

* **Fase 2 (Reformar):** Un mini-joc interactiu on s'han de reparar els desperfectes de la casa fent clic a les esquerdes.

* **Fase 3 (Carrer - Buscar Clients):** Un mini-joc on el jugador ha de dibuixar manualment un cartell d'anunci utilitzant el ratolí.

* **Fase 4 (Llogar):** Selecció del llogater ideal segons el rol assignat prèviament, afectant els punts d'ètica o els diners finals.

* **Esdeveniments Aleatoris:** Entre fases, hi ha un 30% de probabilitats que sorgeixi un avís de manteniment urgent que pausa el flux normal del joc.



## 3. Descripció de les parts més rellevants de la implementació

Tot el joc ha estat implementat utilitzant el framework **Phaser.io v3**. La implementació s'ha dividit principalment en les següents parts:



* **Estructura per Escenes (`Phaser.Scene`):** El joc està modularitzat en diverses escenes (MainMenu, OfficeScene, RepairScene, ClientScene, RentScene, MaintenanceScene, ResultsScene, PauseMenu). Això permet una transició neta entre els diferents mini-jocs i menús.

* **Gestió d'Estat Global:** S'utilitza un objecte `gameState` per mantenir la persistència de dades entre les diferents escenes de Phaser (rol del jugador, diners acumulats, punts d'ètica i l'última escena visitada per poder tornar-hi després d'un esdeveniment aleatori).

* **Gràfics Dinàmics (`Phaser.GameObjects.Graphics`):** Per a la Fase 3, s'ha implementat un sistema de dibuix en temps real capturant els esdeveniments del ratolí (`pointerdown`, `pointermove`, `pointerup`) per traçar línies dins d'una àrea delimitada.

* **Menú de Pausa:** S'ha integrat un menú de pausa funcional dins del joc que s'activa amb la tecla ESC, aturant l'escena activa i superposant una nova escena semitransparent.



## 4. Problemes trobats

Durant el desenvolupament del projecte i el treball en equip a través de GitHub, ens hem trobat amb els següents reptes:



* **Problemes amb Git i GitHub:** Vam tenir alguns conflictes de fusió (`merge conflicts`) i errors de `divergent branches` a l'hora de sincronitzar els canvis locals fets des del servidor (BAS) amb els canvis directes fets al repositori web. Es van solucionar configurant l'estratègia de `pull` i aprenent a gestionar l'editor de text de la terminal.

* **Càrrega d'imatges (CORS):** Al principi les imatges no carregaven i la pantalla es veia borrosa per les diferències de resolució. Ho vam solucionar executant el joc mitjançant un servidor local i ajustant el `devicePixelRatio` a la configuració de Phaser.



## 5. Manual d'usuari

Per jugar a "Lloguer Ètic", simplement accedeix a l'enllaç de GitHub Pages.

1.  Al menú principal, fes clic al botó central per girar la ruleta i descobrir el teu rol.

2.  Llegeix les ofertes a la pantalla de l'Oficina. Pots rebutjar-les si no t'agraden. Quan n'acceptis una, avançaràs de fase.

3.  Fes clic sobre les esquerdes (símbols de llamp) per reparar la casa.

4.  Clica i arrossega el ratolí dins del requadre blanc per dibuixar el teu anunci i clica "Publicar".

5.  Escull el llogater que millor s'adapti a les característiques del teu rol.

6.  *Nota:* En qualsevol moment de les fases principals pots prémer la tecla **ESC** per obrir el menú de pausa. 
