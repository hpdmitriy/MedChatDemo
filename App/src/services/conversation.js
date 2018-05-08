import request from '../utils/request';
import {API_URL_CONVERSATION} from '../utils/constants'

export function getById({id, change}) {
        return request(`${API_URL_CONVERSATION}/${id}?change=${change}`, 'get');
}
export function deleteById(id, uid) {
        return request(`${API_URL_CONVERSATION}/${id}`, 'delete', {uid: uid});
}
export function findByMember(data) {
    const {id,role} = data;
    return request(`${API_URL_CONVERSATION}/${id}?role=${role}`, 'get');
}

