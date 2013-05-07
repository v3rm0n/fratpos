Inventuur
Loomise aeg {{formattedTime}}

Kasutajad
Staatus,Eesnimi,Perenimi,Õllenimi,Saldo{{#each users}}
{{status}},{{firstname}},{{lastname}},{{beername}},{{balance}}{{/each}}
,,,Summa,{{balancesSum}}

Tehingud
Aeg,Nimi,Summa,Makseviis,Katkestatud{{#each transactions}}
{{formattedTime}},{{user.label}},{{sum}},{{type}},{{#if invalid}}Jah{{/if}}{{/each}}
,Summa,{{transactionsSum}}

Laoseis
Nimi,Hind,Kogus{{#each products}}
{{name}},{{price}},{{quantity}}{{/each}}
,Kokku,{{productsQuantity}}