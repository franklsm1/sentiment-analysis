exports.up = function (knex) {
    return knex.schema.createTable('tweet', function (t) {
        t.increments('id').primary();
        t.string('keyword').notNullable();
        t.string('content').notNullable();
        t.integer("sentiment").notNullable();
        t.dateTime("created_date")
    })
}

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('tweet');
}