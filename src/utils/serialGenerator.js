import { mariadb } from '../config/mariadb.js';
import '../config/mongodb.js';

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

// Types that use simple auto-increment (org_short_name + type_code + sequence)
const SIMPLE_INCREMENT_TYPES = ['shift', 'project'];

class SerialNumberGenerator {
  /**
   * Get current year and month in YYYYMM format
   */
  static getCurrentYearMonth() {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1)}`;
  }

  /**
   * Generate serial number based on org_short_name and data_type
   * - For shift & project: NUTANTEKP1, NUTANTEKS2 (simple increment)
   * - For others: NUTANTEKA202512001 (with year-month and sequence)
   */
  static async generateSerialNumber(org_short_name, data_type, connection) {

    if (!connection) {
      throw new Error('DB connection is required for serial generation');
    }

    if (!TYPE_CODE_MAP[data_type]) {
      throw new Error(`Invalid data_type: ${data_type}`);
    }

    const typeCode = TYPE_CODE_MAP[data_type];
    // const connection = await mariadb.getConnection();

    //try {
    // await connection.beginTransaction();

    // Lock the row for this org and data_type
    const [rows] = await connection.query(
      `SELECT last_sequence FROM running_serial_numbers 
         WHERE org_short_name = ? AND data_type = ? FOR UPDATE`,
      [org_short_name, data_type]
    );
    let nextSequence = 1;
    let serialNumber;

    if (rows.length) {
      nextSequence = rows[0].last_sequence + 1;
    }


    // Generate serial number based on type
    if (SIMPLE_INCREMENT_TYPES.includes(data_type)) {
      // Simple format: NUTANTEKP1, NUTANTEKS2
      serialNumber = `${org_short_name}${typeCode}${nextSequence}`;
    } else {
      // Complex format: NUTANTEKA202512001 (org + type + yearmonth + sequence)
      const yearMonth = this.getCurrentYearMonth();
      serialNumber = `${org_short_name}${typeCode}${yearMonth}${(nextSequence)}`;
    }

    // Update or Insert the sequence
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

    // ⭐ IMPORTANT: Commit only happens AFTER the entire request succeeds
    // The calling code should handle transaction commit/rollback based on business logic success
    //await connection.commit();

    return serialNumber;
    // } catch (err) {
    //   //await connection.rollback();
    //   throw err;
    // } finally {
    //   connection.release();
    // }
  }

  /**
   * Generate org_id with auto-increment (ORG1, ORG2, ORG3...)
   */
  static async generateOrgId() {
    const connection = await mariadb.getConnection();

    try {
      await connection.beginTransaction();

      // Get the last org sequence
      const [rows] = await connection.query(
        `SELECT MAX(CAST(SUBSTRING(org_id, 4) AS UNSIGNED)) as last_num 
         FROM organization_master FOR UPDATE`
      );

      let nextNum = 1;
      if (rows.length && rows[0].last_num) {
        nextNum = rows[0].last_num + 1;
      }

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
   * Reset sequence for a specific org and data_type (optional utility)
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
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  }
}

export default SerialNumberGenerator;