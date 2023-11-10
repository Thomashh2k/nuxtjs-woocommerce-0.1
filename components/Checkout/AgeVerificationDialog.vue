<template>
    <v-dialog v-model="unverified">
        <v-card class="account-card-bg">
            <v-card-title>
                <h1 class="tw-text-purple-50">Altersnachweis</h1>
            </v-card-title>
            <v-card-text>
                <p class="tw-text-purple-50">Bitte geben sie die Ausweisnummer an</p>
                <div class="tw-text-purple-50 tw-mt-4">
                    <div class="tw-flex tw-flex-row">
                        IDD &lt;&lt; <input v-model="persoFields.ida" class="ida-number" minlength="10" maxlength="10"/>
                        &lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                    </div>
                    <div class="tw-flex tw-flex-row ">
                        <input v-model="persoFields.idb" class="idb-number tw-shrink" minlength="7" maxlength="7"/>
                            &lt;
                        <input v-model="persoFields.idc" class="idc-number tw-shrink" minlength="8" maxlength="8"/>
                        &lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                        <input v-model="persoFields.idd" class="idd-number tw-shrink" minlength="1" maxlength="1"/>
                    </div>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn color="green" variant="outlined" @click="submitVerfication()" >
                    <div class="tw-normal-case">Bestätigen</div>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
const get_perso_data = () => {
    return
}
export default {
    name: 'AgeVerificationDialog',
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            unverified: true,
            persoFields: {
                ida: '',
                idb: '',
                idc: '',
                idd: '',
            }
        }
    },
    created() {
        
        this.unverified = this.modelValue
        console.log(this.needsVerification)
    },
    methods: {
        submitVerfication() {
            
            const persoData = get_perso_data(this.persoFields)
            console.log(persoData)
            this.$emit('update:modelValue', false)
        },
        get_perso_data() {
            return
        }
    }
}
</script>
<style scoped>
input {
    background-color: rgb(26, 6, 58);
    color: rgb(250, 245, 255);
    border-color: rgb(229, 231, 235);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}
input:focus{
    outline: none;
}
.ida-number {
    min-width: 109.433px;
    max-width: 109.433px;
}
.idb-number {
    min-width: 80.25px;
    max-width: 80.25px;
}
.idc-number {
    min-width: 91.2px;
    max-width: 91.2px;
}
.idd-number {
    min-width: 27.35px;
    max-width: 27.35px;
}
</style>