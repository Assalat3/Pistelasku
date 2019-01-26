//Toni Ordning, 26.11.2018
//Puutteita:
//---Joukkuekisa on (lähes) kokonaan tekemättä. Pisteet lasketaan hyppääjien
//maan mukaan riippumatta kisatyypistä.
//---Tuloksia tallentaessa ei ole tarkistusta, onko hyppääjän tiedot annettu, joten
//kuka tahansa voi hypätä ja "saada tuloksia", vaikka hänen tietojaan ei ole annettu
//ennen hyppyä.
//---Mäki ja kisatyyppi ensimmäisessä valikossa ei muuta muuta lomaketta mitenkään.
//Esimerkiksi mäkityypin voi muuttaa kesken hyppykierroksen. Kenties haitallinen.
//
//Parannusideoita:
//---"taulukot" voisivat olla table-tyyppejä ennemmin kuin textarea-tyyppejä.
//---Kisan tiedot pitäisi saada siirrettyä esim. tiedostoon. Kaikki "tallennettu"
//tieto pitäisi pystyä tallentamaan. Päivittäisi MC-pisteet vain lopusta.
//---Hyppääjien tietojen haku taulukoista esim. nimen ja maan perusteella?
//---Parantele CSS:ää yleisesti. Koheesio, asettelu etenkin.
//---input-kentät voisivat palata "tyhjiksi" (css-elementit poislukien) kun käyttäjä
//on syöttänyt tiedot ja tallentanut.
//---Jos kilpailija ei hyppää, mutta kisaajia on alle 20, hän saa silti mc-pisteitä. Vika vai ominaisuus?
var Tiedot = /** @class */ (function () {
    function Tiedot() {
        this.kierroscount = 1; //monesko kierros.
    }
    return Tiedot;
}());
var JoukkueTiedot = /** @class */ (function () {
    function JoukkueTiedot() {
        this.pisteet = 0;
    }
    return JoukkueTiedot;
}());
var OsanottajaLaskuri = 1;
var Joukkueet = []; //Joukkueille.
var KilpailijoidenTiedot = []; //Kilpailijoille.
var KilpailijoidenNimet = []; //Hyppääjien tarkistamiseksi.
var Kisatulokset = []; //Tuloksille.
function transferKisatiedot(frmKisa) {
    var Kisa = frmKisa.txtKisa.value;
    if (Kisa == '') {
        return alert("Syötä Kisan nimi.");
    }
    var Kisatyyppi = frmKisa.slcKisatyyppi.value;
    var Mäki = frmKisa.slcMäkityyppi.value;
    var KPiste = frmKisa.nbrKPiste.value;
    if (KPiste < 60) {
        return alert("Virheellinen K-pisteen arvo.");
    }
    else if (KPiste > 180) {
        return alert("Virheellinen K-pisteen arvo.");
    }
    else { }
    frmKisa.txaKisaVastaus.value = Kisa + ', ' + Kisatyyppi + ', ' + Mäki + ', ' + KPiste;
    if (Kisatyyppi == "yksilömäki") {
        frmKisa.flsJoukkue.disabled = true;
    }
    else if (Kisatyyppi == "yhdistetty") {
        frmKisa.flsJoukkue.disabled = true;
    }
    else if (Kisatyyppi == "joukkuemäki") {
        frmKisa.flsJoukkue.disabled = false;
    }
    frmKisa.flsKisaaja.disabled = false; //Kisaaja-osio saatavaksi käyttäjälle.
    frmKisa.flsHyppy.disabled = false; //Hyppy-osio saatavaksi käyttäjälle.
}
function transferJoukkue(frmKisa) {
    var JoukkueenNimi = frmKisa.txtJoukkueNimi.value;
    var Joukkue = new JoukkueTiedot;
    Joukkue.nimi = JoukkueenNimi;
    Joukkueet.push(Joukkue);
    console.log(Joukkueet);
    var JoukkueInfo = document.createElement("input"); //Näyttää luodut joukkueet Joukkue-osion lopussa.
    JoukkueInfo.setAttribute("type", "input"); //Luo jokaiselle joukkueelle oman input-kentän.
    JoukkueInfo.setAttribute("value", JoukkueenNimi);
    JoukkueInfo.setAttribute("class", "answersheet");
    JoukkueInfo.setAttribute("id", "txt" + JoukkueenNimi);
    JoukkueInfo.setAttribute("readonly", "true");
    document.getElementById("flsJoukkue").appendChild(JoukkueInfo);
    //    console.log(JoukkueInfo);   //Troubleshoot
    //KORJAA TYYLIVIRHEET MYÖHEMMIN
    //    console.log(Joukkueet); //Troubleshoot
    frmKisa.slcJoukkue.add(document.createElement("option"), frmKisa.slcJoukkue[1]); //Lisää dropdown-listaan vaihtoehdon joukkueelle paikkaan 1.
    frmKisa.slcJoukkue[1].text = JoukkueenNimi; //Muuttaa lisätyn vaihtoehdo nimen joukkueen nimeksi.
}
function transferKisaajanTiedot(frmKisa) {
    var Kisaaja = new Tiedot();
    Kisaaja.name = frmKisa.txtKilpailija.value;
    Kisaaja.mcpisteet = frmKisa.nbrMC.value;
    Kisaaja.maa = frmKisa.slcMaa.value;
    Kisaaja.joukkue = frmKisa.slcJoukkue.value;
    if (frmKisa.slcJoukkue.selected == "Ei") {
        Kisaaja.joukkueessa = false;
    }
    else {
        Kisaaja.joukkueessa = true;
    }
    //    console.log(Kisaaja); //Troubleshoot
    frmKisa.txaKilpailijaVastaus.value += OsanottajaLaskuri + ': ' + Kisaaja.name + ', ' + Kisaaja.mcpisteet + ', ' + Kisaaja.maa + '\n';
    /*    for (let i = 0; i < Joukkueet.length; ++i){
            frmKisa.tblJoukkueVastaus.value += Joukkueet[i] + '\n';
        }   */
    OsanottajaLaskuri += 1; //Listaa kilpailijoiden määrän ja selventää listaa kisaajista.
    KilpailijoidenTiedot.push(Kisaaja);
    KilpailijoidenNimet.push(frmKisa.txtKilpailija.value);
    //    console.log(KilpailijoidenTiedot[0]);    //Troubleshoot
}
function transferHyppy(frmKisa) {
    var Hyppääjä = frmKisa.txtHyppääjä.value;
    var KPiste = frmKisa.nbrKPiste.value;
    if (KPiste < 60) {
        return alert("K-pistettä ei ole määritetty oikein!");
    }
    else if (KPiste > 180) {
        return alert("K-pistettä ei ole määritetty oikein!");
    }
    else { }
    var Mäkityyppi = frmKisa.slcMäkityyppi.value;
    var Hyppy = parseFloat(frmKisa.nbrHyppyPisteet.value);
    if (Hyppy < 0) {
        return alert("Virhe hypyn pituudessa.");
    }
    else if (Hyppy > 260) {
        return alert("Virhe hypyn pituudessa.");
    }
    else {
        if (Hyppy < KPiste) {
            Hyppy = 0; //0 pistettä alle K-pisteen mittaisesta hypystä.
        }
        else if (Hyppy > KPiste) {
            Hyppy = Hyppy - KPiste; //Vähennetään K-pisteen matka.
            if (Mäkityyppi == "normaalimäki") {
                Hyppy = (Hyppy * 2) + 60;
            }
            else if (Mäkityyppi == "suurmäki") {
                Hyppy = (Hyppy * 1.8) + 60;
            }
            else { }
        }
        else { }
    }
    var Tuomari1 = parseFloat(frmKisa.nbrTuomari1.value);
    if (Tuomari1 < 4) {
        return alert("Virheellinen pistemäärä tuomarilta 1.");
    }
    else if (Tuomari1 > 20) {
        return alert("Virheellinen pistemäärä tuomarilta 1.");
    }
    else { }
    ;
    var Tuomari2 = parseFloat(frmKisa.nbrTuomari2.value);
    if (Tuomari2 < 4) {
        return alert("Virheellinen pistemäärä tuomarilta 2.");
    }
    else if (Tuomari2 > 20) {
        return alert("Virheellinen pistemäärä tuomarilta 2.");
    }
    else { }
    ;
    var Tuomari3 = parseFloat(frmKisa.nbrTuomari3.value);
    if (Tuomari3 < 4) {
        return alert("Virheellinen pistemäärä tuomarilta 3.");
    }
    else if (Tuomari3 > 20) {
        return alert("Virheellinen pistemäärä tuomarilta 3.");
    }
    else { }
    ;
    var Tuomari4 = parseFloat(frmKisa.nbrTuomari4.value);
    if (Tuomari4 < 4) {
        return alert("Virheellinen pistemäärä tuomarilta 4.");
    }
    else if (Tuomari4 > 20) {
        return alert("Virheellinen pistemäärä tuomarilta 4.");
    }
    else { }
    ;
    var Tuomari5 = parseFloat(frmKisa.nbrTuomari5.value);
    if (Tuomari5 < 4) {
        return alert("Virheellinen pistemäärä tuomarilta 5.");
    }
    else if (Tuomari5 > 20) {
        return alert("Virheellinen pistemäärä tuomarilta 5.");
    }
    else { }
    ;
    var TuomariPisteet = 0;
    var Yhteispisteet = 0;
    TuomariPisteet = Tuomari1 + Tuomari2 + Tuomari3 + Tuomari4 + Tuomari5;
    var max = Math.max(Tuomari1, Tuomari2, Tuomari3, Tuomari4, Tuomari5);
    //    console.log(max);   //Troubleshoot
    var min = Math.min(Tuomari1, Tuomari2, Tuomari3, Tuomari4, Tuomari5);
    //    console.log(min);   //Troubleshoot
    TuomariPisteet -= max;
    TuomariPisteet -= min;
    Yhteispisteet = Hyppy + TuomariPisteet;
    var _loop_1 = function (i) {
        //Funktio joukkueen pisteiden laskemiseen.
        function joukkuePisteet() {
            if (KilpailijoidenTiedot[i].joukkueessa == true) {
                var Joukkue = KilpailijoidenTiedot[i].joukkue;
                for (var i_1 = 0; i_1 < Joukkueet.length; ++i_1) {
                    if (Joukkue == Joukkueet[i_1].nimi) {
                        Joukkueet[i_1].pisteet += Yhteispisteet;
                    }
                }
            }
        }
        //Funktio joukkueiden pisteiden "tulostaulukon" päivittämiseen.
        function joukkueTulokset() {
            frmKisa.txaJoukkuePistetaulukko.value = '';
            for (var i_2 = 0; i_2 < Joukkueet.length; ++i_2) {
                frmKisa.txaJoukkuePistetaulukko.value += Joukkueet[i_2].nimi + ': ' + Joukkueet[i_2].pisteet + '\n';
            }
        }
        if (KilpailijoidenTiedot[i].name == Hyppääjä) {
            if (KilpailijoidenTiedot[i].kierroscount == 1) {
                KilpailijoidenTiedot[i].kierros1 = Yhteispisteet;
                joukkuePisteet();
                joukkueTulokset();
                //                console.log(Kisatulokset);    //Troubleshoot
            }
            else if (KilpailijoidenTiedot[i].kierroscount == 2) {
                KilpailijoidenTiedot[i].kierros2 = Yhteispisteet;
                KilpailijoidenTiedot[i].pisteetYhteensä = KilpailijoidenTiedot[i].kierros1 + KilpailijoidenTiedot[i].kierros2;
                joukkuePisteet();
                joukkueTulokset();
                var Tulos = new Tiedot();
                Tulos.name = Hyppääjä;
                Tulos.pisteetYhteensä = KilpailijoidenTiedot[i].pisteetYhteensä;
                Kisatulokset.push(Tulos);
                //                console.log("Kisatulokset:" + Kisatulokset[Kisatulokset.length - 1].name + Kisatulokset[Kisatulokset.length - 1].pisteetYhteensä);    //Troubleshoot
                Kisatulokset.sort(function (a, b) { return b.pisteetYhteensä - a.pisteetYhteensä; }); //Järjestää listan pisteiden mukaan. (suurin-pienin)
                frmKisa.txaTulostaulukko.value = '';
                for (var i_3 = 0; i_3 < Kisatulokset.length; ++i_3) {
                    frmKisa.txaTulostaulukko.value += Kisatulokset[i_3].name + ': ' + Kisatulokset[i_3].pisteetYhteensä + '\n';
                }
            }
            else {
                alert("kierroscount liian suuri?");
                return "break";
            }
            KilpailijoidenTiedot[i].kierroscount += 1;
            //            console.log(KilpailijoidenTiedot[i]); //Troubleshoot
        }
    };
    for (var i = 0; i < KilpailijoidenTiedot.length; ++i) {
        var state_1 = _loop_1(i);
        if (state_1 === "break")
            break;
    }
    frmKisa.txaPistetaulukko.value += Hyppääjä + ', ' + Yhteispisteet + '\n';
}
function transferKilpailu(frmKisa) {
    var Kisatyyppi = frmKisa.slcKisatyyppi.value;
    if (Kisatyyppi == "joukkuemäki") {
        Joukkueet.sort(function (a, b) { return b.pisteet - a.pisteet; }); //Järjestää listan pisteytyksen mukaan (suurin-pienin).
        for (var i = 0; i < Joukkueet.length; ++i) {
            if (i < 5) {
                var KilpailuPisteet = 20 - 4 * i; //Pisteytystä voi muuttaa. Nyt voittajat saavat 20, toiseksi tulleet 16, 12...
                var AnnetutPisteet = KilpailuPisteet;
                var JoukkueenNimi = Joukkueet[i].nimi;
                for (var i_4 = 0; i_4 < KilpailijoidenTiedot.length; ++i_4) {
                    if (KilpailijoidenTiedot[i_4].joukkue == JoukkueenNimi) {
                        var KisaajanMC = KilpailijoidenTiedot[i_4].mcpisteet;
                        var Uudetpisteet = Number(AnnetutPisteet) + Number(KisaajanMC);
                        KilpailijoidenTiedot[i_4].mcpisteet += Uudetpisteet;
                    }
                    else { }
                }
            }
            else { }
        }
        KilpailijoidenTiedot.sort(function (a, b) { return b.pisteetYhteensä - a.pisteetYhteensä; }); //Järjestää listan pisteiden mukaan. (suurin-pienin)
        for (var i = 0; i < KilpailijoidenTiedot.length; ++i) {
            frmKisa.txaMCTaulukko.value += KilpailijoidenTiedot[i].name + ': ' + KilpailijoidenTiedot[i].mcpisteet + '\n';
        }
    }
    else {
        KilpailijoidenTiedot.sort(function (a, b) { return b.pisteetYhteensä - a.pisteetYhteensä; }); //Järjestää listan pisteiden mukaan. (suurin-pienin)
        for (var i = 0; i < KilpailijoidenTiedot.length; ++i) {
            if (i < 20) {
                var KilpailuPisteet = 20 - i;
                var KisaajanMC = KilpailijoidenTiedot[i].mcpisteet;
                var Uudetpisteet = Number(KilpailuPisteet) + Number(KisaajanMC);
                KilpailijoidenTiedot[i].mcpisteet = Uudetpisteet;
            }
            else { }
            frmKisa.txaMCTaulukko.value += KilpailijoidenTiedot[i].name + ': ' + KilpailijoidenTiedot[i].mcpisteet + '\n';
        }
    }
    frmKisa.btnMCpisteet.disabled = true;
}
