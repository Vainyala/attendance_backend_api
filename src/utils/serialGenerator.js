const { mariadb } = require('../config/mariadb.js');
require('../config/mongodb.js');

const TYPE_CODE_MAP = {
  emp: 'E',
  project: 'P',
  att: 'A',
  shift: 'S',
  leave: 'L',
  reg: 'R',
  timesheet: 'T',
  project_site: 'PS'
};

// Types that use simple auto-increment
const SIMPLE_INCREMENT_TYPES = ['shift', 'project'];

class SerialNumberGenerator {
  /**
   * Get current year and month in YYYYMM format
   */
  static getCurrentYearMonth() {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  /**
   * Generate serial number
   */
  static async generateSerialNumber(org_short_name, data_type, connection) {
    if (!connection) {
      throw new Error('DB connection is required for serial generation');
    }

    if (!TYPE_CODE_MAP[data_type]) {
      throw new Error(`Invalid data_type: ${data_type}`);
    }

    const typeCode = TYPE_CODE_MAP[data_type];

    const [rows] = await connection.query(
      `SELECT last_sequence 
       FROM running_serial_numbers 
       WHERE org_short_name = ? AND data_type = ? 
       FOR UPDATE`,
      [org_short_name, data_type]
    );

    let nextSequence = rows.length ? rows[0].last_sequence + 1 : 1;
    let serialNumber;

    // Simple format
    if (SIMPLE_INCREMENT_TYPES.includes(data_type)) {
      serialNumber = `${org_short_name}${typeCode}${nextSequence}`;
    } else {
      const yearMonth = this.getCurrentYearMonth();
      serialNumber = `${org_short_name}${typeCode}${yearMonth}${nextSequence}`;
    }

    // Update / Insert
    if (rows.length) {
      await connection.query(
        `UPDATE running_serial_numbers
         SET last_serial_number = ?, last_sequence = ?, updated_at = NOW()
         WHERE org_short_name = ? AND data_type = ?`,
        [serialNumber, nextSequence, org_short_name, data_type]
      );
    } else {
      await connection.query(
        `INSERT INTO running_serial_numbers
         (org_short_name, data_type, last_serial_number, last_sequence, created_at, updated_at)
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [org_short_name, data_type, serialNumber, nextSequence]
      );
    }

    return serialNumber;
  }

  /**
   * Generate org_id (ORG1, ORG2...)
   */
  static async generateOrgId() {
    const connection = await mariadb.getConnection();

    try {
      await connection.beginTransaction();

      const [rows] = await connection.query(
        `SELECT MAX(CAST(SUBSTRING(org_id, 4) AS UNSIGNED)) AS last_num
         FROM organization_master
         FOR UPDATE`
      );

      const nextNum = rows[0]?.last_num ? rows[0].last_num + 1 : 1;
      const orgId = `ORG${nextNum}`;

      await connection.commit();
      return orgId;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  /**
   * Reset sequence
   */
  static async resetSequence(org_short_name, data_type) {
    const connection = await mariadb.getConnection();

    try {
      await connection.query(
        `DELETE FROM running_serial_numbers
         WHERE org_short_name = ? AND data_type = ?`,
        [org_short_name, data_type]
      );
      return true;
    } finally {
      connection.release();
    }
  }
}

module.exports = SerialNumberGenerator;
