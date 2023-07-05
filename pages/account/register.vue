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
                                    v-model="emailRepeat.value.value"
                                    variant="solo"
                                    density="compact"
                                    class="tw-mb-2"
                                    :error-messages="emailRepeat.errorMessage.value"
                                    label="E-Mail wiederholen"
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
                                <v-text-field
                                    v-model="passwordRepeat.value.value"
                                    type="password"
                                    density="compact"
                                    :error-messages="passwordRepeat.errorMessage.value"
                                    class="tw-mb-2"
                                    label="Passwort wiederholen"
                                    bg-color="rgb(26, 6, 58)"
                                    color="rgb(250, 245, 255)"
                                    variant="solo"
                                />
                                <v-divider/>
                                <v-switch
                                    v-model="agreedToAGB.value.value"
                                    :error-messages="agreedToAGB.errorMessage.value"
                                    inset
                                    class="tw-text-purple-50"
                                    color="primary"
                                    label="Ich stimme der AGB zu."
                                ></v-switch>
                                <v-switch
                                    v-model="agreedToCookies"
                                    inset
                                    color="primary"
                                    class="tw-text-purple-50"
                                    label="Ich bin einvertsanden von der nutztung funktionaler Cookies."
                                ></v-switch>
                                <v-switch
                                    v-model="agreedToNewsletter"
                                    inset
                                    class="tw-text-purple-50"
                                    color="primary"
                                    label="Ich bin einverstanden das ich von meiner angegbenen E-Mail Werbung zu erhalten"
                                ></v-switch>
                            </div>
                        </v-col>
                        <v-col cols="12" md="6">
                            <!-- <h2  class="tw-text-xl tw-text-purple-50 tw-text-center">Lieferanschrift</h2> -->
                            <AddressForm :address-info="{}" :show-cols="false" :show-save-btn="false" />
                            <div class="tw-flex tw-justify-center">
                                <v-switch
                                    v-model="useDifferentBilllingAddress"
                                    label="Abweichende Rechnungsadresse"
                                    inset
                                    color="primary"
                                    class="tw-text-purple-50 tw-ml-2"
                                />
                            </div>
                            <!-- <h2  class="tw-text-xl tw-text-purple-50 tw-text-center">Lieferanschrift</h2> -->
                            <AddressForm v-if="useDifferentBilllingAddress" :address-info="{}" :show-cols="false" :show-save-btn="false" />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-row>
                    <v-col>
                        <div class="tw-flex tw-justify-center tw-pb-4">
                            <v-btn color="success" @click="submit" type="submit" variant="outlined">
                                <p class="tw-normal-case">Registrieren</p>
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-card-actions>
       </v-card>
    </div>
</template>
<script>
import { useField, useForm } from 'vee-validate'
import AddressForm from '~/components/Account/forms/AddressForm.vue'
import { registerCustomer } from "@/utils/auth"


export default{
    name: 'register',
    components: {
        AddressForm
    },
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
                    if(emailRepeat.value.value !== value) return 'E-Mail Addressen stimmen nicht überein.'

                    return 'Es muss eine gültige E-Mail Addresse eingegeben werden.'
                },
                emailRepeat (value) {
                    if (!value) return 'E-Mail wiederholen ist ein Pflichtfeld'
                    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true
                    if(email.value.value !== value) return 'E-Mail Addressen stimmen nicht überein.'

                    return 'Es muss eine gültige E-Mail Addresse eingegeben werden.'
                },
                password (value) {
                    if (!value) return 'Passwort ist ein Pflichtfeld'
                    // BUG....
                    if(passwordRepeat.value.value !== value) return 'Passwörter stimmen nicht überein.'
                    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true
                    else return true

                    return 'Passwort muss groß und klein buchstaben, Zahlen und Sonderzeichen enthalten.'
                },
                passwordRepeat (value) {
                    if (!value) return 'Passwort wiederholen ist ein Pflichtfeld'
                    // BUG....
                    if(password.value.value !== value) return 'Passwörter stimmen nicht überein.'
                    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true
                    else return true

                    return 'Passwort wiederholen muss groß und klein buchstaben, Zahlen und Sonderzeichen enthalten.'
                },
                agreedToAGB (value) {
                    if (!value) return 'Sie müssen den AGB zustimmen.'
                    return true
                }
            }
        })

        const firstName = useField('firstName')
        const lastName = useField('lastName')
        const email = useField('email')
        const emailRepeat = useField('emailRepeat')
        const password = useField('password')
        const passwordRepeat = useField('passwordRepeat')

        const agreedToAGB = useField('agreedToAGB')

        const useDifferentBilllingAddress = ref(false)
        const agreedToCookies = ref(false)
        const agreedToNewsletter = ref(false)

        const submit = handleSubmit(values => {
            const router = useRouter();

            registerCustomer(values, router);
        })
        return { 
            useDifferentBilllingAddress,
            firstName,
            lastName,
            email,
            password,
            emailRepeat,
            passwordRepeat,
            agreedToAGB,
            agreedToCookies,
            agreedToNewsletter,
            submit
        }
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