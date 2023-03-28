<template>
    <!-- <v-card class="card-bg tw-m-8 tw-w-96">
        <v-card-text>         -->
            <v-row>
                <v-col class="max-[960px]:tw-hidden"></v-col>
                <v-col cols="12" md="8" class="md:tw-p-8">
                    <div class="tw-flex tw-flex-row">
                        <v-text-field 
                            v-model="firstName"
                            variant="solo"
                            density="compact"
                            label="Vorname"
                            class="tw-mr-1 tw-mb-2 tw-w-1/2"
                            bg-color="rgb(26, 6, 58)"
                            color="rgb(250, 245, 255)"
                        />
                        <v-text-field
                            v-model="lastName"
                            density="compact"
                            label="Nachname"
                            class="tw-ml-1 tw-mb-2 tw-w-1/2"
                            bg-color="rgb(26, 6, 58)"
                            color="rgb(250, 245, 255)"
                            variant="solo"
                        />
                    </div>
                    <v-btn color="primary" variant="outlined" class="tw-w-full tw-normal-case tw-m-1 tw-text-purple-50" style="text-transform: none;">
                        <div class="tw-text-purple-50">Passwort ändern</div>
                    </v-btn>
                    <v-btn
                        color="primary"
                        class="tw-w-full tw-normal-case tw-m-1 tw-text-purple-50" style="text-transform: none;"
                        variant="outlined"
                    >
                    <div class="tw-text-purple-50">E-Mail ändern</div>
                    </v-btn>
                    <v-text-field 
                        v-model="username"
                        variant="solo"
                        density="compact"
                        class="tw-mb-2"
                        label="Benutzername"
                        bg-color="rgb(26, 6, 58)"
                        color="rgb(250, 245, 255)"
                    />
                    <v-text-field
                        v-model="password"
                        type="password"
                        density="compact"
                        class="tw-mb-2"
                        label="Passwort"
                        bg-color="rgb(26, 6, 58)"
                        color="rgb(250, 245, 255)"
                        variant="solo"
                    />
                </v-col>
                <v-col class="max-[960px]:tw-hidden"></v-col>
            </v-row>
        <!-- </v-card-text>
    </v-card> -->
</template>
<script>

export default {
    data() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            password: ''
        }
    }
}
</script>
<style scoped>
.card-bg {
  background: #4c1d95;
}
</style>