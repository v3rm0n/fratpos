Inventuur
Loomise aeg {{time}}

Kasutajad
Staatus,Eesnimi,Perenimi,Õllenimi,Saldo{{#each users}}
{{status}},{{firstname}},{{lastname}},{{beername}},{{balance}}{{/each}}
,,,Summa,{{balancesSum}}

Tehingud
Aeg,Tüüp,Summa,Katkestatud{{#each transactions}}
{{time}},{{type}},{{sum}},{{#if invalid}}Jah{{/if}}{{/each}}
,Summa,{{transactionsSum}}

Laoseis
Nimi,Hind,Kogus{{#each products}}
{{name}},{{price}},{{quantity}}{{/each}}
,Kokku,{{productsQuantity}}