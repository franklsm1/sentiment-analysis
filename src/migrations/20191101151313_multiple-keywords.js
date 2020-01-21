exports.up = function (knex) {
  return knex('keyword')
    .insert([
      {
        value: '@progressive OR #progressiveInsurance',
        status: 'active',
        created_date: new Date()
      },
      {
        value: '@geico OR OR @GEICO_Service OR #geico',
        status: 'active',
        created_date: new Date()
      },
      {
        value: '@statefarm OR #statefarm',
        status: 'active',
        created_date: new Date()
      },
      {
        value: '@WeAreFarmers OR #farmersinsurance',
        status: 'active',
        created_date: new Date()
      }
    ]);
};

exports.down = function (knex) {};
