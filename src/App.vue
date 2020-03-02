<template>
    <div>
        <qr_reader>READER</qr_reader>

        <hr>

        <qr_input></qr_input>

        <hr>

        <bignum_input :denomination="9"></bignum_input>
    </div>
</template>
<script>
    import qr_input from "./qr_input";
    import qr_reader from "./qr_reader";
    import bignum_input from "./bignum_input";

    export default {
        components: {
            qr_input,
            qr_reader,
            bignum_input
        },
        mounted(){

        }
    }
</script>

<style lang="scss">

</style>
