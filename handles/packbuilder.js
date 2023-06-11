
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
    static MessagePack(id, type, msg) {
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
    static DeleteMsgPack(id) {
        return {
            action: 'delete_msg',
            params: {
                message_id: id
            }
        }
    }
    static GroupBanPack(gid, mid, duration) {
        return {
            action: 'set_group_ban',
            params: {
                group_id: gid,
                user_id: mid,
                duration
            }
        }
    }
    static GroupMemberListPack(gid,id) {
        return {
            action: 'get_group_member_list',
            echo: id,
            params: {
                group_id:gid
            }
        }
    }
    static GroupMemberInfoPack(gid,mid,id){
        return {
            action: 'get_group_member_info',
            echo:id,
            params:{
                group_id: gid,
                user_id:mid
            }
        }
    }
}


module.exports = Builder;