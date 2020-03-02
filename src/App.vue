<template>
    <div>
        <qr_reader>READER</qr_reader>

        <hr>

        <qr_input></qr_input>

        <hr>

        <bignum_input :denomination="9" :max="big_max"></bignum_input>
    </div>
</template>
<script>
    import qr_input from "./qr_input";
    import qr_reader from "./qr_reader";
    import bignum_input from "./bignum_input";

    import * as BN from 'bn.js';

    export default {
        data(){
            return {
            }
        },
        components: {
            qr_input,
            qr_reader,
            bignum_input
        },
        computed: {
            big_max(){
                // return null;
                return new BN('10000000000');
            }
        },
        created(){
        }
    }
</script>

<style lang="scss">

</style>
