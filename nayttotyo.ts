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

class Tiedot{
    name : Text;    //nimi.
    mcpisteet : number; //maailmancup-pisteet.
    maa : Text; //maa.
    joukkue : Text; //mahdollinen joukkue.
    joukkueessa : boolean;  //joukkueen pistelaskua varten.
    kierros1 : number;  //kierroksen 1 tulos.
    kierros2 : number;  //kierroksen 2 tulos.
    kierroscount : number = 1;  //monesko kierros.
    pisteetYhteensä : number;   //kierrosten 1 ja 2 yhteispisteet.
}

class JoukkueTiedot{
    nimi : Text;
    pisteet : number = 0;
}

let OsanottajaLaskuri : number = 1;
let Joukkueet : Array<JoukkueTiedot> = []; //Joukkueille.
let KilpailijoidenTiedot : Array<Tiedot> = [];  //Kilpailijoille.
let KilpailijoidenNimet : Array<String> = []; //Hyppääjien tarkistamiseksi.
let Kisatulokset : Array<Tiedot> = [];  //Tuloksille.

function transferKisatiedot(frmKisa:any) : void{
    let Kisa = frmKisa.txtKisa.value;
    if (Kisa == ''){
        return alert("Syötä Kisan nimi.");
    }
    let Kisatyyppi = frmKisa.slcKisatyyppi.value;
    let Mäki = frmKisa.slcMäkityyppi.value;
    let KPiste = frmKisa.nbrKPiste.value;
    if (KPiste < 60){   //K-pisteen tarkistus.
        return alert("Virheellinen K-pisteen arvo.");
    }
    else if (KPiste > 180){
        return alert("Virheellinen K-pisteen arvo.");
    }
    else{}

    frmKisa.txaKisaVastaus.value = Kisa + ', ' + Kisatyyppi + ', ' + Mäki + ', ' + KPiste;

    if (Kisatyyppi == "yksilömäki"){        //Tekee Joukkue-osion saatavaksi käyttäjälle, jos kisatyyppi on joukkuemäki.
        frmKisa.flsJoukkue.disabled = true;
    }
    else if (Kisatyyppi == "yhdistetty"){
        frmKisa.flsJoukkue.disabled = true;
    }
    else if (Kisatyyppi == "joukkuemäki"){
        frmKisa.flsJoukkue.disabled = false;
    }
    frmKisa.flsKisaaja.disabled = false;    //Kisaaja-osio saatavaksi käyttäjälle.
    frmKisa.flsHyppy.disabled = false;      //Hyppy-osio saatavaksi käyttäjälle.
}

function transferJoukkue(frmKisa:any) : void{
    let JoukkueenNimi = frmKisa.txtJoukkueNimi.value;
    let Joukkue = new JoukkueTiedot;
    Joukkue.nimi = JoukkueenNimi;
    Joukkueet.push(Joukkue);
    console.log(Joukkueet);

    let JoukkueInfo = document.createElement("input");  //Näyttää luodut joukkueet Joukkue-osion lopussa.
    JoukkueInfo.setAttribute("type", "input");           //Luo jokaiselle joukkueelle oman input-kentän.
    JoukkueInfo.setAttribute("value", JoukkueenNimi);
    JoukkueInfo.setAttribute("class", "answersheet");
    JoukkueInfo.setAttribute("id", "txt" + JoukkueenNimi);
    JoukkueInfo.setAttribute("readonly", "true");
    document.getElementById("flsJoukkue").appendChild(JoukkueInfo);
    //    console.log(JoukkueInfo);   //Troubleshoot

    //KORJAA TYYLIVIRHEET MYÖHEMMIN

//    console.log(Joukkueet); //Troubleshoot
    frmKisa.slcJoukkue.add(document.createElement("option"), frmKisa.slcJoukkue[1]);    //Lisää dropdown-listaan vaihtoehdon joukkueelle paikkaan 1.
    frmKisa.slcJoukkue[1].text = JoukkueenNimi; //Muuttaa lisätyn vaihtoehdo nimen joukkueen nimeksi.
}

