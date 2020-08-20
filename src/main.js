import Vue from 'vue'
import App from './App.vue'
import Big from "big.js";

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
    mounted(){
    }
}).$mount('#app');


Big.prototype.toLocaleString = function(toFixed) {
    let value = this;
    let remainder = value.mod(1);
    let wholeNums = value.minus(remainder);
    let wnInt = parseInt(wholeNums.toFixed(0));

    if (toFixed === 0) return wnInt.toLocaleString();

    return (parseFloat(remainder) === 0) ?
        wnInt.toLocaleString() :
        wnInt.toLocaleString() + "." + remainder.toFixed(toFixed).split(".")[1].toString();
}



