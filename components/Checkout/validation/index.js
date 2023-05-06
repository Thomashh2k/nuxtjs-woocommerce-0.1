export const validationScheme = {
    firstName(value) {
        
        if (!value) return 'Vorname ist ein Pflichtfeld.'
        if (value?.length >= 2) return true

        return 'Vorname muss mindestens zwei Buchstaben enthalten.'
    },
    lastName(value) {
        
        if (!value) return 'Nachname ist ein Pflichtfeld.'
        if (value?.length >= 2) return true

        return 'Nachname muss mindestens zwei Buchstaben enthalten.'
    },
    email (value) {
        
        if (!value) return 'E-Mail ist ein Pflichtfeld.'
        if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

        return 'Es muss eine gültige E-Mail Addresse eingegeben werden.'
    },
    address (value) {
        
        if (!value) return 'Addresse ist ein Pflichtfeld.'
        if (value.length > 35) return 'Addresse darf nicht länger als 35 Zeichen sein.'
        if (value.length < 5) return 'Addresse darf nicht kleiner als fünf Zeichen sein.'

        return true
    },
    zipCode (value) {
        
        if (!value) return 'Postleitzahl ist ein Pflichtfeld'
        if (value.length > 5) return 'Postleitzahl kann nicht länger als fünf Zeichen sein'

        return true
    },
    country (value) {
        
        if (!value) return 'Land ist ein Pflichtfeld'
        if (value.length > 30) return 'Land darf nicht länger als 30 Zeichen sein.'
        if (value.length < 2) return 'Land darf nicht kleiner als fünf Zeichen sein.'

        return true
    },
    city (value) {
        
        if (!value) return 'Stadt ist ein Pflichtfeld'
        if (value.length > 30) return 'Stadt darf nicht länger als 30 Zeichen sein.'
        if (value.length < 3) return 'Stadt darf nicht kleiner als 3 Zeichen sein.'

        return true
    },
    phone (value) {
        
        if (value.length > 35) return 'Handynummer darf nicht länger als 15 Zeichen sein.'
        if (value.length < 5) return 'Handynummer darf nicht kleiner als 10 Zeichen sein.'

        return true
    },
  }