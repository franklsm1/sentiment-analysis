exports.up = function (knex) {
  return knex('keyword')
    .insert({
      value: '@progressive OR #progressive',
      status: 'active',
      created_date: new Date()
    })
    .insert({
      value: '@geico OR #geico',
      status: 'active',
      created_date: new Date()
    })
    .insert({
      value: '@statefarm OR #statefarm',
      status: 'active',
      created_date: new Date()
    })
    .insert({
      value: '@farmers OR #farmers',
      status: 'active',
      created_date: new Date()
    });
};

exports.down = function (knex) {

};
