<template>
    <input type="number" inputmode="decimal" :placeholder="placeholder" v-model="val" :min="min" :max="maxNum" :step="stepNum" @change="onChange">
</template>
<script>
    import Big from 'big.js';
    import * as BN from 'bn.js';

    export default {
        data(){
            return {
                val: null,
            }
        },
        computed: {
            maxNum(){
                if(this.max===null) return null
                try{
                    let num = this.bnToNum(this.max)
                    if(num<0)return 0
                    return num
                }catch (e){
                    console.error(e)
                    return null
                }
            },
            stepNum(){
                if(!this.step) {
                    if(this.denomination >= 2){
                        return 0.01
                    }else{
                        return Math.pow(10, -this.denomination)
                    }
                }
                try{
                    return this.bnToNum(this.step)
                }catch (e){
                    console.error(e)
                    return 0.01
                }

            }
        },
        props: {
            denomination:{
                type: Number,
                default: 0
            },
            max: {
                default: null,
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

                //
                try{
                    let splitVal = val.toString().split('.')
                    let wholeVal = splitVal[0]
                    let denomVal = splitVal[1]
                    if(denomVal){
                        if(denomVal.length > this.denomination){
                            let newDenom = denomVal.substring(0,this.denomination)
                            this.val = `${wholeVal}.${newDenom}`
                            return
                        }
                    }
                }catch (e){
                    console.log(e)
                }

                if(parseFloat(val) < this.min){
                    this.val = this.min.toString()
                    return
                }

                if(!val){
                    this.$emit('change', new BN(0));
                    return
                }

                let valBn = this.stringToBN(val)
                this.$emit('change', valBn);
            },
            value(valBn){
                this.val = this.bnToNum(valBn)
            }
        },
        methods: {
            bnToNum(bnVal){
                let pow = (new Big(bnVal.toString())).div(Math.pow(10,this.denomination))
                return pow.toNumber()
            },
            stringToBN(strVal){
                let tens = Big(10).pow(this.denomination)
                let satoshis = Big(strVal).times(tens)
                return new BN(satoshis.toString())
            },
            maxout(){
                if(this.maxNum != null){
                    this.val = this.maxNum
                }
            },
            clear(){
                this.val = 0
            },
            onChange(){
                // If number is above max amount, correct it
                if(this.maxNum != null){
                    if(this.val > this.maxNum){
                        this.val = this.maxNum
                    }
                }
            }
        }
    }
</script>
<style scoped>
    input{
        text-align: right;
        outline: none;
    }
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }
</style>
