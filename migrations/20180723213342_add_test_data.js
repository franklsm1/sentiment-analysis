exports.up = function (knex) {
    return knex('tweet').insert(
        [{
                id: "0001",
                keyword: "test",
                text: "#test tweet is awesome",
                sentiment: 5,
                created_date: new Date()
            },
            {
                id: "0011",
                keyword: "test",
                text: "#test tweet is nuetral",
                sentiment: 0,
                created_date: new Date()
            },
            {
                id: "000111",
                keyword: "test",
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