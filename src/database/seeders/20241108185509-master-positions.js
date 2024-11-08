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
    await queryInterface.bulkInsert('positions', [
      {
        id: 1,
        name: 'CTO',
        created_at: today,
        updated_at: today,
      },
      {
        id: 2,
        name: 'Senior Software Engineer',
        created_at: today,
        updated_at: today,
      },
      {
        id: 3,
        name: 'Software Engineer',
        created_at: today,
        updated_at: today,
      },
      {
        id: 4,
        name: 'Junior Software Engineer',
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
    await queryInterface.bulkDelete('positions', null, {});
  }
};
