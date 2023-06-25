
class Builder {
    static MessagePack(id, type, msg, pid) {
        return {
            action: 'send_msg',
            echo: pid,
            params: {
                user_id: id,
                group_id: id,
                message: msg,
                message_type: type
            }
        }
    }
    static PrivateMessagePack(fid, msg, id) {
        return this.MessagePack(fid, 'private', msg, id);
    }
    static GroupMessagePack(gid, msg, id) {
        return this.MessagePack(gid, 'group', msg, id);
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
    static GroupMemberListPack(gid, id) {
        return {
            action: 'get_group_member_list',
            echo: id,
            params: {
                group_id: gid
            }
        }
    }
    static GroupMemberInfoPack(gid, mid, id) {
        return {
            action: 'get_group_member_info',
            echo: id,
            params: {
                group_id: gid,
                user_id: mid
            }
        }
    }
    static GroupForwardMessagePack(gid,msg,id){
        return {
            action : 'send_group_forward_msg',
            echo:id,
            params:{
                group_id : gid,
                messages:msg
            }
        }
    }
}


module.exports = Builder;