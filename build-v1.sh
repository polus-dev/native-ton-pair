#!/bin/bash
# builder for BTN FunC code

#lib_order=(
#    "extlib.func"
#    "stdlib.func"
#)
#
#utils_order=(
#    "admin-methods.func"
#    "user-methods.func"
#    "handles.func"
#    "get-methods.func"
#)
#
#main_target="main.func"

func -SPA -o "auto/main.func.code.fif" \
    "func/lib/extlib.func" "func/lib/stdlib.func" \
    "func/utils/op-codes.func" "func/utils/exit-codes.func" \
    "func/utils/storage.func" "func/utils/math.func" "func/utils/msg-utils.func" \
    "func/utils/admin-methods.func" "func/utils/user-methods.func" \
    "func/utils/handles.func" "func/utils/get-methods.func" \
    "func/main.func"
