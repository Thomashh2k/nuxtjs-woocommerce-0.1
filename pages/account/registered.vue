<template>
    <v-row class="tw-h-full">
        <v-col></v-col>
        <v-col cols="8">
            <v-card class="tw-text-black tw-mt-6  lg:tw-mr-4 hover:shadow-2xl account-card-bg">
                <v-card-title>
                    <img class="tw-text-center" alt="Logo...."/>
                    <h1 class="tw-text-purple-50 tw-text-2xl tw-text-center">Bitte bestätige deine E-Mail</h1>
                </v-card-title>
                <v-card-text class="tw-mt-4 tw-text-center">
                    <p class="tw-text-purple-50 tw-text-xl">Nur noch ein letzter Schritt {{ freshlyRegisteredUser.firstName }}</p>
                    <p class="tw-text-purple-50 tw-text-xl">Bitte bestätige deine E-Mail noch um dein Benutzerkonto verwenden zu können.</p>
                </v-card-text>
                <v-card-actions>
                    <div class="tw-flex tw-justify-center tw-pb-4 tw-w-full">
                            <v-btn 
                                color="success"
                                :to="freshlyRegisteredUser.email.split('@')[1]"
                                variant="outlined"
                                
                            >
                                <p class="tw-normal-case">{{ freshlyRegisteredUser.email.split('@')[1] }}</p>
                            </v-btn>
                        </div>
                </v-card-actions>
            </v-card>
        </v-col>
        <v-col></v-col>
    </v-row>
</template>
<script>
import { useAuth } from "@/store/useAuth";

export default {
    setup() {
        const authStore = useAuth();
        const freshlyRegisteredUser = authStore.user;
        freshlyRegisteredUser.email === null ? freshlyRegisteredUser.email = '@example.com' : freshlyRegisteredUser.email = freshlyRegisteredUser.email
        return { freshlyRegisteredUser }
    }
}
</script>
<style scoped>
.card-bg-color {
  /* background: rgb(26, 6, 58) !important; */
  background-color: rgb(76 29 149 / var(--tw-bg-opacity));
}
.account-card-bg {
  background: rgb(50, 17, 102);
}
</style>