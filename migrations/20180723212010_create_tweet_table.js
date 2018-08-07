exports.up = function (knex, Promise) {
    return knex.schema.createTable('keywords', function (t) {
            t.increments('id').primary();
            t.string('value').notNullable().unique();
            t.string('status').notNullable();
            t.dateTime("created_date").notNullable();
        })
        .then(() => {
            return knex.schema.createTable('tweet', function (t) {
                t.string('id').primary();
                t.string('keywords').notNullable();
                t.string('text', 512).notNullable();
                t.integer("sentiment").notNullable();
                t.dateTime("created_date");
            });
        });
}

exports.down = function (knex) {
    return knex.schema.dropTable('tweet')
        .dropTable('keywords');
}