function transferKisaajanTiedot(frmKisa:any) : void{
    let Kisaaja = new Tiedot();

    Kisaaja.name = frmKisa.txtKilpailija.value;
    Kisaaja.mcpisteet = frmKisa.nbrMC.value
    Kisaaja.maa = frmKisa.slcMaa.value;
    Kisaaja.joukkue = frmKisa.slcJoukkue.value;
    if (frmKisa.slcJoukkue.selected == "Ei"){
        Kisaaja.joukkueessa = false;
    }
    else{
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

function transferHyppy(frmKisa:any) : void{
    let Hyppääjä = frmKisa.txtHyppääjä.value;
    let KPiste = frmKisa.nbrKPiste.value;
    if (KPiste < 60){
        return alert("K-pistettä ei ole määritetty oikein!")
    }
    else if (KPiste > 180){
        return alert("K-pistettä ei ole määritetty oikein!")
    }
    else{}
    let Mäkityyppi = frmKisa.slcMäkityyppi.value;
    let Hyppy = parseFloat(frmKisa.nbrHyppyPisteet.value);
    if (Hyppy < 0){ //Tarkistaa hypyn pituuden välille 0-260.
        return alert("Virhe hypyn pituudessa.");
    }
    else if (Hyppy > 260){
        return alert("Virhe hypyn pituudessa.");
    }
    else{
        if (Hyppy < KPiste){
            Hyppy = 0;  //0 pistettä alle K-pisteen mittaisesta hypystä.
        }
        else if (Hyppy > KPiste){
            Hyppy = Hyppy-KPiste;   //Vähennetään K-pisteen matka.
            if (Mäkityyppi == "normaalimäki"){  //Lisätään pistekertoimet ja K-pisteestä pisteet.
                Hyppy = (Hyppy * 2) + 60;
            }
            else if (Mäkityyppi == "suurmäki"){
                Hyppy = (Hyppy * 1.8) + 60;
            }
            else{}
        }
        else{}
    }
    let Tuomari1 = parseFloat(frmKisa.nbrTuomari1.value);
    if (Tuomari1 < 4){  //Tarkistaa tuomarin pisteet välille 4-20.
        return alert("Virheellinen pistemäärä tuomarilta 1.");
    }
    else if (Tuomari1 > 20){
        return alert("Virheellinen pistemäärä tuomarilta 1.");
    }
    else{};
    let Tuomari2 = parseFloat(frmKisa.nbrTuomari2.value);
    if (Tuomari2 < 4){  //Tarkistaa tuomarin pisteet välille 4-20.
        return alert("Virheellinen pistemäärä tuomarilta 2.");
    }
    else if (Tuomari2 > 20){
        return alert("Virheellinen pistemäärä tuomarilta 2.");
    }
    else{};
    let Tuomari3 = parseFloat(frmKisa.nbrTuomari3.value);
    if (Tuomari3 < 4){  //Tarkistaa tuomarin pisteet välille 4-20.
        return alert("Virheellinen pistemäärä tuomarilta 3.");
    }
    else if (Tuomari3 > 20){
        return alert("Virheellinen pistemäärä tuomarilta 3.");
    }
    else{};
    let Tuomari4 = parseFloat(frmKisa.nbrTuomari4.value);
    if (Tuomari4 < 4){  //Tarkistaa tuomarin pisteet välille 4-20.
        return alert("Virheellinen pistemäärä tuomarilta 4.");
    }
    else if (Tuomari4 > 20){
        return alert("Virheellinen pistemäärä tuomarilta 4.");
    }
    else{};
    let Tuomari5 = parseFloat(frmKisa.nbrTuomari5.value);
    if (Tuomari5 < 4){  //Tarkistaa tuomarin pisteet välille 4-20.
        return alert("Virheellinen pistemäärä tuomarilta 5.");
    }
    else if (Tuomari5 > 20){
        return alert("Virheellinen pistemäärä tuomarilta 5.");
    }
    else{};

    let TuomariPisteet : number = 0;
    let Yhteispisteet : number = 0;

    TuomariPisteet = Tuomari1 + Tuomari2 + Tuomari3 + Tuomari4 + Tuomari5;
    let max = Math.max(Tuomari1, Tuomari2, Tuomari3, Tuomari4, Tuomari5);
//    console.log(max);   //Troubleshoot
    let min = Math.min(Tuomari1, Tuomari2, Tuomari3, Tuomari4, Tuomari5);
//    console.log(min);   //Troubleshoot
    TuomariPisteet -= max;
    TuomariPisteet -= min;
    Yhteispisteet = Hyppy + TuomariPisteet;

    for (let i = 0; i < KilpailijoidenTiedot.length; ++i){  //Etsii kilpailijan nimen perusteella.

        //Funktio joukkueen pisteiden laskemiseen.
        function joukkuePisteet() : void {
            if (KilpailijoidenTiedot[i].joukkueessa == true){
               let  Joukkue = KilpailijoidenTiedot[i].joukkue;
                for (let i = 0; i < Joukkueet.length; ++i){
                    if (Joukkue == Joukkueet[i].nimi){
                        Joukkueet[i].pisteet += Yhteispisteet;
                    }
                }
            }
        }

        //Funktio joukkueiden pisteiden "tulostaulukon" päivittämiseen.
        function joukkueTulokset() : void {
            frmKisa.txaJoukkuePistetaulukko.value = '';
            for (let i = 0; i < Joukkueet.length; ++i){
                frmKisa.txaJoukkuePistetaulukko.value += Joukkueet[i].nimi + ': ' + Joukkueet[i].pisteet + '\n';
            }
        }

        if (KilpailijoidenTiedot[i].name == Hyppääjä){
            if (KilpailijoidenTiedot[i].kierroscount == 1){ //Ensimmäinen kierros
                KilpailijoidenTiedot[i].kierros1 = Yhteispisteet;
                joukkuePisteet();
                joukkueTulokset();
//                console.log(Kisatulokset);    //Troubleshoot
            }
            else if (KilpailijoidenTiedot[i].kierroscount == 2){    //Toinen kierros
                KilpailijoidenTiedot[i].kierros2 = Yhteispisteet;
                KilpailijoidenTiedot[i].pisteetYhteensä = KilpailijoidenTiedot[i].kierros1 + KilpailijoidenTiedot[i].kierros2;
                joukkuePisteet();
                joukkueTulokset();

                let Tulos = new Tiedot();
                Tulos.name = Hyppääjä;
                Tulos.pisteetYhteensä = KilpailijoidenTiedot[i].pisteetYhteensä;
                Kisatulokset.push(Tulos);
                    
//                console.log("Kisatulokset:" + Kisatulokset[Kisatulokset.length - 1].name + Kisatulokset[Kisatulokset.length - 1].pisteetYhteensä);    //Troubleshoot

                Kisatulokset.sort(function(a, b){return b.pisteetYhteensä-a.pisteetYhteensä});  //Järjestää listan pisteiden mukaan. (suurin-pienin)
                frmKisa.txaTulostaulukko.value = '';
                for (let i = 0; i < Kisatulokset.length; ++i){
                    frmKisa.txaTulostaulukko.value += Kisatulokset[i].name + ': ' + Kisatulokset[i].pisteetYhteensä + '\n';
                }
            }
            else{
                alert("kierroscount liian suuri?");
                break;
            }
            KilpailijoidenTiedot[i].kierroscount += 1;
//            console.log(KilpailijoidenTiedot[i]); //Troubleshoot
        }
    }
    frmKisa.txaPistetaulukko.value += Hyppääjä + ', ' + Yhteispisteet + '\n';
}

function transferKilpailu(frmKisa:any) : void{

    let Kisatyyppi = frmKisa.slcKisatyyppi.value;

    if (Kisatyyppi == "joukkuemäki"){
        Joukkueet.sort(function(a,b){return b.pisteet - a.pisteet});    //Järjestää listan pisteytyksen mukaan (suurin-pienin).

        for (let i = 0; i < Joukkueet.length; ++i){
            if (i < 5){ //Oletuksena, että joukkueessa on AINA neljä hyppääjää.
                let KilpailuPisteet : number = 20 - 4*i;    //Pisteytystä voi muuttaa. Nyt voittajat saavat 20, toiseksi tulleet 16, 12...
                let AnnetutPisteet : number = KilpailuPisteet;
                let JoukkueenNimi : Text = Joukkueet[i].nimi;
                for (let i = 0; i < KilpailijoidenTiedot.length; ++i){
                    if (KilpailijoidenTiedot[i].joukkue == JoukkueenNimi){
                        let KisaajanMC : Number = KilpailijoidenTiedot[i].mcpisteet;
                        let Uudetpisteet : number = Number(AnnetutPisteet) + Number(KisaajanMC);
                        KilpailijoidenTiedot[i].mcpisteet += Uudetpisteet;
                    }
                    else{}
                }
            }
            else{}
        }
        KilpailijoidenTiedot.sort(function(a, b){return b.pisteetYhteensä-a.pisteetYhteensä});  //Järjestää listan pisteiden mukaan. (suurin-pienin)

        for (let i = 0; i < KilpailijoidenTiedot.length; ++i){
            frmKisa.txaMCTaulukko.value += KilpailijoidenTiedot[i].name + ': ' + KilpailijoidenTiedot[i].mcpisteet + '\n';
        }
    }

    else{
        KilpailijoidenTiedot.sort(function(a, b){return b.pisteetYhteensä-a.pisteetYhteensä});  //Järjestää listan pisteiden mukaan. (suurin-pienin)
    
        for (let i = 0; i < KilpailijoidenTiedot.length; ++i){
            if (i < 20){
                let KilpailuPisteet : number = 20 - i;
                let KisaajanMC : number = KilpailijoidenTiedot[i].mcpisteet;
                let Uudetpisteet : number = Number(KilpailuPisteet) + Number(KisaajanMC);
                KilpailijoidenTiedot[i].mcpisteet = Uudetpisteet;
            }
            else{}

            frmKisa.txaMCTaulukko.value += KilpailijoidenTiedot[i].name + ': ' + KilpailijoidenTiedot[i].mcpisteet + '\n';
        }

    }

    frmKisa.btnMCpisteet.disabled = true;
}
