exports.up = function (knex) {
  return knex.schema.createTable('keyword', function (t) {
    t.increments('id').primary();
    t.string('value').notNullable().unique();
    t.string('status').notNullable();
    t.dateTime('created_date').notNullable();
    t.dateTime('updated_date').defaultTo(knex.fn.now());
  })
    .then(() => {
      return knex.schema.createTable('post', function (t) {
        t.string('id').primary();
        t.string('type').notNullable();
        t.integer('keyword_id').unsigned().notNullable();
        t.string('text', 512).notNullable();
        t.integer('sentiment').notNullable();
        t.dateTime('created_date');
        t.foreign('keyword_id').references('id').inTable('keyword');
      });
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('post')
    .dropTable('keyword');
};
