import AbcSnippet from './abc-snippet.js';
import { useTranslation } from 'react-i18next';
import { Form, Button, Dropdown, Space } from 'antd';
import VoiceSwitch from './components/voice-switch.js';
import { keys, getVoiceDraggers } from './music-puzzle-editor-defaults.js';
import React, { useState, useEffect, useId } from 'react';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { FORM_ITEM_LAYOUT } from '@educandu/educandu/domain/constants.js';
import MarkdownInput from '@educandu/educandu/components/markdown-input.js';
import { sectionEditorProps } from '@educandu/educandu/ui/default-prop-types.js';
import { swapItemsAt, removeItemAt, ensureIsExcluded, moveItem } from '@educandu/educandu/utils/array-utils.js';

import Cadence from './models/model-cadence.js';
import ModelComposition from './model-composition.js'; 
import CircleOfFifthsLinear from './models/model-circle-of-fifths-linear.js';
import CircleOfFifths from './models/model-circle-of-fifths.js';

export default function MusicPuzzleEditor({ content, onContentChanged }) {

  const [voiceDraggers, setvoiceDraggers] = useState(getVoiceDraggers('Stimme')) ;

  const [key, setKey] = useState('C');
  const menuProps = {
    keys,
    onClick: event => setKey(event.key)
  };

  const { t } = useTranslation('musikisum/educandu-plugin-music-puzzle');
  const { text } = content;

  const updateContent = newContentValues => {
    onContentChanged({ ...content, ...newContentValues });
  };

  const [changedVoices, setChangedVoices] = useState();
  const [abcResult, setAbcResult] = useState(ModelComposition.abcOutput('C', 'C', 120, '1/2', [CircleOfFifths.getVoices()]));

  useEffect(() => {
    const opt = Cadence.getDefaultOptions();
    const [upper, middle, lower] = opt.transposeValues;
    const voiceArrangement = voiceDraggers.reduce((akku, vd) => {
      const result = akku + vd.voiceIndex.toString();
      return result;
    }, '');
    const mapObj = {
      '012': [upper, middle, lower],
      '102': [upper, middle - 1, lower],
      '021': [upper, middle, lower],
      '120': [upper, middle, lower - 1],
      '201': [upper + 1, middle - 1, lower],
      '210': [upper + 1, middle, lower]
    };
    opt.transposeValues = mapObj[voiceArrangement];
    opt.voiceArrangement = [voiceDraggers[0].voiceIndex + 1, voiceDraggers[1].voiceIndex + 1, voiceDraggers[2].voiceIndex + 1];
    setAbcResult(ModelComposition.abcOutput('C', 'C', 120, '1/2', [Cadence.getVoices(opt)]));
  }, [voiceDraggers]);

  return (
    <div className="EP_Educandu_Example_Editor">
      <Form labelAlign="left" style={{ width: '100%' }}>
        <div style={{ display: 'flex', width: '100% !important' }}>
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Dropdown menu={menuProps} placement="bottomLeft">
              <Button>{key}</Button>
            </Dropdown>
          </div>
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Button style={{ width: 'fit-content' }}><ArrowUpOutlined /></Button>
            <Button style={{ width: 'fit-content' }}><ArrowDownOutlined /></Button>
          </div>
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Button style={{ width: 'fit-content' }}><ArrowUpOutlined /></Button>
            <Button style={{ width: 'fit-content' }}><ArrowDownOutlined /></Button>
          </div>
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <VoiceSwitch switchButtons={voiceDraggers} setSwitchButtons={setvoiceDraggers} />
          </div>
          <div style={{ flexGrow: 4 }}>
            { abcResult ? <AbcSnippet playableABC={abcResult} /> : null }
          </div>
        </div>
      </Form>
    </div>
  );
}

MusicPuzzleEditor.propTypes = {
  ...sectionEditorProps
};
