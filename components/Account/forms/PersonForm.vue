<template>
    <v-row>
        <v-col class="max-[960px]:tw-hidden"></v-col>
        <v-col cols="12" md="8" class="md:tw-p-8">
            <v-form class="lg:tw-p-2">
                <div class="tw-flex tw-flex-row">
                    <v-text-field 
                        v-model="firstName.value.value"
                        :error-messages="firstName.errorMessage.value"
                        variant="solo"
                        density="compact"
                        label="Vorname"
                        class="tw-mr-1 tw-mb-2 tw-w-1/2"
                        bg-color="rgb(26, 6, 58)"
                        color="rgb(250, 245, 255)"
                        @change="firstName.value.value = firstName.value.value.charAt(0).toUpperCase() + firstName.value.value.slice(1)"
                    />
                    <v-text-field
                        v-model="lastName.value.value"
                        :error-messages="lastName.errorMessage.value"
                        density="compact"
                        label="Nachname"
                        class="tw-ml-1 tw-mb-2 tw-w-1/2"
                        bg-color="rgb(26, 6, 58)"
                        color="rgb(250, 245, 255)"
                        variant="solo"
                        @change="lastName.value.value = lastName.value.value.charAt(0).toUpperCase() + lastName.value.value.slice(1)"
                    />
                </div>
                <v-text-field 
                    v-model="username.value.value"
                    :error-messages="username.errorMessage.value"
                    variant="solo"
                    density="compact"
                    class="tw-mb-2"
                    label="Benutzername"
                    bg-color="rgb(26, 6, 58)"
                    color="rgb(250, 245, 255)"
                />
                <div class="tw-mb-8">
                    <v-btn color="primary" class="tw-w-full tw-normal-case tw-my-1 tw-text-purple-50" style="text-transform: none;" variant="outlined" rounded="xl">
                        <div class="tw-text-purple-50">E-Mail ändern</div>
                    </v-btn>
                    <v-btn color="primary" variant="outlined" class="tw-w-full tw-my-1 tw-normal-case tw-text-purple-50" style="text-transform: none;" rounded="xl">
                        <div class="tw-text-purple-50">Passwort ändern</div>
                    </v-btn>
                </div>
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
    emits: ['save'],
    props: {
        userInfo: {
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
                username(value) {
                    if (!value) return 'Addresse ist ein Pflichtfeld.'
                    if (value?.length >= 2) return true

                    return 'Addresse muss mindestens zwei Buchstaben enthalten.'
                }
            }
        })
        const firstName = useField('firstName')
        const lastName = useField('lastName')
        const username = useField('username')

        firstName.value.value = props.userInfo.firstName
        lastName.value.value = props.userInfo.lastName
        username.value.value = props.userInfo.username

        const submit = handleSubmit(values => {
            context.emit('save', values)
        })

        return { submit, firstName, lastName, username}
    },
}
</script>
<style scoped>
.card-bg {
  background: #4c1d95;
}
</style>