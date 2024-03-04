const mySqlConnectAndQuery = require("../../Core/Database");

class IntervalTarget {
  static table_name = "interval_target";

  static async getAll(req) {
    let query = `SELECT goal_id, title, description, interval_target.id, date_start, date_end, user_id, name, surname, email FROM ${IntervalTarget.table_name} INNER JOIN users ON users.id = user_id INNER JOIN goal ON goal.id = goal_id `;

    let p = paginations(req);
    let fromDateStart = req.date_start ?? null;
    let fromDateEnd = req.date_end ?? null;
    let goalTitle = req.goal_title ?? null;
    let params = [];

    if (fromDateStart > fromDateEnd) {
      throw new Error("Date");
    }
    if (fromDateStart) {
      query += `WHERE date_start >= ?`;
      params.push(fromDateStart);
    }
    if (fromDateEnd) {
      query += `${fromDateStart ? " AND" : " WHERE"} date_end <= ?`;
      params.push(fromDateEnd);
    }
    if (goalTitle) {
      query += `${
        fromDateStart || fromDateEnd ? " AND" : " WHERE"
      } title LIKE CONCAT(?,'%')`;
      params.push(goalTitle);
    }
    query += ` ORDER BY users.id`;
    console.log(p);
    if (p) {
      query += ` LIMIT ${p.maxData} OFFSET ${p.offsetData}`;
    }
    return await mySqlConnectAndQuery(query, params);
  }

  static async getIntervalTarget(id) {
    const query = `SELECT interval_target.id, date_start, date_end, user_id, name, surname, goal_id, title, description FROM ${IntervalTarget.table_name} INNER JOIN users ON users.id = user_id INNER JOIN goal ON goal.id = goal_id WHERE interval_target.id = ?`;
    return await mySqlConnectAndQuery(query, id);
  }

  static async createIntervalTarget(body) {
    const query = `INSERT INTO ${IntervalTarget.table_name} (date_start, date_end, user_id, goal_id) VALUES (?,?,?, ?) `;
    let newBody = [body.date_start, body.date_end, body.user_id, body.goal_id];
    if (newBody.includes(undefined)) {
      throw new Error("Body");
    }
    return await mySqlConnectAndQuery(query, newBody);
  }

  static async updateIntervalTarget(currentData, body) {
    const query = `UPDATE ${IntervalTarget.table_name} SET date_start = ?, date_end = ?, goal_id = ? WHERE id = ?`;
    const newData = [
      body.date_start ?? currentData.date_start,
      body.date_end ?? currentData.date_end,
      body.goal_id ?? currentData.goal_id,
      currentData.id,
    ];
    return await mySqlConnectAndQuery(query, newData);
  }

  static async deleteIntervalTarget(id) {
    const query = `DELETE FROM ${IntervalTarget.table_name} WHERE id = ?`;
    let deletedInterval = await this.getIntervalTarget(id);
    const result = mySqlConnectAndQuery(query, [id]);
    return [result, deletedInterval];
  }
}

module.exports = IntervalTarget;
