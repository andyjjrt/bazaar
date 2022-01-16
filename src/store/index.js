import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        search: "",
        last_update_time: new Date(),
        bazaar_data: null,
        bazaar_quickstat_data: null,
        item_data: null
    },
    mutations: {
        bazaar (state, data) {
            state.bazaar_data = data
        },
        item(state, data){
            state.item_data= data
        },
        bazaar_quickstat(state, data){
            state.bazaar_quickstat_data = data
        },
        update_time(state, data){
            state.last_update_time = data
        }
    },
    actions: {
    },
    modules: {
    }
})