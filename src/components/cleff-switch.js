//Wird noch nicht verwendet ...

import { Button, Space } from 'antd';
import React, { useState, useRef, useId } from 'react';

function CleffSwitch({ toggleChecked, checked }) {
  return (
    <Space direction="vertical">
      <Button type="primary" size="small" onClick={() => toggleChecked(0)}>
        {checked[0] ? 'Violinschlüssel' : 'Bassschlüssel'}
      </Button>  
      <Button type="primary" size="small" onClick={() => toggleChecked(1)}>
        {checked[1] ? 'Violinschlüssel' : 'Bassschlüssel'}
      </Button>
      <Button type="primary" size="small" onClick={() => toggleChecked(2)}>
        {checked[2] ? 'Violinschlüssel' : 'Bassschlüssel'}
      </Button>  
    </Space>
  );
}

export default CleffSwitch;