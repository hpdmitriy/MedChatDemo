import {ASSISTANTS} from '../utils/constants';
import {indexOf, findIndex, toLower, has} from 'lodash';
import he from 'he';
import {EMOJI_CLASSES} from '../utils/constants'

export function getCookie(name) {
  const matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
export function isAssistant(role) {
  return indexOf(ASSISTANTS, role) >= 0;
}

export function getPrevConversation(conversations, id) {
  const findById = findIndex(conversations, function (o) {
    return o.id === id;
  });
  if (conversations.length === 1 && findById === 0) {
    return 'last_chat'
  } else if (conversations.length > 1 && findById === 0) {
    return conversations[findById + 1].id
  } else if (conversations.length > 1 && findById > 0) {
    return conversations[findById - 1].id
  } else {
    return null;
  }

}

export function getNotEmptyConversation(conversations) {
  const findById = findIndex(conversations, function (o) {
    return o.isEmptyConversation === false;
  });
  if (findById >= 0) {
    return conversations[findById].id
  } else {
    return null
  }
}

export function diffNewMessagesArray(a1, a2) {
  const a1Set = new Set(a1);
  return a2.filter(function (x) {
    return !a1Set.has(x);
  });
}

export function getContentByLocale(url, key) {
  const urlToArray = url.split('/');
  const lang = !!~indexOf(urlToArray, 'ru') ? 'ru' : 'en';
  const keyToLower = toLower(key);
  const data = {
    ru: {
      online: 'В сети',
      offline: 'Не в сети',
      assistant: 'Ассистент',
      assistant_name: 'Мария',
      patient: 'Пациент',
      developer: 'Разработчик',
      admin: 'Админ',
      guest: 'Гость',
      file_size: 'Максимальный размер файла 20Мб',
      write_a_reply: 'Написать...'
    },
    en: {
      online: 'Online',
      offline: 'Offline',
      assistant: 'Assistant',
      assistant_name: 'Mary',
      patient: 'Patient',
      developer: 'Developer',
      admin: 'Admin',
      guest: 'Guest',
      file_size: 'The maximum file size is 20 MB',
      write_a_reply: 'Write a reply...'
    }
  };
  return has(data, [lang, keyToLower]) ? data[lang][keyToLower] : key
}

export function emojifyString(str) {
  const text = he.encode(str);
  if (text === '|||') return text;
  const re = new RegExp(/&#x1F6[^;]+;/img);
  if (!re.test(text)) return str;
  return (
    text.replace(re, (str) => {
        if (str) {
          const code = str.slice(3).slice(0, -1);
          return `<div class="${EMOJI_CLASSES[code]}"/></div>`
        }
      }
    )
  )
}
