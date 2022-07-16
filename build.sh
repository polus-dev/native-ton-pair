{ 
    echo "[INF] building \"main.func\" ..."
    func -SPA -o "auto/main.func.code.fif" "func/main.func" \
    && echo "[OKK] build ok"
} || {
    echo  "[ERR] build \"main.func\" error!\n" 
}
