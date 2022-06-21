# Native Ton Pair (DEX)

BITON DEX repository \
This is a native pair that allows you to exchange TON -> JETTON

## Description of how AMM exchange works

When a user wants to make an exchange, they must send JETTONs or TONs to the DEX address. The price is formed according to a special mathematical formula
```
k = a * b,
where 
a - TON liquidity pool
b - Jetton liquidity pool
DEX calculates the price so that the exchange does not change k.
```
The larger the scale of the transaction and the smaller the pools of liquidity, the greater the divergence of the price from the linear (a / b).
Thus, to avoid possible exchange problems, DEX itself sets the maximum price. This is done using the following algorithm.
Linear price + Linear price * max percent 
If the user needs to exchange at a larger mismatch he can specify op buy and set the maximum price himself.

## Liquidity pools and farming

Пользователи могут предоставлять ликвидность в DEX, дабы влияние на цену было меньше. За это DEX вознаграждает частью комиссии.

### Как предоставить ликвидность?

Чтобы предоставить ликвидность пользователь должен отправить JETTON и TON в нужной пропорции(linear price).
При отправке нужно указывать op добавления ликвидности.
DEX смотрит на пропорцию. Есть 3 варианта событий
1) Пропорция неверная и TON оказалось меньше чем нужно. В таком случае DEX отправляет обратно транзакцию.
2) Пропорция неверная и JETTON оказалось больше чем нужно. В таком случае DEX отправит излишки обратно. И приступит к 3 варианту.
3) Пропорция верная, в таком случае DEX рассчитает количество LP токенов по формуле 
```
sqrt(a * b)
a - количество TON
b - количество JETTON
```
Далее DEX отправит запрос на mint новых LP токенов на адрес LP минтера

### Как удалить ликвидность?

Чтобы удалить ликвидность пользователю нужно отправить LP токены на адрес DEX и далее DEX рассчитает количество JETTON и TON в пропорции, а так-же собранную комиссию.
LP токены отправятся на сжигание, а TON и JETTON отправятся пользователю

## Routing
Пользователи могут обменивать монеты, при этом монеты будут уходить на другой адрес.
Сделать это можно по следующей схеме.
\
\
routing query_id:uint64 fwd_addr:MsgAddress err_addr:MsgAddress
\
\
В таком случае DEX отправит сообщение на fwd_addr, а если случится ошибка, то DEX должен отправить на err_addr

При этом DEX отправляет сообщение указывая op routing и err addr




