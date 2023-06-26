<template>
    <v-dialog v-model="showModal" max-width="700">
        <v-card class="card-bg">
            <v-card-title>
                <h1 class="tw-text-xl tw-text-purple-50 tw-text-center">E-Mail ändern</h1>
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="newEmail.value.value"
                    :error-messages="newEmail.errorMessage.value"
                    label="Neue E-Mail"
                    variant="solo"
                    density="compact"
                    class="tw-mr-1 tw-mb-2"
                    bg-color="rgb(26, 6, 58)"
                    color="rgb(250, 245, 255)"
                />
                <v-text-field
                    v-model="repeatNewEmail.value.value"
                    :error-messages="repeatNewEmail.errorMessage.value"
                    label="Neue E-Mail wiederholen"
                    variant="solo"
                    density="compact"
                    class="tw-mr-1 tw-mb-2"
                    bg-color="rgb(26, 6, 58)"
                    color="rgb(250, 245, 255)"
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
                        <div class="tw-normal-case text-success">
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
import { updateEmail } from '@/utils/user.js'
import { useAuth } from '@/store/useAuth.js'

export default {
    name: 'ChangePassword',
    emits: ['close'],
    setup(props, context) {
        const { handleSubmit } = useForm({
            validationSchema: {
                newEmail(value) {
                    if (!value) return 'Neue E-Mail ist ein Pflichtfeld'
                    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return 'Es muss eine gültige E-Mail eingegeben werden.'
                    if(repeatNewEmail.value.value !== value) return 'E-Mail Addressen stimmen nicht überein.'

                    return true
                },
                repeatNewEmail(value) {
                    if (!value) return 'Neue E-Mail wiederholen ist ein Pflichtfeld.'
                    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return 'Es muss eine gültige E-Mail eingegeben werden.'
                    if(newEmail.value.value !== value) return 'E-Mail Addressen stimmen nicht überein.'

                    return true
                }
            }
        })

        const newEmail = useField('newEmail')
        const repeatNewEmail = useField('repeatNewEmail')

        const submit = handleSubmit(async (values) => {
            const auth = useAuth()
            await updateEmail(auth.getUser.id, values.newEmail)
            values.newEmail = ''
            values.repeatNewEmail = ''
        })

        return {
            showModal: props.show,
            newEmail,
            repeatNewEmail,
            submit
        }
    },
    watch: {
        show: function (val) {
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