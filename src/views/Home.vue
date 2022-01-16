<template>
    <v-row>
        <v-col cols="12">
            <v-card color="deep-purple lighten-3" dark>
                <v-card-text>
                    <v-autocomplete
                        v-model="value"
                        :items="item_list"
                        placeholder="Start typing to Search"
                        label="Bazaar Item"
                        prepend-icon="mdi-magnify"
                        clearable
                    ></v-autocomplete>
                </v-card-text>
                <v-divider></v-divider>
                <v-expand-transition>
                    <v-list v-if="value_data" class="deep-purple lighten-4">
                        <v-list-item>
                            <v-row>
                                <v-col cols="12" sm="6" md="6" lg="6">
                                    <v-alert border="bottom" :type="alert_type(data[ID_list[value]].sell_summary[0].pricePerUnit, quick_stats[ID_list[value]].sellPrice, 'sell')">
                                        <div class="text-h5">
                                            Sell
                                        </div>
                                        <div>{{ data[ID_list[value]].sell_summary[0].pricePerUnit}} ({{quick_stats[ID_list[value]].sellPrice.toFixed(2)}})</div>
                                    </v-alert>
                                </v-col>
                                <v-col cols="12" sm="6" md="6" lg="6">
                                    <v-alert border="bottom" :type="alert_type(data[ID_list[value]].sell_summary[0].pricePerUnit, quick_stats[ID_list[value]].sellPrice, 'buy')">
                                        <div class="text-h5">
                                            Buy
                                        </div>
                                        <div>{{ data[ID_list[value]].buy_summary[0].pricePerUnit}} ({{quick_stats[ID_list[value]].buyPrice.toFixed(2)}})</div>
                                    </v-alert>
                                </v-col>
                            </v-row>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-sheet color="white" elevation="3" rounded v-if="chart.ready" light class="pa-2" style=" margin: 0 auto; position: relative; height:150x; width:100%;">
                                    <LineChart :option="chart.option" :data="chart.data" />
                                </v-sheet>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-row>
                                <v-col cols="12" sm="6" md="6" lg="6">
                                    <v-simple-table>
                                        <template v-slot:default>
                                            <thead>
                                                <tr>
                                                    <th class="text-left">PricePerUnit</th>
                                                    <th class="text-left">Amount</th>
                                                    <th class="text-left">Orders</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr
                                                    v-for="order in data[ID_list[value]].sell_summary"
                                                    :key="order.pricePerUnit"
                                                >
                                                    <td>{{ order.pricePerUnit }}</td>
                                                    <td>{{ order.amount }}</td>
                                                    <td>{{ order.orders }}</td>
                                                </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </v-col>
                                <v-col cols="12" sm="6" md="6" lg="6">
                                    <v-simple-table>
                                        <template v-slot:default>
                                            <thead>
                                                <tr>
                                                    <th class="text-left">PricePerUnit</th>
                                                    <th class="text-left">Amount</th>
                                                    <th class="text-left">Orders</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr
                                                    v-for="order in data[ID_list[value]].buy_summary"
                                                    :key="order.pricePerUnit"
                                                >
                                                    <td>{{ order.pricePerUnit }}</td>
                                                    <td>{{ order.amount }}</td>
                                                    <td>{{ order.orders }}</td>
                                                </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </v-col>
                            </v-row>
                            
                        </v-list-item>
                    </v-list>
                </v-expand-transition>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import LineChart from '@/components/LineChart.vue'

export default {
    name: "Home",
    data: () => ({
        value: "",
        value_data: null,
        item_list: [],
        ID_list: {},
        chart:{
            option:{
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 10,
                        bottom: 10
                    }
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day',
                            unitStepSize: 1,
                            displayFormats: {
                                'day': 'MMM DD'
                            }
                        }
                    }],
                    yAxes: [{ 
                        ticks: { 
                            beginAtZero:true,
                        } 
                    }] 
                }
            },
            data:{
                datasets:[
                    {
                        label:"Sell Price",
                        data:[],
                        fill: false,
                        borderColor: "#c72430",
                        pointBackgroundColor: "#c72430",
                        pointBorderColor: "#c72430"
                    },
                    {
                        label:"Buy Price",
                        data:[],
                        fill: false,
                        borderColor: "#5b7ac2",
                        pointBackgroundColor: "#5b7ac2",
                        pointBorderColor: "#5b7ac2"
                    }
                ]
            },
            ready: false
        }
    }),
    components:{
        LineChart
    },
    mounted(){
        for(var ele in this.data){
            let item_data = this.item_data_by_id(this.data[ele].quick_status.productId)
            this.item_list.push(item_data.name)
            this.ID_list[item_data.name] = item_data.id
        }
        this.item_list.sort()
    },
    computed:{
        data(){
            return this.$store.state.bazaar_data
        },
        quick_stats(){
            return this.$store.state.bazaar_quickstat_data
        },
        item_data_by_id(){
            return (ID) => {
                var tmp = this.$store.state.item_data.find(element => element.id == ID)
                return tmp == undefined ? ID : tmp
            }
        },
        alert_type(){
            return (current, avg, type) => {
                if(current > avg){
                    return type == "sell" ? "success" : "error"
                }else if(current < avg){
                    return type == "buy" ? "success" : "error"
                }else{
                    return "warning"
                }
            }
        }
    },
    watch:{
        value(){
            if(this.value){
                this.chart.ready = false
                this.chart.data.datasets[0].data = []
                this.chart.data.datasets[1].data = []
                this.$http.get("https://raw.githubusercontent.com/andyjjrt/bazaar-data/master/datafiles/" + this.ID_list[this.value] + ".json").then((res) => {
                    for(var i in res.data.history){
                        this.chart.data.datasets[0].data.push({x:res.data.history[i].time, y:res.data.history[i].sellPrice.toFixed(2)})
                        this.chart.data.datasets[1].data.push({x:res.data.history[i].time, y:res.data.history[i].buyPrice.toFixed(2)})
                    }
                    this.chart.ready = true
                    this.value_data = res.data
                })
            }else{
                this.chart.ready = false
                this.value_data = null
            }
        }
    }
}
</script>

<style>

</style>