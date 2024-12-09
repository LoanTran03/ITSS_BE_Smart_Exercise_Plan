const pool = require('./pool');

function User() {};

User.prototype = {

    // Tìm người dùng theo id hoặc username
    find: function(user = null, callback) {
        let sql = `SELECT * FROM users WHERE email = ?`;

        pool.query(sql, user, function(err, result) {
            if (err) throw err;
            callback(result.length ? result[0] : null);
        });
    },

    // Tạo người dùng mới (không mã hóa mật khẩu)
    create: function(body, callback) {
        const pwd = body.password;
        // Không mã hóa mật khẩu, lưu trực tiếp mật khẩu gốc
        body.password = pwd;

        const bind = Object.values(body);  // Lấy các giá trị từ đối tượng `body`
        const sql = `INSERT INTO users(email, fullname, password) VALUES (?, ?, ?)`;

        pool.query(sql, bind, function(err, result) {
            if (err) throw err;
            callback(result.insertId);  // Trả về id của người dùng mới tạo
        });
    },

    /*
    // Đăng nhập (so sánh mật khẩu người dùng với DB)
    login: function(email, password, callback) {
        this.find(email, function(user) {
            if (user && user.password === password) {  // So sánh mật khẩu trực tiếp
                callback(user);  // Nếu thông tin đúng, trả về dữ liệu người dùng
            } else {
                callback(null);  // Nếu sai, trả về null
            }
        });
    },
    */
};

module.exports = User;
