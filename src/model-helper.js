import ModelProvider from './models/model-provider.js';

// Provide the abc.js tone names for c1 to b2.
const diatonicScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'c', 'd', 'e', 'f', 'g', 'a', 'b'];

// Replace a number for octave transposition up or down in a abc.js sign.  
const transpose = (number, tone) => {
  switch (number) {
    case -3:
      return `${tone},,,`;
    case -2:
      return `${tone},,`;
    case -1:
      return `${tone},`;      
    case 1:
      return `${tone}'`;  
    case 2:
      return `${tone}''`;  
    case 3:
      return `${tone}'''`;
    default:
      return tone;
  }
};

// Composes abc.js characters for values outside the valid range of the diatonic scale.
const validate = index => {
  let value = '';
  let diatonicIndex = index;
  if (diatonicIndex < 0) {
    do {
      value += ',';
      diatonicIndex += 7;
    } while (diatonicIndex < 0);      
  }
  if (diatonicIndex > 13) {
    do {
      value += '\'';
      diatonicIndex -= 7;
    } while (diatonicIndex <= 13);
  }
  const result = `${diatonicScale[diatonicIndex]}${value}`;
  return result;
};

// Provides meta informations for an abc.js header of a phrase model combination in a key and a measure.
const getMeta = (key, measure, tempo, length) => {
  return `X:1\n%%score [(1 2) 3]\nM:${measure}\nQ:${tempo}\nL:${length}\nK:${key}\n`;
};

// Method to replace an half tone number to a abc.js sign.
const getSign = sign => {
  switch (sign) {
    case 1:
      return '^';  
    case -1:
      return '_';
    case 0:
      return '';
    default:
      return sign;
  }
};

const updateTransposeValues = (voiceArr, modelName) => {
  const model = ModelProvider.getModel(modelName);
  const dtv = model.getDefaultOptions().transposeValues;
  console.log('va:', voiceArr, 'tv:', dtv);
  //cadence: 0,0,-1
  const mapObj = {
    '012': [dtv[0], dtv[1], dtv[2]],
    '102': [dtv[0], dtv[1] - 1, dtv[2]],
    '021': [dtv[0], dtv[1], dtv[2]],
    '120': [dtv[0], dtv[1], dtv[2] - 1],
    '201': [dtv[0] + 1, dtv[1] - 1, dtv[2]],
    '210': [dtv[0] + 1, dtv[1], dtv[2]]
  };
  const returnValue = mapObj[voiceArr];
  console.log('rv:', returnValue)
  return returnValue;
};

const modelTemplates = {
  cadence: {
    modelKey: '',
    name: 'cadence',
    key: 'C',
    transposeValues: [0, 0, -1],
    voiceArrangement: [1, 2, 3],
    radioValue: 0,
    customDescription: "",
    showDescription: false,
    addProps: { 
      isFinal: false,
      isBegin: false,
      isDeceptiv: false
    }
  },
  circleOfFifths:  {
    modelKey: '',
    name: 'circleOfFifths',
    key: 'C',
    transposeValues: [0, 0, 0],
    voiceArrangement: [1, 2, 3],
    radioValue: 0,
    customDescription: "",
    showDescription: false
  },
  circleOfFifthsLinear: {
    modelKey: '',
    name: 'circleOfFifthsLinear',
    key: 'C',
    transposeValues: [0, 0, -1],
    voiceArrangement: [1, 2, 3],
    customDescription: "",
    showDescription: false,
    addProps: {
      lastBassNoteUp: false
    }
  },
  fiveSixConsecutive: {
    modelKey: '',
    name: 'fiveSixConsecutive',
    key: 'C',
    transposeValues: [0, 0, -1],
    voiceArrangement: [1, 2, 3],
    customDescription: "",
    showDescription: false,
    addProps: {
      partLengthValues: [6, 6],
      partToBeginValues: [1, 6]
    }
  }
};
 
const ModelHelper = {
  meta: getMeta,
  transposeOctave: transpose,
  validateValue: validate,
  getSign,
  updateTransposeValues,
  getModelTemplate: modelName => modelTemplates[modelName]
};

export default ModelHelper;