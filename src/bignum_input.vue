<template>
    <input type="number" :placeholder="placeholder" v-model="val" :min="min" :max="maxNum" :step="stepNum" @change="onChange">
</template>
<script>
    import Big from 'big.js';
    import * as BN from 'bn.js';

    export default {
        data(){
            return {
                val: 0.00,
            }
        },
        computed: {
            maxNum(){
                if(!this.max) return null
                try{
                    return this.bnToNum(this.max)
                }catch (e){
                    console.error(e)
                    return null
                }
            },
            stepNum(){
                if(!this.step) return 0.01
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
                            this.val = parseFloat(`${wholeVal}.${newDenom}`)
                            return
                        }
                    }
                }catch (e){
                    console.log(e)
                }

                if(!val){
                    this.$emit('change', new BN(0));
                    return
                }
                let valEdit = (parseFloat(val).toFixed(this.denomination)).split('.').join('')
                let valBn = new BN(valEdit)
                this.$emit('change', valBn);
            },
            value(valBn){
                // this.val = this.bnToNum(valBn)
                console.log("Parent Change",valBn.toString())
            }
        },
        methods: {
            bnToNum(bnVal){
                let pow = (new Big(bnVal.toString())).div(Math.pow(10,this.denomination))
                return pow.toNumber()
            },
            maxout(){
                if(this.maxNum){
                    this.val = this.maxNum
                }
            },
            clear(){
                this.val = 0
            },
            onChange(){
                // If number is above max amount, correct it
                if(this.maxNum){
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
