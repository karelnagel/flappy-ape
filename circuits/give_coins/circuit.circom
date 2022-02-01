pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/mimcsponge.circom";

template GiveCoins() {
    signal input coins;
    signal input private_key;
    signal input user_id;
    signal input user_nonce;
    signal output out_user_nonce;
    signal output out_coins;
    signal output out_user_id;
    signal output out_pub;

    //Creating private_key hash
    component mimc = MiMCSponge(2, 220, 1);
    mimc.ins[0] <== private_key;
    mimc.ins[1] <== private_key;
    mimc.k <== 7;
    out_pub <== mimc.outs[0];

    out_coins<==coins;
    out_user_id<==user_id;
    out_user_nonce<==user_nonce;
    log(out_pub);
    log(out_coins);
    log(out_user_id);
    log(out_user_nonce);
}

component main = GiveCoins();