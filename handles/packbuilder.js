
class Builder {
    static MessagePack(id, type, msg, pid) {
        let sendjson = {
            action: 'send_msg',
            echo: pid,
            params: {
                user_id: id,
                message: msg,
                message_type: type
            }
        }
        if (type == 'group') {
            sendjson.params.group_id = id
        }
        return sendjson
    }
    static PrivateMessagePack(fid, msg, id) {
        return this.MessagePack(fid, 'private', msg, id);
    }

    static GroupMessagePack(gid, msg, id) {
        return this.MessagePack(gid, 'group', msg, id);
    }
    static LikePack(fid) {
        return {
            action: 'send_like',
            params: {
                user_id: fid,
                times : 10

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
    static GroupRequestPack(flag,sub_type,approve,echo){
        return {
            action:'set_group_add_request',
            echo: echo,
            params:{
                flag,
                sub_type,
                approve
            }
        }
    }
    static FriendRequestPack(flag,approve,echo){
        return {
            action:'set_friend_add_request',
            echo: echo,
            params:{
                flag,
                approve
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