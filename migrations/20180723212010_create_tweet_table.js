exports.up = function (knex) {
    return knex.schema.createTable('tweet', function (t) {
        t.string('id').primary();
        t.string('keywords').notNullable();
        t.string('text', 512).notNullable();
        t.integer("sentiment").notNullable();
        t.dateTime("created_date")
    })
}

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('tweet');
}