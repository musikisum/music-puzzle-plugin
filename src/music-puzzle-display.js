import { Typography } from 'antd';
import AbcSnippet from './abc-snippet.js';
import ModelHelper from './model-helper.js';
import { useTranslation } from 'react-i18next';
import ModelProvider from './model-provider.js';
import Transposer from './components/transposer.js';
import React, { useEffect, useState } from 'react';
import ModelComposition from './model-composition.js';
import Markdown from '@educandu/educandu/components/markdown.js';
import { sectionDisplayProps } from '@educandu/educandu/ui/default-prop-types.js';
import Collapse, { COLLAPSIBLE_COLOR } from '@educandu/educandu/components/collapsible.js';

export default function MusicPuzzleDisplay({ content }) {

  const { t } = useTranslation('musikisum/educandu-plugin-music-puzzle');
  const { Paragraph, Text } = Typography;
  const capitalizeFirstLetter = modelName => `${modelName[0].toUpperCase()}${modelName.slice(1)}`;

  const { 
    modelTemplates, 
    measuresPerLine, 
    measure, 
    tempo, 
    stretchLastLine, 
    isTransposible, 
    transposeValue, 
    showDescription,
    hideUpperSystem, 
    hideLowerSystem, 
    showExample
  } = content;
 
  const [abcResult, setAbcResult] = useState(''); 
  const [descriptionParts, setDescriptionParts] = useState([]);

  useEffect(() => {
    if(modelTemplates.length > 0) {
      const voices = [];
      const descriptions = [];
      for (let index = 0; index < modelTemplates.length; index++) {
        const modelTemplate = modelTemplates[index];
        const voiceModel = ModelProvider.getModel(modelTemplate.name);
        let modelVoices;
        if (!hideUpperSystem && !hideLowerSystem) {
          modelVoices = voiceModel.getVoices(modelTemplate);
        } else {
          modelVoices = voiceModel.getMutedVoices(voiceModel.getVoices(modelTemplate), hideUpperSystem, hideLowerSystem);
        }
        voices.push(modelVoices);
        const text = modelTemplate.customDescription === ''
          ? t(`defaultDescription${capitalizeFirstLetter(modelTemplate.name)}`)
          : modelTemplate.customDescription; 
        descriptions.push(text);        
      }
      const playableABC = ModelComposition.abcOutput('C', measure, tempo, voices, measuresPerLine, stretchLastLine);
      let transposedPlayableABC = null;
      if (isTransposible) {
        transposedPlayableABC = Transposer.getTransposition(playableABC, transposeValue); 
      }
      setAbcResult(transposedPlayableABC ?? playableABC);
      setDescriptionParts(descriptions);
    }    
  }, []);

  return (
    <div className='EP_Educandu_Example_Display'>
      <div className={`u-horizontally-centered u-width-${content.width}`}>
        <div>
          { abcResult ? <AbcSnippet playableABC={abcResult} /> : null }
        </div>
        <div style={{ textAlign: 'center' }}>
          { (modelTemplates.length !== 0) 
          && <Paragraph 
            className='svg-color' 
            copyable={{ text: abcResult,  tooltips: [t('abcCopyTtBevore'), t('abcCopyTtAfter')] }}
            >
            {t('abcCopy')}
          </Paragraph> }
        </div>
        <div className='vSpacer' />
        { descriptionParts.length !== 0 && showDescription
          ? <Collapse 
            collapsible="icon" 
            title={t('descriptionTitle')} 
            defaultActiveKey="panel"
            >
            <Markdown renderAnchors className='u-horizontally-centered u-width-100'>
              {descriptionParts.reduce((akku, description) => !akku ? description : `${akku}\n\n---\n\n${description}`, '')}
            </Markdown>
          </Collapse>
          : null}
      </div>
    </div>
  );
}

MusicPuzzleDisplay.propTypes = {
  ...sectionDisplayProps
};
