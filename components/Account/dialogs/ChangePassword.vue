<template>
    <v-dialog v-model="showModal" max-width="700">
        <v-card class="card-bg">
            <v-card-title>
                <h1 class="tw-text-xl tw-text-purple-50 tw-text-center">Passwort ändern</h1>
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="newPassword.value.value"
                    :error-messages="newPassword.errorMessage.value"
                    :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showNewPassword ? 'text': 'password'"
                    label="Neues Passwort"
                    variant="solo"
                    density="compact"
                    class="tw-mr-1 tw-mb-2"
                    bg-color="rgb(26, 6, 58)"
                    color="rgb(250, 245, 255)"
                    @click:append-inner="showNewPassword = !showNewPassword"
                />
                <v-text-field
                    v-model="repeatNewPassword.value.value"
                    :error-messages="repeatNewPassword.errorMessage.value"
                    :append-inner-icon="showRepeatNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showRepeatNewPassword ? 'text': 'password'"
                    label="Neues Passwort wiederholen"
                    variant="solo"
                    density="compact"
                    class="tw-mr-1 tw-mb-2"
                    bg-color="rgb(26, 6, 58)"
                    color="rgb(250, 245, 255)"
                    @click:append-inner="showRepeatNewPassword = !showRepeatNewPassword"

                />
            </v-card-text>
            <v-card-actions>
                <div class="tw-flex tw-justify-center tw-w-full">
                    <v-btn color="primary" variant="outlined" rounded="xl" @click="close">
                        <div class="tw-text-purple-50 tw-normal-case">
                            Abbrechen
                        </div>    
                    </v-btn>
                    <v-btn color="success" variant="outlined" rounded="xl" @click="submit" >
                        <div class="tw-normal-case">
                            Speichern
                        </div>
                    </v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import { useField, useForm } from 'vee-validate';
import { updatePassword } from '@/utils/user.js'
import { useAuth } from '@/store/useAuth.js'

export default {
    name: 'ChangePassword',
    emits: ['close'],
    setup(props, context) {
        const { handleSubmit } = useForm({
            validationSchema: {
                newPassword(value) {
                    if (!value) return 'Neues Passwort ist ein Pflichtfeld.'
                    if (value?.length >= 6) return true
                    if(repeatNewPassword !== value) return 'Passwörter stimmen nicht überein.'

                    return 'Nachname muss mindestens sechs Buchstaben enthalten.'
                },
                repeatNewPassword(value) {
                    if (!value) return 'Neues Passwort wiederholen ist ein Pflichtfeld.'
                    if (value?.length >= 6) return true
                    if(newPassword !== value) return 'Passwörter stimmen nicht überein.'

                    return 'Nachname muss mindestens sechs Buchstaben enthalten.'
                }
            }
        })

        const newPassword = useField('newPassword')
        const repeatNewPassword = useField('repeatNewPassword')


        const submit = handleSubmit(async (values) => {
            debugger
            const auth = useAuth()
            await updatePassword(auth.getUser.id, values.newPassword)
            values.newPassword = ''
            values.repeatNewPassword = ''
            context.emit('close')
            this.showModal = false;
        })

        return {
            showModal: props.show,
            newPassword,
            repeatNewPassword,
            submit
        }
    },
    data() {
        return {
            showOldPassword: false,
            showNewPassword: false,
            showRepeatNewPassword: false
        }
    },
    watch: {
        show: function (val) {
            debugger
            this.showModal = val;
        }
    },
    props: {
        show: {
            type: Boolean,
            required: true,
        }
    },
    methods: {
        close() {
            this.showModal = false;
            this.$emit('close');
        }
    }
}
</script>
<style scoped>
.card-bg {
  background: rgb(50, 17, 102);;
}
</style>