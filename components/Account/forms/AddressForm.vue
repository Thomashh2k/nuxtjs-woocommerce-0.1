<template>
    <v-form
        ref="addressForm"
        @submit="submit"
    >
        <slot name="before-form"></slot>
            <div class="tw-flex tw-flex-row">
                <v-text-field
                    v-model="firstName.value.value"
                    :error-messages="firstName.errorMessage.value"
                    label="Vorname"
                    :disabled="disabled"
                    class="tw-w-6/12 tw-mr-1 tw-mb-2"
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
                    :disabled="disabled"
                    class="tw-w-6/12 tw-ml-1 tw-mb-2"
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
                    :disabled="disabled"
                    class="tw-w-8/12 tw-mr-1 tw-mb-2"
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
                    :disabled="disabled"
                    class="tw-w-4/12 tw-ml-1 tw-mb-2"
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
                    :disabled="disabled"
                    class="tw-w-4/12 tw-mr-1 tw-mb-2"
                    variant="solo"
                    density="compact"
                    bg-color="rgb(26, 6, 58)"
                    color="rgb(250, 245, 255)"
                />
                <v-text-field
                    v-model="city.value.value"
                    :error-messages="city.errorMessage.value"
                    label="Stadt"
                    :disabled="disabled"
                    class="tw-w-8/12 tw-ml-1 tw-mb-2"
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
                :disabled="disabled"
                variant="solo"
                density="compact"
                bg-color="rgb(26, 6, 58)"
                color="rgb(250, 245, 255)"
            />
        <slot name="after-form"></slot>
        <div v-if="showSaveBtn" class="tw-flex tw-justify-center">
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
</template>
<script>
import { useAuth } from '@/store/useAuth.js'
import { useField, useForm } from 'vee-validate';

export default {
    name: 'AddressForm',
    emits: ['save'],
    props: {
        addressInfo: {
            type: Object,
            required: true
        },
        showCols: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        showSaveBtn: {
            type: Boolean,
            default: true
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
                    if (!value) return 'Straße ist ein Pflichtfeld.'
                    if (value?.length >= 2) return true

                    return 'Straße muss mindestens zwei Buchstaben enthalten.'
                },
                address2(value) {
                    if (!value) return 'Hausnr. ist ein Pflichtfeld.'
                    if (value?.length >= 1) return true

                    return 'Hausnr. muss mindestens zwei Buchstaben enthalten.'
                },
                postcode(value) {
                    if (!value) return 'PLZ ist ein Pflichtfeld.'
                    if (value?.length >= 2) return true

                    return 'PLZ muss mindestens zwei Buchstaben enthalten.'
                },
                city(value) {
                    if (!value) return 'Stadt ist ein Pflichtfeld.'
                    if (value?.length >= 2) return true

                    return 'Stadt muss mindestens zwei Buchstaben enthalten.'
                },
                // country(value) {
                //     
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
        const authStore = useAuth()
        if(authStore.isLoggedIn) {
            firstName.value.value = props.addressInfo.firstName
            lastName.value.value = props.addressInfo.lastName
    
            address1.value.value = props.addressInfo.address1
            address2.value.value = props.addressInfo.address2
            postcode.value.value = props.addressInfo.postcode
            city.value.value = props.addressInfo.city
            country.value.value = props.addressInfo.country
        }
        if(country.value.value === null || country.value.value === undefined || country.value.value === '') {
            country.value.value = 'DE'
        }

        const submit = handleSubmit(values => {
            context.emit('save', values)
            return values
        })
        return { firstName, lastName, address1, address2, postcode, city, country, submit }
    },
    watch: {
        addressInfo: {
            handler: function (val) {
                
                this.firstName.value.value = val.firstName
                this.lastName.value.value = val.lastName

                this.address1.value.value = val.address1
                this.address2.value.value = val.address2
                this.postcode.value.value = val.postcode
                this.city.value.value = val.city
                this.country.value.value = val.country
            },
            deep: true
        }
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
<style scoped>

</style>
