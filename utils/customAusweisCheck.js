export function checkNumber(id, checkNumber) {
    let p = 7;
    let sum = 0;
    
    for (let i = 0; i < id.length; i++) {
      let char = id.charAt(i);
      let int;
      
      if (char >= '0' && char <= '9') {
        int = parseInt(char);
      } else {
        int = char.charCodeAt(0) - 55;
      }
      
      sum += int * p;
      
      if (p === 1) {
        p = 7;
      } else if (p === 3) {
        p = 1;
      } else if (p === 7) {
        p = 3;
      }
    }
    
    let lastNumber = String(sum).slice(-1);
    
    return lastNumber === checkNumber;
}

export function persoType(id) {
    const splits = id.toUpperCase().split(" ");
    
    if (splits[0].length === 11 && splits[1].length === 7 && splits[2].length === 7 && splits[3].length === 1) {
      return 'old';
    } else if (splits[0].length === 10 && splits[1].length === 7 && splits[2].length === 8 && splits[3].length === 1) {
      return 'new';
    } else {
      return 'unknown';
    }
  }

export function persoChecksum(id) {
    const splits = id.toUpperCase().split(" ");

    const checksums = [];
    const type = persoType(id);

    if (type === 'unknown') {
        return false;
    }

    checksums.push([splits[0].substring(0, 9), splits[0].substring(9, 10)]);
    checksums.push([splits[1].substring(0, 6), splits[1].substring(6, 7)]);
    checksums.push([splits[2].substring(0, 6), splits[2].substring(6, 7)]);
    checksums.push([splits[0].substring(0, 10) + splits[1].substring(0, 7) + splits[2].substring(0, 7), splits[3]]);

    // Überprüfung der Checksummen
    for (let i = 0; i < checksums.length; i++) {
        if(i === 3) debugger
        const checksum = checksums[i];
        if (!checkNumber(checksum[0], checksum[1])) {
        return false;
        }
    }

    return true;
}

export function persoGueltig(id) {
    const splits = id.split(" ");
    
    const validUntil = new Date(`20${splits[2].substring(0, 2)}`, splits[2].substring(2, 4) - 1, splits[2].substring(4, 6));
    
    // Ist der Perso noch gültig
    if (Date.now() > validUntil.getTime()) {
      return false;
    }
    
    return true;
}

export function persoInfo(id) {
    const splits = id.split(" ");
  
    const returnObj = {
      perso_type: persoType(id),
      geb: {
        tag: id.charAt(4) + id.charAt(5), // Geburtstag
        monat: id.charAt(2) + id.charAt(3), // Geburtsmonat
        jahr: id.charAt(0) + id.charAt(1) // Geburtsjahr
      },
      ablauf: {
        tag: splits[2].charAt(4) + splits[2].charAt(5), // Ausweis Ablauf Tag
        monat: splits[2].charAt(2) + splits[2].charAt(3), // Ausweis Ablauf Monat
        jahr: "20" + splits[2].charAt(0) + splits[2].charAt(1) // Ausweis Ablauf Jahr
      }
    };
  
    if (returnObj.geb.jahr > new Date().getFullYear().toString().substr(-2)) {
      returnObj.geb.jahr = "19" + returnObj.geb.jahr;
    } else {
      returnObj.geb.jahr = "20" + returnObj.geb.jahr;
    }
  
    const today = new Date();
    const birthDate = new Date(returnObj.geb.jahr, returnObj.geb.monat - 1, returnObj.geb.tag);
    let alter = today.getFullYear() - birthDate.getFullYear();
  
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) {
      alter--;
    }
  
    returnObj.alter = alter;
    returnObj.volljaehrig = alter >= 18;
    returnObj.herkunft = returnObj.perso_type === "old" ? id.charAt(10) : splits[2].charAt(7);
    returnObj.deutscher = returnObj.herkunft.toLowerCase() === "d";
    returnObj.behoerdenkennzahl = id.substr(0, 4);
  
    return returnObj;
}

export function get_perso_data(persoInput) {
  debugger
  const perso_id = `${persoInput.ida} ${persoInput.idb} ${persoInput.idc} ${persoInput.idd}`;

  if (persoChecksum(perso_id)) {
    console.log("Personalausweisnummer korrekt!");

    if (!persoGueltig(perso_id)) {
      console.log("Perso ist abgelaufen!");
    }

    console.log("Daten der Ausweisnummer:");
    const data = persoInfo(perso_id);
    console.log(data);

    // Zugriff auf die Daten:
    // Alter: data.alter
    // Geburtsmonat: data.geb.monat
    // Ablauftag: data.ablauf.tag
  } else {
    console.log("Personalausweisnummer falsch!");
  }
}