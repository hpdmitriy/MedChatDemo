import request from '../utils/request';
import {API_URL_USER} from '../utils/constants'
import {isNull} from 'lodash';

export function get(id) {
    if(id && id.length < 32) {
        return request(`${API_URL_USER}/${id}`, 'get');
    } else {
        return request(API_URL_USER, 'post', {data:id});
    }
}
export function write(data) {
    return request(API_URL_USER, 'post', data);
}
