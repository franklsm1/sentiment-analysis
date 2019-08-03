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
        t.string('keyword').notNullable();
        t.string('text', 512).notNullable();
        t.integer('sentiment').notNullable();
        t.dateTime('created_date');
      });
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable('post')
    .dropTable('keyword');
};
