import express from 'express';
import {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    getFriends,
    getFriendRequests
} from '../controllers/friendController.js';

const router = express.Router();

// Gửi yêu cầu kết bạn
router.post('/requests', sendFriendRequest);
// Chấp nhận yêu cầu kết bạn
router.post('/request/:requestId/accept', acceptFriendRequest);
// Từ chối yêu cầu kết bạn
router.post('/request/:requestId/decline', declineFriendRequest);
// Lấy danh sách bạn bè
router.get('/', getFriends);
// Lấy danh sách yêu cầu kết bạn
router.get('/requests', getFriendRequests);

export default router;
