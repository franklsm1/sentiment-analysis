exports.up = function (knex) {
    return knex('tweet').insert(
        [{
                keyword: "test",
                content: "#test tweet is awesome",
                sentiment: 5,
                created_date: new Date()
            },
            {
                keyword: "test",
                content: "#test tweet is nuetral",
                sentiment: 0,
                created_date: new Date()
            },
            {
                keyword: "test",
                content: "#test tweet is awful",
                sentiment: -5,
                created_date: new Date()
            }
        ]

    );
}

exports.down = function (knex) {
    return knex('tweet').del();
}