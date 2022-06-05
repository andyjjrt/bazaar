<template>
    <v-app>
        <v-app-bar app fixed color="white">
            <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
            <v-toolbar-title>Bazzar</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
        </v-app-bar>
        <v-navigation-drawer
            v-model="drawer"
            absolute
            temporary
        >
            <v-list nav dense>
                <v-list-item-group active-class="deep-purple--text text--accent-4">
                    <v-list-item link @click="drawer = false" to="/">
                        <v-list-item-icon>
                            <v-icon>mdi-home</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item>

                    <v-list-item link @click="drawer = false" to="/about">
                        <v-list-item-icon>
                            <v-icon>mdi-information</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>About</v-list-item-title>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
        <v-main>
            <v-container>
                <router-view v-if="ready"></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: 'App',
    data: () => ({
        drawer: false,
    }),
    created(){
        var v_ = this
        this.refresh()
        this.timer = window.setInterval(function(){v_.refresh()},10000)
        this.$http.get("https://api.hypixel.net/resources/skyblock/items").then((res) => {
            this.$store.commit('item', res.data.items)
        })
        this.$http.get("https://raw.githubusercontent.com/aiveraiva/bazaar-data/master/quickstat.json").then((res) => {
            this.$store.commit('bazaar_quickstat', res.data)
        })
    },
    methods:{
        refresh(){
            this.$http.get("https://api.hypixel.net/skyblock/bazaar").then((res) => {
                this.$store.commit('bazaar', res.data.products)
                this.$store.commit('update_time',  new Date(res.data.lastUpdated))
            })
        }
    },
    computed:{
        ready(){
            return this.$store.state.bazaar_data != null && this.$store.state.bazaar_quickstat_data != null && this.$store.state.item_data != null
        }
    }
};
</script>

