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
      const inputField = target.parentNode.querySelector('.optionField');
      inputField.value = '';
    },
    makeOptionFieldId(key) {
      return `${key.replace(/ /g, '_')}-field`;
    },
    makeOptionListId(key) {
      return `${key.replace(/ /g, '_')}-list`;
    },
    setPracticeOption(processKey, practiceKey, event) {
      Vue.set(app.processes[processKey][practiceKey], 'current', event.target.value);
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
    ? options.slice(3).split(',')[0]
    : options;
}

function makeOptionsList(options) {
  return (options.startsWith('eg:'))
    ? keysToObject(options.slice(3).split(',').map(str => str.trim()))
    : keysToObject(['less', 'more']);
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
