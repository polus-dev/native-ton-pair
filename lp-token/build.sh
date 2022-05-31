#!/bin/bash

{ 
    echo "[INF] building \"jetton-minter.func\" and \"jetton-wallet.func\" ..."
    func -SPA -o "lp-token/auto/jetton-minter.code.fif" "lp-token/jetton-minter.func" \
    && func -SPA -o "lp-token/auto/jetton-wallet.code.fif" "lp-token/jetton-wallet.func" \
    && printf "[OKK] build ok\n"
} || {
    printf  "[ERR] build \"jetton-minter.func\" and \"jetton-wallet.func\" error!\n" 
}
