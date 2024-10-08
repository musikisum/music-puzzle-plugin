import ModelUtilities from '../model-utilities.js';
import ModelTemplates from '../model-templates.js';

const _keyObj = {
  'E': { modelKey: 'E', t: 2, accidentals: [[1, 1, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0], [0, 0, 1, 1, 1, 0]] },
  'C#m': { modelKey: 'C#m', t: 0, accidentals: [[0, 1, 0, 1, 0, 0], [1, '^^', 1, 1, '^^', 1], [1, 1, 0, 1, 1, 1]] },
  'A': { modelKey: 'A', t: -2, accidentals: [[1, 0, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0], [0, 0, 1, 1, 0, 0]] },
  'F#m': { modelKey: 'F#m', t: -4, accidentals: [[0, 1, 0, 1, 0, 0], [1, 1, 1, 1, 1, 1], [1, 1, 0, 1, 1, 1]] },
  'D': { modelKey: 'D', t: 1, accidentals: [[1, 0, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0], [0, 0, 1, 0, 0, 0]] },
  'Bm': { modelKey: 'Bm', t: -1, accidentals: [[0, 1, 0, 0, 0, 0], [0, 1, 0, 0, 1, 0], [0, 0, 0, 1, 1, 1]] },
  'G': { modelKey: 'G', t: -3, accidentals: [[0, 0, 0, 0, 0, 1], [0, 1, 0, 0, 1, 0], [0, 0, 1, 0, 0, 0]] },
  'Em': { modelKey: 'Em', t: 2, accidentals: [[0, 1, 0, 0, 0, 0], [0, 1, 0, 0, 1, 0], [0, 0, 0, 1, 1, 0]] },
  'C': { modelKey: 'C', t: 0, accidentals: [[0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0]] },
  'Am': { modelKey: 'Am', t: -2, accidentals: [[0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 0], [0, 0, 0, 1, 0, 0]] },
  'F': { modelKey: 'F', t: -4, accidentals: [[0, 0, 0, 0, 0, 0], [0, '=', 0, 0, '=', 0], [0, 0, 0, 0, 0, 0]] },
  'Dm': { modelKey: 'Dm', t: 1, accidentals: [[0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0]] },
  'Bb': { modelKey: 'Bb', t: -1, accidentals: [[0, 0, 0, -1, 0, 0], [0, 0, 0, 0, 0, 0], [-1, -1, 0, 0, 0, 0]] },   
  'Gm': { modelKey: 'Gm', t: -3, accidentals: [[-1, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0]] },
  'Eb': { modelKey: 'Eb', t: 2, accidentals: [[0, 0, 0, -1, 0, 0], [-1, '=', -1, -1, '=', -1], [-1, -1, 0, 0, 0, -1]] },   
  'Cm': { modelKey: 'Cm', t: 0, accidentals: [[-1, 0, 0, 0, 0, -1], [0, 1, 0, 0, 1, 0], [0, 0, -1, 0, 0, 0]] },
  'Ab': { modelKey: 'Ab', t: -2, accidentals: [[0, -1, 0, -1, 0, 0], [-1, 0, -1, -1, 0, -1], [-1, -1, 0, 0, -1, -1]] },   
  'Fm': { modelKey: 'Fm', t: -4, accidentals: [[-1, 0, 0, 0, 0, -1], [0, '=', 0, 0, '=', 0], [0, 0, -1, 0, 0, 0]] }
};

function _getKeyObject(change) {  
  return _keyObj[change];
}

function getModelKeys() {
  return Object.keys(_keyObj);
}

const getOptions = change => {
  const modelTemplate = ModelTemplates.getModelTemplate('upperFiveModulation');
  if(change) {
    modelTemplate.modelKey = change;
  }
  return modelTemplate;
};

const getVoices = upperFifthModulationOptions => {
  const voicesLength = 6;
  const measure = [' | ', ' ', ' | ', ' ', ' | ', ' '];
  const voices = [[9, 8, 8, 7, 7, 6], [4, 3, 4, 4, 3, 4], [0, 0, -1, -2, 1, -3]];
  const options = upperFifthModulationOptions || getOptions();

  // Set values for prinner selection 
  const prinner = options.addProps['prinner'][0];
  if(prinner) {
    options.addProps['changeMode'] = [false, true];
    options.addProps['begin65'] = [false, true];
  } else {
    options.addProps['changeMode'][1] = false;
    options.addProps['begin65'][1] = false;
  }
  
  // Set values for changing mode or 6-5 begin
  const changeMode = options.addProps['changeMode'][0];
  const begin65 = options.addProps['begin65'][0];
  const keyObject = _getKeyObject(options.modelKey);
  if(!prinner) {
    switch (options.modelKey) {
      case 'C':
      case 'F':
      case 'B':
        keyObject.accidentals[0][5] = changeMode ? -1 : 0;
        keyObject.accidentals[2][2] = changeMode ? -1 : 0;
        options.addProps['changeMode'][1] = false;
        break;
      case 'Am':
      case 'Dm':
      case 'Gm':
      case 'Em':
      case 'Bm':
        keyObject.accidentals[0][5] = changeMode ? 1 : 0;
        keyObject.accidentals[2][2] = changeMode ? 1 : 0;
        options.addProps['changeMode'][1] = false;
        break;
      case 'Cm':
      case 'Fm':
        keyObject.accidentals[0][5] = changeMode ? 0 : -1;
        keyObject.accidentals[2][2] = changeMode ? 0 : -1;
        options.addProps['changeMode'][1] = false;
        break;
      case 'G':
      case 'D':
      case 'A':
      case 'E':
        keyObject.accidentals[0][5] = changeMode ? 0 : 1;
        keyObject.accidentals[2][2] = changeMode ? 0 : 1;
        options.addProps['changeMode'][1] = false;
        break;
      default:
        options.addProps['changeMode'][1] = true;
        break;
    }
  }  

  return ModelUtilities.getVoices(
    options.transposeValues, 
    options.voiceArrangement, 
    voices, 
    keyObject, 
    voicesLength, 
    measure,
    begin65,
    prinner
  );
};

const _adjustMutetVoices = (voices, hideUpperSystem, hideLowerSystem) => {
  return ModelUtilities.convertToEmptyLines(voices, hideUpperSystem, hideLowerSystem);
}

const UpperFiveModulation = {
  getDefaultOptions: getOptions,
  getVoices,
  getModelKeys,
  getMutedVoices: (voices, hideUpperSystem, hideLowerSystem) => _adjustMutetVoices(voices, hideUpperSystem, hideLowerSystem)
};

export default UpperFiveModulation;