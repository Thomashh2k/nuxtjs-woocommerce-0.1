<template>
    <div>
       <v-card class="card-bg-color tw-text-black tw-mt-6  lg:tw-mr-4 hover:shadow-2xl card-bg-color">
            <v-card-title>
                <h2 class="tw-text-purple-50">Registrieren</h2>
            </v-card-title>
            <v-card-text>
                <v-form 
                    @submit.prevent="submit"
                    class="lg:tw-p-2"
                >
                    <v-row>
                        <v-col cols="12" md="6">
                            <div class="lg:tw-p-2">
                                <div class="tw-flex tw-flex-row">
                                <v-text-field 
                                    v-model="firstName.value.value"
                                    variant="solo"
                                    density="compact"
                                    :error-messages="firstName.errorMessage.value"
                                    label="Vorname"
                                    class="tw-mr-1 tw-mb-2 tw-w-1/2"
                                    bg-color="rgb(26, 6, 58)"
                                    color="rgb(250, 245, 255)"
                                />
                                <v-text-field
                                    v-model="lastName.value.value"
                                    density="compact"
                                    label="Nachname"
                                    class="tw-ml-1 tw-mb-2 tw-w-1/2"
                                    :error-messages="lastName.errorMessage.value"
                                    bg-color="rgb(26, 6, 58)"
                                    color="rgb(250, 245, 255)"
                                    variant="solo"
                                />
                                </div>
                                <v-text-field 
                                    v-model="email.value.value"
                                    variant="solo"
                                    density="compact"
                                    class="tw-mb-2"
                                    :error-messages="email.errorMessage.value"
                                    label="E-Mail"
                                    bg-color="rgb(26, 6, 58)"
                                    color="rgb(250, 245, 255)"
                                />
                                <v-text-field 
                                    v-model="username.value.value"
                                    variant="solo"
                                    density="compact"
                                    :error-messages="username.errorMessage.value"
                                    class="tw-mb-2"
                                    label="Benutzername"
                                    bg-color="rgb(26, 6, 58)"
                                    color="rgb(250, 245, 255)"
                                />
                                <v-text-field
                                    v-model="password.value.value"
                                    type="password"
                                    density="compact"
                                    :error-messages="password.errorMessage.value"
                                    class="tw-mb-2"
                                    label="Passwort"
                                    bg-color="rgb(26, 6, 58)"
                                    color="rgb(250, 245, 255)"
                                    variant="solo"
                                />

                            </div>
                        </v-col>
                        <v-col cols="12" md="6">
                                <div class="tw-flex tw-flex-row">
                                    <v-text-field 
                                        v-model="registerPL.shipping.address"
                                        variant="solo"
                                        density="compact"
                                        class="tw-mr-1 tw-mb-2"
                                        label="Adresse"
                                        bg-color="rgb(26, 6, 58)"
                                        color="rgb(250, 245, 255)"
                                    />
                                    <v-text-field 
                                        v-model="registerPL.shipping.addressNr"
                                        variant="solo"
                                        density="compact"
                                        class="tw-ml-1 tw-mb-2"
                                        label="Hausnummer"
                                        bg-color="rgb(26, 6, 58)"
                                        color="rgb(250, 245, 255)"
                                    />
                                </div>
                                <div class="tw-flex tw-flex-row">
                                    <v-text-field 
                                        v-model="registerPL.shipping.zipCode"
                                        variant="solo"
                                        density="compact"
                                        class="tw-mr-1 tw-mb-2"
                                        label="Postleitzahl"
                                        bg-color="rgb(26, 6, 58)"
                                        color="rgb(250, 245, 255)"
                                    />
                                    <v-text-field 
                                        v-model="registerPL.shipping.country"
                                        variant="solo"
                                        density="compact"
                                        class="tw-ml-1 tw-mb-2"
                                        label="Land"
                                        bg-color="rgb(26, 6, 58)"
                                        color="rgb(250, 245, 255)"
                                    />
                                </div>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-action>
                <v-btn color="success" @click="submit" type="submit">Registrieren</v-btn>
            </v-card-action>
       </v-card>
    </div>
</template>
<script>
  import { useField, useForm } from 'vee-validate'

export default{
    name: 'register',
    setup() {
        debugger
        const { handleSubmit, handleReset } = useForm({
            validationSchema: {
                firstName(value) {
                    if (!value) return 'Vorname ist ein Pflichtfeld'
                    if (value?.length >= 2) return true

                    return 'Vorname muss mindestens zwei Buchstaben enthalten.'
                },
                lastName(value) {
                    if (!value) return 'Nachname ist ein Pflichtfeld'
                    if (value?.length >= 2) return true

                    return 'Nachname muss mindestens zwei Buchstaben enthalten.'
                },
                email (value) {
                    if (!value) return 'E-Mail ist ein Pflichtfeld'
                    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

                    return 'Es muss eine gültige E-Mail Addresse eingegeben werdem.'
                },
                username (value) {
                    debugger
                    if (!value) return 'Benutzername ist ein Pflichtfeld'
                    if (value.length >= 5) return true

                    return 'Must be a valid e-mail.'
                },
                password (value) {
                    if (!value) return 'Passwort ist ein Pflichtfeld'
                    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

                    return 'Passwort muss groß und klein buchstaben, Zahlen und Sonderzeichen enthalten'
                },
            }
        })

        const firstName = useField('firstName')
        const lastName = useField('lastName')
        const email = useField('email')
        const username = useField('username')
        const password = useField('password')

        const submit = handleSubmit(values => {
            console.log(values)
            console.log('registered...')
        })
        return { firstName, lastName, email, username, password, submit }
    },
    data() {
        return {
            registerPL: {
                shipping: {
                    address: '',
                    addressNr: '',
                    zipCode: '',
                    country: ''
                }
            },
        }
    },
    methods: {
        // async submit() {

        // }
    }
}
</script>
<style scoped>
.card-height {
  height: 28rem;
}
.card-bg-color {
  /* background: rgb(26, 6, 58) !important; */
  background-color: rgb(76 29 149 / var(--tw-bg-opacity));
}
</style>