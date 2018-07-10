/* global fetch, Vue */


const app = new Vue({
  el: '#app',
  data: {
    processes: [],
    test: 'two',
  },
  methods: {
    toggleInUse(event) {
      const { target: { dataset } } = event;
      const option = this.processes[dataset.process][dataset.practice].options[dataset.option];
      option.inUse = !option.inUse;
    },
    changeValue(event) {
      const { target } = event;
      const inputField = target.closest('div').querySelector('.optionField');
      inputField.classList.toggle('active');
      inputField.focus();
      inputField.value = '';
    },
    makeOptionFieldId(key) {
      return `${key.replace(/ /g, '_')}-field`;
    },
    makeOptionListId(key) {
      return `${key.replace(/ /g, '_')}-list`;
    },
    setPracticeOption(processKey, practiceKey, event) {
      const { target } = event;
      Vue.set(app.processes[processKey][practiceKey], 'current', target.value);
      target.classList.remove('active');
    },
  },
});

function addKey(obj, key) {
// eslint-disable-next-line no-param-reassign
  obj[key] = {};
  return obj;
}

function keysToObject(keys) {
  return keys.reduce(addKey, {});
}

function getDefaultOption(options) {
  return (options.startsWith('eg:'))
    ? options.slice(3).split(',')[0].trim()
    : options;
}

function makeOptionsList(options) {
  return (options.startsWith('eg:'))
    ? keysToObject(options.slice(3).split(',').map(str => str.trim()))
    : keysToObject([]);
}

function makeProcesses(json) {
  Object.keys(json.processes)
    .forEach((processKey) => {
      const process = json.processes[processKey];
      Object.keys(process)
        .forEach((practiceKey) => {
          const options = process[practiceKey];
          process[practiceKey] = {
            pros: [],
            cons: [],
            current: getDefaultOption(options),
            options: makeOptionsList(options),
          };
        });
    });
  return json.processes;
}

function fetchProcesses() {
  return fetch('./processes.json')
    .then(response => response.json())
    .then((json) => { app.processes = makeProcesses(json); });
}

fetchProcesses();
