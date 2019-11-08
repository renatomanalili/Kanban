<template>
    <div>
        <v-btn @click="signInGoogle">Sign In with Google</v-btn>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        signInGoogle() {
            const provider = new this.firebase.auth.GoogleAuthProvider();
            
            this.firebase.auth().signInWithPopup(provider).then((result)=>{
                this.$router.replace('/')
            })
        }
    }
}
</script>