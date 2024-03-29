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
                        v-model="userName.value.value"
                        :error-messages="userName.errorMessage.value"
                        density="compact"
                        label="Benutzername"
                        :disabled="true"
                        class="tw-ml-1 tw-mb-2 tw-w-full"
                        bg-color="rgb(26, 6, 58)"
                        color="rgb(250, 245, 255)"
                        variant="solo"
                    />
                <div class="tw-mb-8">
                    <v-btn color="primary" class="tw-w-full tw-normal-case tw-my-1 tw-text-purple-50" style="text-transform: none;" variant="outlined" rounded="xl" @click="showEmailDialog = true">
                        <div class="tw-text-purple-50">E-Mail ändern</div>
                    </v-btn>
                    <v-btn color="primary" variant="outlined" class="tw-w-full tw-my-1 tw-normal-case tw-text-purple-50" style="text-transform: none;" rounded="xl" @click="showPasswordDialog = true">
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
        <ChangePassword :show="showPasswordDialog" @close="showPasswordDialog = false"/>
        <ChangeEmail :show="showEmailDialog" @close="showEmailDialog = false"/>
    </v-row>
</template>
<script>
import { useField, useForm } from 'vee-validate';
import { useSnackbar } from "@/store/snackbar";
import ChangePassword from '@/components/Account/dialogs/ChangePassword.vue';
import ChangeEmail from '@/components/Account/dialogs/ChangeEmail.vue';

export default {
    emits: ['save'],
    components: {
        ChangePassword,
        ChangeEmail
    },
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
                userName(value) {
                    if (!value) return 'Benuztername ist ein Pflichtfeld.'
                    if (value?.length >= 5) return true

                    return 'Nachname muss mindestens 18 Buchstaben enthalten.'
                }
            }
        })
        const firstName = useField('firstName')
        const lastName = useField('lastName')
        const userName = useField('userName')

        firstName.value.value = props.userInfo.firstName
        lastName.value.value = props.userInfo.lastName
        userName.value.value = props.userInfo.username

        const submit = handleSubmit(values => {
            context.emit('save', values)
        })

        return { submit, firstName, lastName, userName}
    },
    data() {
        return {
          showPasswordDialog: false,
          showEmailDialog: false
        }
    },
    methods: {
        sendResetPasswordLink() {
            const snackbar = useSnackbar()
            snackbar.setMessage('Es wurde ein Link an ihre E-Mail Addresse gesendet, womit sie ihr Passwort ändern können.', '#4c1d95')
        }
    }
}
</script>
<style scoped>
.card-bg {
  background: #4c1d95;
}
</style>