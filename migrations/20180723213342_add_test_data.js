exports.up = function (knex) {
    return knex('tweet').insert(
        [{
                id: "0001",
                keywords: "test",
                text: "#test tweet is awesome",
                sentiment: 5,
                created_date: new Date()
            },
            {
                id: "0011",
                keywords: "test",
                text: "#test tweet is nuetral",
                sentiment: 0,
                created_date: new Date()
            },
            {
                id: "000111",
                keywords: "test",
                text: "#test tweet is awful",
                sentiment: -5,
                created_date: new Date()
            }
        ]

    );
}

exports.down = function (knex) {
    return knex('tweet').del();
}