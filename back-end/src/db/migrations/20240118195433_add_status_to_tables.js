
exports.up = function(knex) {
    return knex.schema.alterTable('tables', function (table) {
        table.string('status');
      });
};

exports.down = function(knex) {
    return knex.schema.alterTable('tables', function (table) {
        table.dropColumn('status');
      });
};
