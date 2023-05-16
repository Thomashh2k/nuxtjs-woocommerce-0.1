<template>
    <div>
       <v-card class="tw-text-black tw-mt-6 lg:tw-mr-4 hover:shadow-2xl account-card-bg tw-h-100">
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
                                        v-model="address.value.value"
                                        variant="solo"
                                        density="compact"
                                        class="tw-mr-1 tw-mb-2"
                                        label="Adresse"
                                        bg-color="rgb(26, 6, 58)"
                                        color="rgb(250, 245, 255)"
                                    />
                                    <v-text-field 
                                        v-model="addressNr.value.value"
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
                                        v-model="zipCode.value.value"
                                        variant="solo"
                                        density="compact"
                                        class="tw-mr-1 tw-mb-2"
                                        label="Postleitzahl"
                                        bg-color="rgb(26, 6, 58)"
                                        color="rgb(250, 245, 255)"
                                    />
                                    <v-text-field 
                                        v-model="country.value.value"
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
            <v-card-actions>
                <v-row>
                    <v-col cols="12" md="6">
                        <div class="tw-flex tw-justify-center tw-pb-4">
                            <v-btn color="success" @click="submit" type="submit" variant="outlined">
                                <p class="tw-normal-case">Registrieren</p>
                            </v-btn>
                        </div>
                    </v-col>
                    <v-col cols="12" md="6">
                    </v-col>
                </v-row>
            </v-card-actions>
       </v-card>
    </div>
</template>
<script>
import { useField, useForm } from 'vee-validate'
import { registerCustomer } from "@/utils/auth"


export default{
    name: 'register',
    setup() {
        const { handleSubmit, handleReset } = useForm({
            validationSchema: {
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
                    if (!value) return 'E-Mail ist ein Pflichtfeld'
                    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

                    return 'Es muss eine gültige E-Mail Addresse eingegeben werden.'
                },
                password (value) {
                    if (!value) return 'Passwort ist ein Pflichtfeld'
                    // BUG....
                    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true
                    else return true

                    return 'Passwort muss groß und klein buchstaben, Zahlen und Sonderzeichen enthalten.'
                },
            }
        })

        const firstName = useField('firstName')
        const lastName = useField('lastName')
        const email = useField('email')
        const password = useField('password')

        const address = useField('address')
        const addressNr = useField('addressNr')
        const zipCode = useField('zipCode')
        const country = useField('country')

        const submit = handleSubmit(values => {
            const router = useRouter();

            registerCustomer(values, router);
        })
        return { firstName, lastName, email, password, address, addressNr, zipCode, country, submit }
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
.account-card-bg {
  background: rgb(50, 17, 102);
}
</style>