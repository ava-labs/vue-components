<template>
    <CurrencyInput :allow-negative="false"
                    v-model="val"
                    locale="default"
                    :currency="null"
                    :value-as-integer="false"
                    :precision="denomination"
                    :auto-decimal-mode="true"
                    :value-range="range"
                   ref="curIn"
                   @keydown.up.native="keyUp"
                   @keydown.down.native="keyDown"
    ></CurrencyInput>
</template>
<script>
    import Big from 'big.js';
    import * as BN from 'bn.js';
    import {CurrencyInput} from 'vue-currency-input';

    export default {
        components:{
            CurrencyInput
        },
        data(){
            return {
                val: 0,
            }
        },
        computed: {
            range(){
                let maxStr = Number.MAX_SAFE_INTEGER.toString();
                if(this.max){
                    let bnStr = this.max.toString();
                    let big = Big(bnStr).div(Math.pow(10,this.denomination));
                    maxStr = big.toString();
                }
                return{
                    min: this.min.toString(),
                    max: maxStr
                }
            }
        },
        props: {
            denomination:{
                type: Number,
                default: 0
            },
            max: {
                type: [BN, Object],
            },
            min: {
                type: Number,
                default: 0,
            },
            step: {
                type: [BN, Object],
                default: null,
            },
            placeholder: String,
            value: BN
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        watch: {
            val(val){
                let mult = Math.pow(10,this.denomination);
                let valBig = Big(val).times(mult);
                let strVal = valBig.toString();
                let bnVal = new BN(strVal);
                this.$emit('change', bnVal);
            }
        },
        methods: {
            keyUp(ev){
                ev.preventDefault();
                let dif = Big(1).div(Math.pow(10,this.denomination))
                let newVal = Big(this.val).add(dif);
                this.$refs.curIn.setValue(newVal.toString());
            },
            keyDown(ev){
                ev.preventDefault();
                let dif = Big(1).div(Math.pow(10,this.denomination))
                let newVal = Big(this.val).sub(dif);
                this.$refs.curIn.setValue(newVal.toString());
            },
            maxout(){
                if(this.max){
                    this.$refs.curIn.setValue(this.max.toString());
                }
            }
        }
    }
</script>
<style scoped>
    input{
        text-align: right;
    }
</style>