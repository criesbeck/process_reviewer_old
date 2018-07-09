/* global fetch, Vue */


const app = new Vue({
  el: '#app',
  data: {
    processes: [],
  },
  methods: {
    toggleInUse(event) {
      const { target: { dataset } } = event;
      const option = this.processes[dataset.process][dataset.practice].options[dataset.option];
      option.inUse = !option.inUse;
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
function makeOptions(option) {
  return (option.startsWith('eg:'))
    ? keysToObject(option.slice(3).split(',').map(str => str.trim()))
    : keysToObject(['less', option, 'more']);
}

function makeProcesses(json) {
  Object.keys(json.processes)
    .forEach((processKey) => {
      const process = json.processes[processKey];
      Object.keys(process)
        .forEach((practiceKey) => {
          process[practiceKey] = {
            pros: [],
            cons: [],
            options: makeOptions(process[practiceKey]),
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
