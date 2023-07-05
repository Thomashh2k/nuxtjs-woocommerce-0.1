<template>
    <v-card class="card-bg">
        <v-card-title>
            <h1 class="tw-text-purple-50 tw-text-4xl tw-text-center">Passwort vergessen</h1>
        </v-card-title>
        <v-card-text>
            <div class="tw-text-purple-50 tw-text-xl tw-text-center tw-mt-6">
                Geben sie bitte ihre E-Mail Adresse ein, um ein neues Passwort zu erhalten.
            </div>
            <v-text-field
                v-model="email.value.value"
                label="E-Mail"
                :error-messages="email.errorMessage.value"
                variant="solo"
                class="tw-mt-6 tw-px-10"
                density="compact"
                bg-color="rgb(26, 6, 58)"
                color="rgb(250, 245, 255)"
            />
        </v-card-text>
        <v-card-actions>
            <div class="tw-w-full tw-flex tw-justify-center">
                <v-btn color="success" variant="outlined" rounded="xl" @click="onSubmit" >
                    <div class="tw-normal-case text-success">
                        Absenden
                    </div>
                </v-btn>
            </div>
        </v-card-actions>
    </v-card>
</template>
<script>
import { useField, useForm } from 'vee-validate';
import { sendResetPasswordLink } from '@/utils/user.js'
export default {
    name: 'forgot-password',
    setup() {
        const { handleSubmit } = useForm({
            validationSchema: {
                email(value) {
                    if (!value) return 'E-Mail ist ein Pflichtfeld'
                    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return 'Es muss eine gültige E-Mail eingegeben werden.'

                    return true
                },
            }
            
        });
        const onSubmit = handleSubmit(async (values) => {
            debugger
            sendResetPasswordLink(values.email)
        })
        const email = useField('email')
        return {
            email,
            onSubmit
        }
    }
 }
</script>
<style scoped>
.card-bg {
  background: rgb(50, 17, 102);;
}
</style>