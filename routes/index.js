const express = require('express');
const router = express.Router();

// Giả sử đây là cơ sở dữ liệu giả lập
let users = {
    'user1': 0,
    'user2': 0,
    // thêm các user khác nếu cần
};

// GET route để hiển thị form
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// POST route để xử lý form submission
router.post('/import', (req, res) => {
    const store = req.body.store;
    const code = req.body.code;

    // Giả sử mã code hợp lệ và liên kết với user1
    if (store && code) {
        // Cộng 0.5 điểm cho user
        users['user1'] += 0.5;
        res.send(`User đã được cộng điểm. Điểm hiện tại: ${users['user1']}`);
    } else {
        res.send('Vui lòng chọn store và nhập code.');
    }
});

module.exports = router;
