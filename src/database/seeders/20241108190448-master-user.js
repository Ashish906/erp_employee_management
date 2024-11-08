'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const today = new Date();
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'Super administrator',
        email: 'super.admin@gmail.com',
        password: '$2a$10$WnxS8nGkc58lcFdeydBNUuPd8y3zDs01Al0pgf93xFClt0dzkayvy', //123456
        is_active: true,
        role: 'admin',
        created_at: today,
        updated_at: today,
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
