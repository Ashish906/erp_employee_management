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
        id: 2,
        name: 'CTO',
        email: 'cto@gmail.com',
        password: '$2a$10$WnxS8nGkc58lcFdeydBNUuPd8y3zDs01Al0pgf93xFClt0dzkayvy', //123456
        is_active: true,
        role: 'employee',
        created_at: today,
        updated_at: today,
      },
      {
        id: 3,
        name: 'SSE1',
        email: 'sse1@gmail.com',
        password: '$2a$10$WnxS8nGkc58lcFdeydBNUuPd8y3zDs01Al0pgf93xFClt0dzkayvy', //123456
        is_active: true,
        role: 'employee',
        created_at: today,
        updated_at: today,
      },
      {
        id: 4,
        name: 'SSE2',
        email: 'sse2@gmail.com',
        password: '$2a$10$WnxS8nGkc58lcFdeydBNUuPd8y3zDs01Al0pgf93xFClt0dzkayvy', //123456
        is_active: true,
        role: 'employee',
        created_at: today,
        updated_at: today,
      },
      {
        id: 5,
        name: 'SE1',
        email: 'se1@gmail.com',
        password: '$2a$10$WnxS8nGkc58lcFdeydBNUuPd8y3zDs01Al0pgf93xFClt0dzkayvy', //123456
        is_active: true,
        role: 'employee',
        created_at: today,
        updated_at: today,
      },
      {
        id: 6,
        name: 'SE2',
        email: 'se2@gmail.com',
        password: '$2a$10$WnxS8nGkc58lcFdeydBNUuPd8y3zDs01Al0pgf93xFClt0dzkayvy', //123456
        is_active: true,
        role: 'employee',
        created_at: today,
        updated_at: today,
      }
    ], {});

    await queryInterface.bulkInsert('employees', [
      {
        id: 1,
        name: 'CTO',
        position_id: 1,
        supervisor_id: null,
        left_boundary: 1,
        right_boundary: 10,
        user_id: 2,
        created_at: today,
        updated_at: today,
      },
      {
        id: 2,
        name: 'Senior software engineer 1',
        position_id: 2,
        supervisor_id: 1,
        left_boundary: 2,
        right_boundary: 5,
        user_id: 3,
        created_at: today,
        updated_at: today,
      },
      {
        id: 3,
        name: 'Senior software engineer 2',
        position_id: 2,
        supervisor_id: 1,
        left_boundary: 6,
        right_boundary: 9,
        user_id: 4,
        created_at: today,
        updated_at: today,
      },
      {
        id: 4,
        name: 'Software engineer 1',
        position_id: 3,
        supervisor_id: 2,
        left_boundary: 3,
        right_boundary: 4,
        user_id: 5,
        created_at: today,
        updated_at: today,
      },
      {
        id: 5,
        name: 'Software engineer 2',
        position_id: 3,
        supervisor_id: 3,
        left_boundary: 7,
        right_boundary: 8,
        user_id: 6,
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
      await queryInterface.bulkDelete('employees', null, {});
  }
};
