import { mariadb } from '../config/mariadb.js';
import '../config/mongodb.js';

const TYPE_CODE_MAP = {
  emp: 'E',
  project: 'P',
  att: 'A',
  mgr: 'M',
  shift: 'S',
  leave: 'L',
  reg: 'R',
  timesheet: 'T',
  role: 'OR',
  project_site: 'PS'
};

class SerialNumberGenerator {
  static getCurrentDate() {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  }

  static async generateSerialNumber(org_id, data_type) {
    if (!TYPE_CODE_MAP[data_type]) {
      throw new Error(`Invalid data_type: ${data_type}`);
    }

    const typeCode = TYPE_CODE_MAP[data_type];
    const currentDate = this.getCurrentDate();
    const connection = await mariadb.getConnection();

    try {
      await connection.beginTransaction();

      const [rows] = await connection.query(
        `SELECT last_sequence
             FROM running_serial_numbers
             WHERE org_id = ? AND data_type = ?
             FOR UPDATE`,
        [org_id, data_type]
      );

      let nextSequence = 1;

      if (rows.length) {
        nextSequence = rows[0].last_sequence + 1;
      }

      const serialNumber =
        `${org_id}${typeCode}${currentDate}${String(nextSequence).padStart(5, '0')}`;

      if (rows.length) {
        await connection.query(
          `UPDATE running_serial_numbers
                 SET last_serial_number = ?, last_sequence = ?, last_date = CURDATE()
                 WHERE org_id = ? AND data_type = ?`,
          [serialNumber, nextSequence, org_id, data_type]
        );
      } else {
        await connection.query(
          `INSERT INTO running_serial_numbers
                 (org_id, data_type, last_serial_number, last_sequence, last_date)
                 VALUES (?, ?, ?, ?, CURDATE())`,
          [org_id, data_type, serialNumber, nextSequence]
        );
      }

      await connection.commit();
      return serialNumber;

    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

}

export default SerialNumberGenerator;
