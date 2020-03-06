<template>
    <input type="text" v-model="raw"
           @keydown.up="up" @keydown.down="down" contenteditable="false"
           @input="input" @change="change" placeholder="0.00">
</template>
<script>
    import Big from 'big.js';
    import * as BN from 'bn.js';

    export default {
        data(){
            return {
                raw: '',
                value: null,
            }
        },
        created() {
            this.value = new Big(0);
        },
        computed: {
            // Should return Big
            // this.step is BN
            stepSize(){
                if(this.step){
                    let tens = Big(10).pow(-this.denomination);
                    let bigStep = Big(this.step.toString());
                    let res = tens.times(bigStep);
                    // console.log(res.toString());
                    return res
                }else{
                    return Math.pow(10,-this.denomination);
                }
            },
            bigMax(){
                if(this.max){
                    // this.max is a BN in satoshis
                    let satoshi = Big(this.max);
                    let divider = Big(10).pow(this.denomination);
                    return satoshi.div(divider)
                }
                return null;
            },
            bigMin(){
                if(typeof this.min != 'undefined'){
                    return Big(this.min);
                }
                return null;
            },
        },
        mounted() {
            this.cleanInput();
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
                type: BN,
                default: null,
            }
        },
        watch: {
            denomination(){
                this.cleanInput();
            }
        },
        methods: {

            // Emit in BN as satoshis!
            emit(){
                // console.log(this.value.toString());
                let tens = Big(10).pow(this.denomination);
                let satoshis = this.value.times(tens);
                let bn = new BN(satoshis.toFixed(0));
                this.$emit('change', bn);
            },
            change(){
                this.cleanInput();
            },
            input(ev){
                ev.preventDefault();
                let data = ev.data;

                if(data !== null){
                    let num = parseInt(data);
                    if(isNaN(num)){
                        this.cleanInput();
                    }
                }
            },
            cleanInput(){
                let rawnum;
                // console.log('Raw:',this.raw);


                try{
                    if(this.raw === ''){
                        rawnum = new Big(0);
                    }else{
                        rawnum = new Big(this.raw);
                    }
                }catch(err){
                    rawnum = this.value;
                }

                // Min Max value limiting
                if(this.bigMax != null){
                    if(rawnum.gt(this.bigMax)){
                        rawnum = this.bigMax
                    }else if(rawnum.lt(this.bigMin)){
                        rawnum = this.bigMin;
                    }
                }
                // this.raw = rawnum.toFixed(this.denomination);

                // Denomination limiting

                let trimmed = this.value.toFixed(this.denomination);
                if(this.raw.length > trimmed.length){
                    this.raw = trimmed;
                    rawnum = Big(trimmed);
                }

                // console.log(rawnum.toString());
                this.value = rawnum;
                this.emit();
            },
            maxout(){
                if(this.bigMax){
                    this.value = this.bigMax;
                    this.valueToRaw();
                }
            },
            up(){
                this.value = this.value.plus(this.stepSize);
                this.valueToRaw();
            },
            valueToRaw(){
                let val = this.value;
                if(this.bigMax != null){
                    if(val.gt(this.bigMax)){
                        val = this.bigMax;
                        this.value = val;
                    }else if(val.lt(this.bigMin)){
                        val = this.bigMin;
                        this.value = val;
                    }
                }
                // this.raw = val.toFixed(this.denomination);
                this.raw = val.toPrecision();
                this.emit();
            },
            down(){
                this.value = this.value.minus(this.stepSize);
                this.valueToRaw();
            }
        }
    }
</script>
<style scoped>
    input{
        text-align: right;
    }
</style>