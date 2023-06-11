class Builder {
    static PrivateMessagePack(fid, msg) {
        return {
            action: 'send_private_msg',
            params: {
                user_id: fid,
                message: msg
            }
        };
    }
    static GroupMessagePack(gid, msg) {
        return {
            action: 'send_group_msg',
            params: {
                group_id: gid,
                message: msg
            }
        };
    }
    static MessagePack(id,  type,msg) {
        return {
            action: 'send_msg',
            params: {
                user_id: id,
                group_id: id,
                message: msg,
                message_type: type
            }
        }
    }
}


module.exports = Builder;