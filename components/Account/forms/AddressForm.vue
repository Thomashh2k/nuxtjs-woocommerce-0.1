<template>
    <v-row>
        <v-col class="max-[960px]:tw-hidden"></v-col>
        <v-col cols="12" md="8" class="md:tw-p-8">
            <v-form
                ref="addressForm"
                @submit="submit"
                class="lg:tw-p-2"
            >
                <div class="tw-flex tw-flex-row">
                    <v-text-field
                        v-model="firstName.value.value"
                        :error-messages="firstName.errorMessage.value"
                        label="Vorname"
                        class="tw-w-6/12 tw-mr-1"
                        variant="solo"
                        density="compact"
                        bg-color="rgb(26, 6, 58)"
                        color="rgb(250, 245, 255)"
                        @change="firstName.value.value = firstName.value.value.charAt(0).toUpperCase() + firstName.value.value.slice(1)"
                    />
                    <v-text-field
                        v-model="lastName.value.value"
                        :error-messages="lastName.errorMessage.value"
                        label="Nachname"
                        class="tw-w-6/12 tw-ml-1"
                        variant="solo"
                        density="compact"
                        bg-color="rgb(26, 6, 58)"
                        color="rgb(250, 245, 255)"
                        @change="lastName.value.value = lastName.value.value.charAt(0).toUpperCase() + lastName.value.value.slice(1)"
                    />
                </div>
                <div class="tw-flex tw-flex-row">
                    <v-text-field
                        v-model="address1.value.value"
                        :error-messages="address1.errorMessage.value"
                        label="Straße"
                        class="tw-w-10/12 tw-mr-1"
                        variant="solo"
                        density="compact"
                        bg-color="rgb(26, 6, 58)"
                        color="rgb(250, 245, 255)"
                        @change="address1.value.value = address1.value.value.charAt(0).toUpperCase() + address1.value.value.slice(1)"
                    />
                    <v-text-field
                        v-model="address2.value.value"
                        :error-messages="address2.errorMessage.value"
                        label="Hausnummer"
                        class="tw-w-2/12 tw-ml-1"
                        variant="solo"
                        density="compact"
                        bg-color="rgb(26, 6, 58)"
                        color="rgb(250, 245, 255)"
                    />
                </div>
                <div class="tw-flex tw-flex-row">
                    <v-text-field
                        v-model="postcode.value.value"
                        :error-messages="postcode.errorMessage.value"
                        label="Postleitzahl"
                        class="tw-w-2/12 tw-mr-1"
                        variant="solo"
                        density="compact"
                        bg-color="rgb(26, 6, 58)"
                        color="rgb(250, 245, 255)"
                    />
                    <v-text-field
                        v-model="city.value.value"
                        :error-messages="city.errorMessage.value"
                        label="Stadt"
                        class="tw-w-10/12 tw-ml-1"
                        variant="solo"
                        density="compact"
                        bg-color="rgb(26, 6, 58)"
                        color="rgb(250, 245, 255)"
                        @change="city.value.value = city.value.value.charAt(0).toUpperCase() + city.value.value.slice(1)"
                    />
                </div>
                <v-select
                    v-model="country.value.value"
                    :error-messages="country.errorMessage.value"
                    :items="countryItems"
                    label="Land"
                    variant="solo"
                    density="compact"
                    bg-color="rgb(26, 6, 58)"
                    color="rgb(250, 245, 255)"
                />
            <div class="tw-flex tw-justify-center">
                <v-btn
                    variant="outlined"
                    color="success"
                    rounded="xl"
                    type="submit"
                    @click="submit"
                >
                    <div class="tw-normal-case">Aktualisieren</div>
                </v-btn>
            </div>
        </v-form>
        </v-col>
        <v-col class="max-[960px]:tw-hidden"></v-col>
    </v-row>
</template>
<script>
import { useField, useForm } from 'vee-validate';

export default {
    name: 'AddressForm',
    emits: ['save'],
    props: {
        addressInfo: {
            type: Object,
            required: true
        },
        showSaveBtn: {
            type: Boolean,
            default: false
        }
    },
    setup(props, context) {
        const { handleSubmit } = useForm({
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
                address1(value) {
                    if (!value) return 'Addresse ist ein Pflichtfeld.'
                    if (value?.length >= 2) return true

                    return 'Addresse muss mindestens zwei Buchstaben enthalten.'
                },
                address2(value) {
                    if (!value) return 'Hausnummer ist ein Pflichtfeld.'
                    if (value?.length >= 2) return true

                    return 'Hausnummer muss mindestens zwei Buchstaben enthalten.'
                },
                postcode(value) {
                    if (!value) return 'Postleitzahl ist ein Pflichtfeld.'
                    if (value?.length >= 2) return true

                    return 'Postleitzahl muss mindestens zwei Buchstaben enthalten.'
                },
                city(value) {
                    if (!value) return 'Stadt ist ein Pflichtfeld.'
                    if (value?.length >= 2) return true

                    return 'Stadt muss mindestens zwei Buchstaben enthalten.'
                },
                // country(value) {
                //     debugger
                //     if (!value) return 'Stadt ist ein Pflichtfeld.'
                //     if (value?.length >= 2) return true

                //     return 'Stadt muss mindestens zwei Buchstaben enthalten.'
                // },

            }
        })

        const firstName = useField('firstName')
        const lastName = useField('lastName')

        const address1 = useField('address1')
        const address2 = useField('address2')
        const postcode = useField('postcode')
        const city = useField('city')
        const country = useField('country')
        debugger
        firstName.value.value = props.addressInfo.firstName
        lastName.value.value = props.addressInfo.lastName

        address1.value.value = props.addressInfo.address1
        address2.value.value = props.addressInfo.address2
        postcode.value.value = props.addressInfo.postcode
        city.value.value = props.addressInfo.city
        country.value = props.addressInfo.country

        const submit = handleSubmit(values => {
            debugger
            context.emit('save', values)
        })
        return { firstName, lastName, address1, address2, postcode, city, country, submit }
    },
    data() {
        return {
            countryItems: [
                { title: 'Deutschland', value: 'DE' },
                { title: 'Österreich', value: 'AT' },
                { title: 'Schweiz', value: 'CH' }
            ]
        }
    }
}
</script>