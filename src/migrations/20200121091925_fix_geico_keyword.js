exports.up = function (knex) {
  return knex('keyword')
    .where({ value: '@geico OR OR @GEICO_Service OR #geico' })
    .update({ value: '@geico OR @GEICO_Service OR #geico' });
};

exports.down = function (knex) {};
