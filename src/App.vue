<template>
    <div>
        <qr_reader>READER</qr_reader>

        <hr>

        <qr_input placeholder="Address"></qr_input>

        <hr>

        <bignum_input :value="bigVal" :denomination="9" :max="big_max" :min="0" @change="bigInChange" :step="stepSize" placeholder="0.0000000"></bignum_input>
        <p v-if="big_in_out">Out: {{big_in_out.toString()}}</p>
        <div style="display: flex">
            <p>Denomination 9</p>
            <p>MAX: {{big_max.toString()}}</p>
            <p>Step: {{stepSize}}</p>
        </div>

        <hr>

        <copy-text value="Copy this value">
            COPY ME
        </copy-text>
    </div>
</template>
<script>
    import qr_input from "./qr_input";
    import qr_reader from "./qr_reader";
    import bignum_input from "./bignum_input";
    import CopyText from "./CopyText";

    import * as BN from 'bn.js';

    export default {
        data(){
            return {
                bigVal: new BN(0),
                big_in_out: null,
            }
        },
        components: {
            qr_input,
            qr_reader,
            bignum_input,
            CopyText
        },
        computed: {
            big_max(){
                // return null;
                return new BN('1000000000000000');
            },
            stepSize(){
                // let expo = 9-3;
                //     expo = new BN(expo)
                // let tens = new BN('10').pow(expo);
                return new BN(1);
            }
        },
        methods: {
            bigInChange(val){
                this.big_in_out = val;
            }
        },
        created(){
        }
    }
</script>

<style scoped>
    p{
        margin: 4px 14px;
        font-size: 13px;
    }
</style>
